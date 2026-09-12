# Project: private-ai-savings

**Template:** product-demo | **Brand:** default | **Phase:** planning
**Last Updated:** 2026-09-12

70-second ad-style spot for the "deploy and sell private AI automations" series: Zapier/OpenAI's per-task, per-token tax vs. self-hosting n8n + Ollama + Dify on a flat-rate VPS.

## Scenes

| # | Scene | Type | Duration | Status |
|---|-------|------|----------|--------|
| 1 | Title (hook) | title | 0:00–0:10 | ✅ Ready |
| 2 | Problem (metered stack) | problem | 0:10–0:30 | ✅ Ready |
| 3 | Solution (self-hosted) | solution | 0:30–0:55 | ✅ Ready |
| 4 | CTA (margin) | cta | 0:55–1:10 | ✅ Ready |

All scenes are template-generated slides — no recorded demo assets needed.

## Audio

- Voiceover: ⬜ Not yet generated (see `VOICEOVER-SCRIPT.md`)
- Music: Optional

## Next Actions

1. Generate per-scene voiceover:
   ```bash
   cd /path/to/claude-code-video-toolkit
   python3 tools/voiceover.py --scene-dir projects/private-ai-savings/public/audio/scenes --json
   ```
2. Run `tools/sync_timing.py` against the generated audio and adjust `durationSeconds` in `src/config/demo-config.ts` if scenes 2/3 (the densest narration) drift.
3. Uncomment the `audio` block in `src/config/demo-config.ts` once `public/audio/voiceover.mp3` exists.
4. Preview with `npm run studio`, then `npm run render`.

## Commands

```bash
npm install       # First time only
npm run studio    # Preview
npm run render    # Final render
```

---
*See `VOICEOVER-SCRIPT.md` for the full narration script and `project.json` for machine-readable state.*
