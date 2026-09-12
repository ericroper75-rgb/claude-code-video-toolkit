# Private AI Savings — voiceover script

A 70-second ad-style spot for the "deploy and sell private AI automations" series. Generate per-scene mp3s into `public/audio/scenes/` with:

```bash
python3 ../../tools/voiceover.py --scene-dir public/audio/scenes --json
```

Word budgets assume ~150 WPM (2.5 words/sec) standard pace — see CLAUDE.md → Video Timing.

## Scene 1 — Title / hook (0:00–0:10, 10s)
**File:** `01_title.mp3`
**Tone:** Direct, conspiratorial

> Stop paying Zapier and OpenAI for every single lead, workflow, and customer reply. You are literally being taxed for your own business growth.

## Scene 2 — Problem (0:10–0:30, 20s)
**File:** `02_problem.mp3`
**Tone:** Building frustration, matter-of-fact

> The traditional automation stack charges you per task and per token. Run three thousand lead qualifications a month, and between Zapier, GPT API calls, and vector databases, you're burning $130 to $270 every month. Run 50,000? Your bill skyrockets into the thousands.

## Scene 3 — Solution (0:30–0:55, 25s)
**File:** `03_solution.mp3`
**Tone:** Confident, relief

> When you self-host the orchestration layer with n8n, run local open-weight models via Ollama, and index your knowledge with Dify, your platform cost drops to a flat $10 to $20 a month VPS. 500 tasks or 50,000 tasks — the compute cost is identical.

## Scene 4 — CTA (0:55–1:10, 15s)
**File:** `04_cta.mp3`
**Tone:** Warm, inviting, energetic close

> That $1,400 to $3,000 yearly savings per client is pure margin you can capture. Follow this series — I'm walking through the exact blueprints to deploy and sell private AI automations.

## Timing notes

After generating audio, run:

```bash
python3 ../../tools/sync_timing.py --voiceover-json public/audio/scenes/voiceover.json
```

to confirm each scene's actual TTS duration still fits its `durationSeconds` in `src/config/demo-config.ts`. Scene 2 (problem) and scene 3 (solution) carry the densest word counts (~43 and ~34 words) and are the most likely to drift — trim or pad `durationSeconds` there first if timing is off.
