import type { ProductDemoConfig, VideoConfig } from './types';

// "Private AI Savings" — 70s ad-style spot for the private-AI-automation
// series. Script source: VOICEOVER-SCRIPT.md. Scene timing follows the
// hook / problem / solution / cta beats from the original script:
//   Title    0:00–0:10  hook
//   Problem  0:10–0:30  the metered-stack tax
//   Solution 0:30–0:55  self-hosted n8n + Ollama + Dify
//   CTA      0:55–1:10  margin capture + series follow
export const demoConfig: ProductDemoConfig = {
  product: {
    name: 'Private AI Automations',
    tagline: 'Self-hosted automation that scales for free',
  },

  scenes: [
    // Title Scene — the hook (0:00–0:10)
    {
      type: 'title',
      durationSeconds: 10,
      content: {
        headline: "Stop Paying Zapier & OpenAI For Every Lead",
        subheadline: "You're Being Taxed On Your Own Business Growth",
      },
    },

    // Problem Scene — the metered-stack tax (0:10–0:30)
    {
      type: 'problem',
      durationSeconds: 20,
      content: {
        headline: 'The Traditional Stack Charges Per Task, Per Token',
        problems: [
          { icon: '⚡', text: 'Zapier bills you per task' },
          { icon: '🤖', text: 'GPT API bills you per token' },
          { icon: '🗄️', text: 'Vector databases bill per query' },
          { icon: '📈', text: 'Your bill grows with your success' },
        ],
        codeExample: [
          '// 3,000 lead qualifications / month',
          'Zapier + GPT API + Vector DB',
          '  = $130 – $270 / month',
          '',
          '// 50,000 qualifications / month',
          '  = thousands / month',
        ],
      },
    },

    // Solution Scene — self-host the stack (0:30–0:55)
    {
      type: 'solution',
      durationSeconds: 25,
      content: {
        headline: 'Self-Host The Orchestration Layer',
        description: 'Replace the metered stack with your own infrastructure',
        highlights: [
          'n8n — workflow orchestration',
          'Ollama — local open-weight models',
          'Dify — knowledge indexing',
          'Flat $10–$20/mo VPS, any volume',
        ],
      },
    },

    // CTA Scene — pure margin (0:55–1:10)
    {
      type: 'cta',
      durationSeconds: 15,
      content: {
        headline: "That's Pure Margin You Can Capture",
        tagline: '$1,400–$3,000 saved per client, every year',
        links: [
          {
            type: 'custom',
            label: 'Follow the series',
            url: 'Private AI Automation Blueprints',
          },
        ],
      },
    },
  ],

  // Uncomment once per-scene voiceover has been generated:
  // (see VOICEOVER-SCRIPT.md, then run tools/voiceover.py --scene-dir ...
  // and tools/sync_timing.py to confirm the timings above still hold)
  // audio: {
  //   voiceoverFile: 'audio/voiceover.mp3',
  //   backgroundMusicFile: 'audio/background-music.mp3',
  //   backgroundMusicVolume: 0.12,
  // },
};

// Video settings
export const videoConfig: VideoConfig = {
  fps: 30,
  width: 1920,
  height: 1080,
};

// Calculate total duration from scenes
export function calculateTotalFrames(config: ProductDemoConfig, fps: number): number {
  return config.scenes.reduce((total, scene) => {
    return total + scene.durationSeconds * fps;
  }, 0);
}
