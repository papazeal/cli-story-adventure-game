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

  // Get melody for each scene - endings have 3 notes, others have 1 note
  getSceneMelody(sceneId: string): number[] {
    // List of ending scene IDs
    const endingScenes = [
      'hero', 'otherworld', 'friendship', 'treasure', 'rescue',
      'music_maker', 'dance_teacher', 'laughter_bringer', 
      'helper_finder', 'cloud_watcher', 'magic_gardener', 'star_guide'
    ];

    // Check if this is an ending scene
    if (endingScenes.includes(sceneId)) {
      // Ending scenes get 3-note melodies
      const endingMelodies: Record<string, number[]> = {
        hero: [523.25, 659.25, 783.99], // C5 -> E5 -> G5 (triumphant)
        otherworld: [659.25, 783.99, 1046.50], // E5 -> G5 -> C6 (ethereal)
        friendship: [440.00, 523.25, 659.25], // A4 -> C5 -> E5 (warm)
        treasure: [523.25, 659.25, 783.99], // C5 -> E5 -> G5 (shiny)
        rescue: [392.00, 493.88, 587.33], // G4 -> B4 -> D5 (safe)
        music_maker: [523.25, 659.25, 783.99], // C5 -> E5 -> G5 (musical)
        dance_teacher: [587.33, 659.25, 783.99], // D5 -> E5 -> G5 (joyful)
        laughter_bringer: [659.25, 783.99, 880.00], // E5 -> G5 -> A5 (happy)
        helper_finder: [440.00, 523.25, 659.25], // A4 -> C5 -> E5 (helpful)
        cloud_watcher: [493.88, 659.25, 783.99], // B4 -> E5 -> G5 (sky)
        magic_gardener: [392.00, 523.25, 659.25], // G4 -> C5 -> E5 (growing)
        star_guide: [659.25, 783.99, 987.77] // E5 -> G5 -> B5 (stellar)
      };
      return endingMelodies[sceneId] || [523.25, 659.25, 783.99];
    } else {
      // All other scenes get 1 note (same pitch for consistency)
      return [523.25]; // C5
    }
  }

  // Play scene-specific melody (1 note for regular scenes, 3 notes for endings)
  async playSceneTone(sceneId: string) {
    const melody = this.getSceneMelody(sceneId);
    await this.playToneSequence(melody, 300, 0.5); // 300ms per note
  }
}

// Create singleton instance
export const audioManager = new AudioManager();
