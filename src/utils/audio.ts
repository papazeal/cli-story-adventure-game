// Audio utility for playing scene-specific tones
export class AudioManager {
  private audioContext: AudioContext | null = null;

  constructor() {
    // Initialize audio context on first user interaction
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn("Web Audio API not supported:", error);
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) {
      this.initAudioContext();
    }

    // Resume audio context if suspended (required by some browsers)
    if (this.audioContext && this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }
  }

  // Play a tone with specific frequency and duration
  async playTone(
    frequency: number,
    duration: number = 500,
    volume: number = 1,
    delay: number = 0
  ) {
    try {
      await this.ensureAudioContext();

      if (!this.audioContext) return;

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      // Connect oscillator to gain to output
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Configure oscillator
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(
        frequency,
        this.audioContext.currentTime + delay
      );

      // Configure gain (volume) with fade out
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(
        volume,
        this.audioContext.currentTime + delay + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + delay + duration / 1000
      );

      // Start and stop the oscillator
      oscillator.start(this.audioContext.currentTime + delay);
      oscillator.stop(this.audioContext.currentTime + delay + duration / 1000);
    } catch (error) {
      console.warn("Failed to play audio:", error);
    }
  }

  // Play a sequence of tones
  async playToneSequence(
    frequencies: number[],
    noteDuration: number = 400,
    volume: number = 1
  ) {
    for (let i = 0; i < frequencies.length; i++) {
      await this.playTone(
        frequencies[i],
        noteDuration,
        volume,
        i * (noteDuration / 1000)
      );
    }
  }

  // Get 2-note melody for each scene
  getSceneMelody(sceneId: string): number[] {
    const sceneMelodies: Record<string, number[]> = {
      // Menu scenes - welcoming intervals
      welcome: [523.25, 659.25], // C5 -> E5 (major third up, welcoming)
      help: [440.0, 523.25], // A4 -> C5 (rising, helpful)

      // Adventure scenes - curious/exploratory
      intro: [329.63, 369.99], // E4 -> F#4 (mysterious step up)
      river: [369.99, 329.63], // F#4 -> E4 (flowing down like water)
      tree: [392.0, 493.88], // G4 -> B4 (climbing up)
      backpack: [392.0, 349.23], // G4 -> F4 (searching down)

      // Social scenes - warm/happy
      village: [587.33, 659.25], // D5 -> E5 (warm step up)
      helper: [523.25, 587.33], // C5 -> D5 (kind, gentle rise)
      friends: [659.25, 783.99], // E5 -> G5 (joyful jump up)

      // Nature scenes - magical/wonder
      creature: [277.18, 369.99], // C#4 -> F#4 (gentle, animal call)
      cave: [246.94, 220.0], // B3 -> A3 (echoing down into depths)
      portal: [659.25, 987.77], // E5 -> B5 (magical leap up)
      rest: [261.63, 246.94], // C4 -> B3 (peaceful descent)

      // Ending scenes - satisfying resolutions
      hero: [659.25, 880.0], // E5 -> A5 (triumphant rise)
      otherworld: [783.99, 1046.5], // G5 -> C6 (ethereal ascent)
      friendship: [523.25, 659.25], // C5 -> E5 (warm, loving)
      treasure: [659.25, 739.99], // E5 -> F#5 (shiny, valuable)
      rescue: [440.0, 523.25], // A4 -> C5 (safe resolution)
    };

    return sceneMelodies[sceneId] || [440.0, 523.25]; // Default to A4 -> C5
  }

  // Play scene-specific 2-note melody
  async playSceneTone(sceneId: string) {
    const melody = this.getSceneMelody(sceneId);
    await this.playToneSequence(melody, 200, 0.5); // 500ms per note, 2 notes in 1 second
  }
}

// Create singleton instance
export const audioManager = new AudioManager();
