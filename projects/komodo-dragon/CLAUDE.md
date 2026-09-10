# Project: komodo-dragon

**Template:** product-demo | **Brand:** komodo | **Phase:** assets
**Last Updated:** just created

## Current Status

"The Komodo Dragon: Nature's Real-Life Dragon" — a 6-8 minute nature documentary
video. Scenes, brand, and full narration script are defined. Three b-roll scenes
need real footage before moving to review.

## Scenes

| # | Scene | Type | Visual | Status |
|---|-------|------|--------|--------|
| 1 | Title ("THE LAST DRAGON") | title | slide | ✅ Ready |
| 2 | Intro b-roll | demo | demos/intro-broll.mp4 | ⬜ Needs footage |
| 3 | A Living Dragon — b-roll | demo | demos/living-dragon-broll.mp4 | ⬜ Needs footage |
| 4 | A Living Dragon — stats | stats | slide | ✅ Ready |
| 5 | The Venom Discovery | solution | slide | ✅ Ready |
| 6 | Apex Predator — b-roll | demo | demos/apex-broll.mp4 | ⬜ Needs footage |
| 7 | Apex Predator — hierarchy | feature | slide | ✅ Ready |
| 8 | When Dragons Attack | problem | slide | ✅ Ready |
| 9 | A Species in Peril | stats | slide | ✅ Ready |
| 10 | Outro / CTA | cta | slide | ✅ Ready |

## Audio

- Voiceover: ⬜ Not yet generated (script ready, ~950 words / ~6:20 at standard pace)
- Music: ⬜ Not yet generated — see mood table in `VOICEOVER-SCRIPT.md`

## Next Actions

1. **Source b-roll for the 3 `demo` scenes** (intro, living-dragon, apex)
   Use a licensed nature-footage library, or generate clearly-stylized
   b-roll with LTX-2 (`.claude/skills/ltx2/`). Do not present AI-generated
   shots as authentic wildlife documentation — label/caption accordingly if used.
   Drop files at `public/demos/intro-broll.mp4`, `living-dragon-broll.mp4`,
   `apex-broll.mp4`.

2. **Run `/scene-review`** once b-roll is in place, to verify the slide
   scenes (stats/solution/feature/problem/cta) in Remotion Studio before
   generating voiceover.

3. **Generate voiceover** with `/generate-voiceover` (uses `brands/komodo/voice.json`
   and `VOICEOVER-SCRIPT.md`), then run:
   ```bash
   python3 tools/sync_timing.py --project komodo-dragon --apply
   ```
   to correct scene durations against actual narration length.

4. **Generate background music** per-section with `tools/music_gen.py`
   using the mood table in `VOICEOVER-SCRIPT.md` (intro: tension/ominous,
   body: dramatic, conservation: ambient/melancholic, outro: hopeful/fade).

## Quick Commands

```bash
cd projects/komodo-dragon
npm install
npm run studio    # Preview in browser
npm run render    # Final render
```

## Session History

- 2026-09-10: Project created from provided script: scaffolded product-demo
  template with a new "komodo" brand, 10-scene breakdown, full
  `VOICEOVER-SCRIPT.md`. B-roll scenes flagged asset-needed.

---
*Auto-generated from project.json. Do not edit manually — see `.claude/commands/video.md`.*
