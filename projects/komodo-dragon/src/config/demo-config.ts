import type { ProductDemoConfig, VideoConfig } from './types';

// "The Komodo Dragon: Nature's Real-Life Dragon" — nature documentary
// Scene durations are initial estimates from the script's timestamped sections.
// After voiceover generation, run `python3 tools/sync_timing.py --apply` to
// correct drift against the actual narration length (see CLAUDE.md TTS Duration Drift).
export const demoConfig: ProductDemoConfig = {
  product: {
    name: "The Komodo Dragon: Nature's Real-Life Dragon",
    tagline: 'The Last Dragon',
    website: 'youtube.com',
  },

  scenes: [
    // --- INTRO (0:00-0:45) ---
    {
      type: 'title',
      durationSeconds: 7,
      content: {
        headline: 'THE LAST DRAGON',
        subheadline: "The World's Largest Living Lizard",
      },
    },
    {
      // B-roll: slow-motion eye blink, powerful walk, tongue flicking,
      // drone shot of the Indonesian islands.
      type: 'demo',
      durationSeconds: 38,
      content: {
        type: 'video',
        videoFile: 'demos/intro-broll.mp4',
        label: 'Komodo Island, Indonesia',
        caption:
          "On a handful of volcanic islands in Indonesia, a creature out of myth walks the earth. It's the world's largest living lizard—a predator so formidable it has inspired legends for centuries.",
      },
    },

    // --- SECTION 1: A LIVING DRAGON (0:45-2:00) ---
    {
      // B-roll: walking then speeding up, size comparison graphic,
      // split-screen of serrated teeth and claws.
      type: 'demo',
      durationSeconds: 35,
      content: {
        type: 'video',
        videoFile: 'demos/living-dragon-broll.mp4',
        label: 'Varanus komodoensis',
        caption:
          "The undisputed king of the monitor lizards. Three meters long, over 70 kilograms — some exceptional individuals tipping the scales at nearly 300 pounds. Sixty serrated, shark-like teeth. Razor claws. A tail powerful enough to knock a deer off its feet.",
      },
    },
    {
      type: 'stats',
      durationSeconds: 40,
      content: {
        headline: 'Built for the Hunt',
        stats: [
          { value: '20', unit: 'km/h', label: 'Sprint Speed', icon: '🏃' },
          { value: '3', unit: 'm', label: 'Max Length', icon: '📏' },
          { value: '57', label: 'Bacteria Strains — Or So We Thought', icon: '🦠' },
        ],
      },
    },

    // --- SECTION 2: THE TRUTH ABOUT THE BITE (2:00-3:30) ---
    {
      type: 'solution',
      durationSeconds: 90,
      content: {
        headline: 'The Venom Discovery',
        description:
          "In 2009, venom specialist Dr. Bryan Fry scanned a Komodo dragon's head and found a pair of sophisticated venom glands in its lower jaw — toxins as potent as some of the deadliest snakes on Earth.",
        highlights: [
          'Grip, rip, and drip — weak bite force, massive tearing wounds',
          'Venom lowers blood pressure and prevents clotting, sending prey into shock',
          "The mouth isn't dirty — it's venomous. That changes everything.",
        ],
      },
    },

    // --- SECTION 3: THE APEX PREDATOR'S MENU (3:30-5:00) ---
    {
      // B-roll: stalking through tall grass, Timor deer / wild boar / water
      // buffalo, a carcass feeding (handle with caution — graphic content).
      type: 'demo',
      durationSeconds: 40,
      content: {
        type: 'video',
        videoFile: 'demos/apex-broll.mp4',
        label: 'The Hunt',
        caption:
          'As the apex predator of its ecosystem, the Komodo dragon fears nothing — preying on Timor deer, wild boar, and water buffalo weighing over a thousand pounds. Young dragons spend their first years in the trees, hiding from cannibalistic adults below.',
      },
    },
    {
      type: 'feature',
      durationSeconds: 50,
      content: {
        headline: 'Survival of the Fittest',
        features: [
          {
            icon: '👑',
            title: 'Brutal Hierarchy',
            description: 'Largest males eat first, then smaller males, then females, then juveniles',
          },
          {
            icon: '🍖',
            title: '80% Body Weight',
            description: 'A single dragon can eat up to 80% of its own body weight in one feeding',
          },
          {
            icon: '👃',
            title: 'Super-Smell',
            description: 'A forked tongue can detect a carcass nearly 10 kilometers away',
          },
        ],
      },
    },

    // --- SECTION 4: WHEN DRAGONS ATTACK (5:00-6:00) ---
    {
      type: 'problem',
      durationSeconds: 60,
      content: {
        headline: 'When Dragons Attack',
        problems: [
          { icon: '2007', text: 'An 8-year-old boy killed on Komodo Island while mending fishing nets' },
          { icon: '2001', text: "Phil Bronstein bitten at the LA Zoo — surgery to reattach tendons" },
        ],
      },
    },

    // --- SECTION 5: A SPECIES IN PERIL (6:00-7:00) ---
    {
      type: 'stats',
      durationSeconds: 60,
      content: {
        headline: 'A Species in Peril',
        stats: [
          { value: '1,400', label: 'Adults Left in the Wild', icon: '⚠️', color: '#E8590C' },
          { value: '3,500', label: 'Total Population', icon: '📉', color: '#E8590C' },
          { value: '15', unit: '%', label: 'Habitat Protected on Flores', icon: '🛡️' },
        ],
      },
    },

    // --- OUTRO (7:00-7:30) ---
    {
      type: 'cta',
      durationSeconds: 30,
      content: {
        headline: 'This Is Not Just a Lizard. This Is a Legend.',
        tagline: 'And legends are worth saving.',
        links: [
          { type: 'custom', label: 'Like & Subscribe', url: 'more deep dives into the animal kingdom' },
          { type: 'custom', label: 'Comment below', url: 'what animal should we cover next?' },
        ],
      },
    },
  ],

  audio: {
    voiceoverFile: 'audio/voiceover.mp3',
    voiceoverStartFrame: 0,
    backgroundMusicFile: 'audio/background-music.mp3',
    backgroundMusicVolume: 0.15,
  },

  narrator: {
    enabled: false,
    videoFile: 'narrator.mp4',
    position: 'bottom-right',
    size: 'md',
    startFrame: 120,
  },
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
