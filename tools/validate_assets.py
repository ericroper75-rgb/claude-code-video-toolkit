#!/usr/bin/env python3
"""
Validate project media assets before render (ffprobe checks).

Scans a project's Remotion config for audio/video scene references,
confirms each referenced file exists under public/, and probes it with
ffprobe to catch corrupt files, zero-duration clips, and missing streams
before a render burns time on broken assets.

Usage:
    # Validate the current project (auto-detects config)
    python3 tools/validate_assets.py

    # Explicit paths
    python3 tools/validate_assets.py --config src/config/sprint-config.ts --public-dir public

    # Machine-readable output (exit code 1 if any errors)
    python3 tools/validate_assets.py --json
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from sync_timing import (  # noqa: E402
    TEMPLATE_TYPES,
    detect_config_file,
    detect_template_type,
    parse_scenes_from_config,
)

# 16:9 tolerance for aspect-ratio warnings (not an error — some scenes are intentionally different)
EXPECTED_ASPECT = 16 / 9
ASPECT_TOLERANCE = 0.05


def ffprobe_asset(file_path: Path) -> dict:
    """Probe a media file with ffprobe. Returns a result dict.

    {ok, error, duration_seconds, has_video, has_audio, width, height, video_codec}
    """
    result = {
        "ok": False,
        "error": None,
        "duration_seconds": None,
        "has_video": False,
        "has_audio": False,
        "width": None,
        "height": None,
        "video_codec": None,
    }

    try:
        proc = subprocess.run(
            [
                "ffprobe",
                "-v", "error",
                "-show_entries", "format=duration",
                "-show_entries", "stream=codec_type,codec_name,width,height",
                "-of", "json",
                str(file_path),
            ],
            capture_output=True,
            text=True,
        )
    except FileNotFoundError:
        result["error"] = "ffprobe not found (install ffmpeg)"
        return result

    if proc.returncode != 0:
        result["error"] = proc.stderr.strip() or "ffprobe failed (file may be corrupt)"
        return result

    try:
        data = json.loads(proc.stdout)
    except json.JSONDecodeError:
        result["error"] = "ffprobe returned unparseable output"
        return result

    duration = data.get("format", {}).get("duration")
    if duration is not None:
        result["duration_seconds"] = round(float(duration), 2)

    for stream in data.get("streams", []):
        if stream.get("codec_type") == "video" and not result["has_video"]:
            result["has_video"] = True
            result["width"] = stream.get("width")
            result["height"] = stream.get("height")
            result["video_codec"] = stream.get("codec_name")
        elif stream.get("codec_type") == "audio":
            result["has_audio"] = True

    if not result["has_video"] and not result["has_audio"]:
        result["error"] = "no video or audio streams found"
        return result

    if result["duration_seconds"] is None or result["duration_seconds"] <= 0:
        result["error"] = "zero or missing duration"
        return result

    result["ok"] = True
    return result


def resolve_asset_path(public_dir: Path, ref: str, subdir_fallback: str | None = None) -> Path | None:
    """Resolve a scene's audioFile/videoFile reference against public/.

    Tries the reference as-is, then falls back to public/<subdir_fallback>/<basename>
    (mirrors the lookup sync_timing.py uses for demo videos).
    """
    candidate = public_dir / ref
    if candidate.exists():
        return candidate
    if subdir_fallback:
        fallback = public_dir / subdir_fallback / Path(ref).name
        if fallback.exists():
            return fallback
    return None


def validate_scenes(scenes: list[dict], public_dir: Path) -> list[dict]:
    """Run asset checks for every audioFile/videoFile referenced by scenes.

    Returns a list of check-result dicts, one per referenced asset.
    """
    checks = []

    for i, scene in enumerate(scenes):
        scene_label = f"{i + 1:02d} {scene.get('type', '?')}"

        for field, subdir in (("audioFile", "audio/scenes"), ("videoFile", "demos")):
            ref = scene.get(field)
            if not ref:
                continue

            check = {
                "scene_index": i,
                "scene_label": scene_label,
                "field": field,
                "reference": ref,
            }

            path = resolve_asset_path(public_dir, ref, subdir)
            if path is None:
                check["status"] = "error"
                check["error"] = f"file not found: {ref}"
                checks.append(check)
                continue

            check["resolved_path"] = str(path)
            probe = ffprobe_asset(path)

            if not probe["ok"]:
                check["status"] = "error"
                check["error"] = probe["error"]
                checks.append(check)
                continue

            check["duration_seconds"] = probe["duration_seconds"]
            warnings = []

            if field == "videoFile":
                if not probe["has_video"]:
                    check["status"] = "error"
                    check["error"] = "no video stream found"
                    checks.append(check)
                    continue
                check["width"] = probe["width"]
                check["height"] = probe["height"]
                check["video_codec"] = probe["video_codec"]
                if probe["width"] and probe["height"]:
                    aspect = probe["width"] / probe["height"]
                    if abs(aspect - EXPECTED_ASPECT) > ASPECT_TOLERANCE:
                        warnings.append(
                            f"unexpected aspect ratio {probe['width']}x{probe['height']} "
                            f"({aspect:.2f}, expected ~{EXPECTED_ASPECT:.2f})"
                        )
            else:
                if not probe["has_audio"]:
                    check["status"] = "error"
                    check["error"] = "no audio stream found"
                    checks.append(check)
                    continue

            check["status"] = "warning" if warnings else "ok"
            if warnings:
                check["warnings"] = warnings
            checks.append(check)

    return checks


def format_report(checks: list[dict], template_type: str, config_path: Path) -> str:
    desc = TEMPLATE_TYPES.get(template_type, {}).get("description", template_type)
    lines = [f"Asset Validation — {config_path} ({desc})", ""]

    if not checks:
        lines.append("No audioFile/videoFile references found in config.")
        return "\n".join(lines)

    for c in checks:
        icon = {"ok": "✓", "warning": "!", "error": "✗"}[c["status"]]
        detail = c["reference"]
        if c["status"] == "error":
            detail += f" — {c['error']}"
        elif c["status"] == "warning":
            detail += f" — {'; '.join(c['warnings'])}"
        elif c.get("duration_seconds") is not None:
            detail += f" ({c['duration_seconds']}s)"
        lines.append(f"  {icon} {c['scene_label']:<20} {c['field']:<11} {detail}")

    error_count = sum(1 for c in checks if c["status"] == "error")
    warning_count = sum(1 for c in checks if c["status"] == "warning")
    ok_count = sum(1 for c in checks if c["status"] == "ok")

    lines.append("")
    lines.append(f"{ok_count} ok, {warning_count} warning(s), {error_count} error(s)")
    if error_count:
        lines.append("\nFix errors above before rendering.")

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(
        description="Validate project media assets with ffprobe before render",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 tools/validate_assets.py                      # Validate current project
  python3 tools/validate_assets.py --json                # Machine-readable output
  python3 tools/validate_assets.py --config src/config/sprint-config.ts --public-dir public
""",
    )
    parser.add_argument("--config", help="Path to config file (auto-detected if omitted)")
    parser.add_argument("--public-dir", help="Path to public/ dir (default: ./public)")
    parser.add_argument("--json", action="store_true", help="Output JSON for scripting")

    args = parser.parse_args()

    project_dir = Path.cwd()
    config_path = Path(args.config) if args.config else detect_config_file(project_dir)

    if not config_path or not config_path.exists():
        print(
            "Error: Could not find config file. "
            "Run from a project directory or use --config.",
            file=sys.stderr,
        )
        sys.exit(1)

    public_dir = Path(args.public_dir) if args.public_dir else project_dir / "public"
    if not public_dir.exists():
        print(f"Error: public directory not found: {public_dir}", file=sys.stderr)
        sys.exit(1)

    config_text = config_path.read_text()
    template_type = detect_template_type(config_text, config_path)
    scenes = parse_scenes_from_config(config_text, template_type)

    if not scenes:
        print("Error: No scenes found in config.", file=sys.stderr)
        sys.exit(1)

    checks = validate_scenes(scenes, public_dir)
    error_count = sum(1 for c in checks if c["status"] == "error")

    if args.json:
        output = {
            "config_file": str(config_path),
            "public_dir": str(public_dir),
            "template_type": template_type,
            "checks": checks,
            "error_count": error_count,
            "warning_count": sum(1 for c in checks if c["status"] == "warning"),
            "ok_count": sum(1 for c in checks if c["status"] == "ok"),
        }
        print(json.dumps(output, indent=2))
    else:
        print(format_report(checks, template_type, config_path))

    sys.exit(1 if error_count else 0)


if __name__ == "__main__":
    main()
