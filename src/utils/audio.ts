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

  // Play a sequence of tones with voice-like timing
  async playToneSequence(
    frequencies: number[],
    noteDuration: number = 400,
    volume: number = 1
  ) {
    for (let i = 0; i < frequencies.length; i++) {
      // Voice-like timing: slight overlap between notes for smoother flow
      const delay = (i * (noteDuration * 0.7)) / 1000; // 30% overlap for smooth voice effect
      await this.playTone(frequencies[i], noteDuration, volume, delay);
    }
  }

  // Get voice-like melody that mimics the emotional tone and rhythm of story text
  getSceneMelody(sceneId: string): number[] {
    const voiceMelodies: Record<string, number[]> = {
      // Menu scenes - welcoming, inviting voice
      welcome: [523.25, 659.25], // "Welcome!" - bright, inviting
      help: [440.0, 523.25, 493.88], // "How to play" - explanatory, patient
      changelog: [587.33, 659.25, 783.99, 659.25], // "What's new!" - exciting updates

      // Adventure scenes - curious, wondering voice
      intro: [392.0, 440.0, 523.25, 493.88], // "You wake up..." - mysterious awakening
      river: [369.99, 440.0, 369.99, 329.63], // "babbling stream" - flowing water sound
      tree: [392.0, 523.25, 659.25, 783.99], // "climb up high" - ascending excitement
      backpack: [440.0, 523.25, 440.0, 493.88], // "look and find" - searching, discovery

      // Social scenes - warm, friendly voice
      village: [523.25, 587.33, 659.25, 523.25], // "cheerful village" - warm community
      helper: [440.0, 523.25, 587.33, 659.25], // "kind grandma" - gentle, caring
      friends: [659.25, 783.99, 880.0, 783.99], // "best day ever!" - pure joy

      // Nature/Magic scenes - mystical, wonder-filled voice
      creature: [277.18, 369.99, 440.0], // "big fluffy wolf" - gentle, mysterious
      cave: [246.94, 329.63, 369.99, 329.63], // "glowing pictures" - echoing wonder
      portal: [659.25, 783.99, 987.77, 1174.66], // "rainbow door!" - magical ascent
      rest: [392.0, 329.63, 277.18], // "peaceful rest" - calming descent

      // Intermediate scenes - transitional voices
      dance_party: [587.33, 659.25, 783.99, 659.25, 587.33], // "join the celebration!" - rhythmic joy
      star_watching: [493.88, 659.25, 783.99, 659.25], // "beautiful stars" - wonder and awe
      garden_discovery: [392.0, 493.88, 523.25, 659.25], // "magical flowers grow" - blooming discovery

      // Ending scenes - triumphant, satisfying voice conclusions
      hero: [523.25, 659.25, 783.99, 880.0], // "Forest Helper!" - proud achievement
      otherworld: [659.25, 783.99, 1046.5, 1174.66], // "magical land!" - ethereal wonder
      friendship: [440.0, 523.25, 659.25, 783.99], // "best friend!" - warm, loving
      treasure_solved: [523.25, 659.25, 783.99, 1046.5], // "shiny crystals!" - sparkling discovery
      rescue: [392.0, 493.88, 587.33, 523.25], // "safely home" - relieved, content
      music_maker: [523.25, 659.25, 783.99, 659.25, 523.25], // "forest concerts!" - musical celebration
      dance_teacher: [587.33, 659.25, 783.99, 880.0, 783.99], // "joyful dancing!" - rhythmic happiness
      laughter_bringer: [659.25, 783.99, 880.0, 987.77], // "make them smile!" - bubbling laughter
      helper_finder: [440.0, 523.25, 659.25, 523.25], // "help others!" - caring, reliable
      cloud_watcher: [493.88, 659.25, 783.99, 880.0], // "read the sky!" - elevated wisdom
      magic_gardener: [392.0, 523.25, 659.25, 783.99], // "beautiful garden!" - growing beauty
      star_guide: [659.25, 783.99, 987.77, 1174.66], // "guide by stars!" - celestial wisdom
    };

    return voiceMelodies[sceneId] || [440.0, 523.25]; // Default gentle voice
  }

  // Play choice-based melody that mimics the choice text emotion and action
  async playChoiceTone(choiceText: string) {
    const melody = this.getChoiceMelody(choiceText);

    // Adjust timing based on choice emotion
    let noteDuration = 200; // Quick, responsive feedback
    let volume = 0.5;

    // Choice-specific timing based on emotional content
    if (choiceText.includes("🏠") || choiceText.includes("Main Menu")) {
      noteDuration = 300; // Slower, more final
    } else if (choiceText.includes("🚀") || choiceText.includes("Start")) {
      noteDuration = 150; // Quick, exciting start
    } else if (choiceText.includes("❓") || choiceText.includes("help")) {
      noteDuration = 250; // Curious, questioning
    }

    await this.playToneSequence(melody, noteDuration, volume);
  }

  // Get melody based on choice text content and emotion
  getChoiceMelody(choiceText: string): number[] {
    // Analyze choice text for emotional and action keywords
    const text = choiceText.toLowerCase();

    // Movement/Direction choices
    if (
      text.includes("go") ||
      text.includes("follow") ||
      text.includes("climb")
    ) {
      return [392.0, 523.25]; // G4 -> C5 (forward movement)
    }
    if (
      text.includes("back") ||
      text.includes("return") ||
      text.includes("go back")
    ) {
      return [523.25, 392.0]; // C5 -> G4 (returning)
    }
    if (
      text.includes("up") ||
      text.includes("climb") ||
      text.includes("high")
    ) {
      return [392.0, 523.25, 659.25]; // G4 -> C5 -> E5 (ascending)
    }
    if (
      text.includes("down") ||
      text.includes("deeper") ||
      text.includes("cave")
    ) {
      return [523.25, 392.0, 329.63]; // C5 -> G4 -> E4 (descending)
    }

    // Action choices
    if (
      text.includes("look") ||
      text.includes("study") ||
      text.includes("check")
    ) {
      return [440.0, 493.88]; // A4 -> B4 (curious looking)
    }
    if (
      text.includes("use") ||
      text.includes("eat") ||
      text.includes("drink")
    ) {
      return [523.25, 587.33]; // C5 -> D5 (using/consuming)
    }
    if (
      text.includes("play") ||
      text.includes("dance") ||
      text.includes("join")
    ) {
      return [587.33, 659.25, 783.99]; // D5 -> E5 -> G5 (playful, joyful)
    }
    if (
      text.includes("help") ||
      text.includes("teach") ||
      text.includes("share")
    ) {
      return [440.0, 523.25, 659.25]; // A4 -> C5 -> E5 (caring, helpful)
    }

    // Emotional choices
    if (
      text.includes("start") ||
      text.includes("begin") ||
      text.includes("🚀")
    ) {
      return [523.25, 659.25, 783.99]; // C5 -> E5 -> G5 (exciting start)
    }
    if (
      text.includes("yes") ||
      text.includes("want") ||
      text.includes("love")
    ) {
      return [523.25, 659.25]; // C5 -> E5 (positive affirmation)
    }
    if (
      text.includes("wait") ||
      text.includes("stay") ||
      text.includes("rest")
    ) {
      return [523.25, 440.0]; // C5 -> A4 (patient waiting)
    }
    if (
      text.includes("run") ||
      text.includes("escape") ||
      text.includes("away")
    ) {
      return [659.25, 523.25, 392.0]; // E5 -> C5 -> G4 (quick escape)
    }

    // Social choices
    if (
      text.includes("friend") ||
      text.includes("hello") ||
      text.includes("say hi")
    ) {
      return [523.25, 659.25, 523.25]; // C5 -> E5 -> C5 (friendly greeting)
    }
    if (
      text.includes("thank") ||
      text.includes("nice") ||
      text.includes("kind")
    ) {
      return [440.0, 523.25, 587.33]; // A4 -> C5 -> D5 (grateful)
    }

    // Magic/Wonder choices
    if (
      text.includes("magic") ||
      text.includes("sparkle") ||
      text.includes("✨")
    ) {
      return [659.25, 783.99, 987.77]; // E5 -> G5 -> B5 (magical sparkle)
    }
    if (
      text.includes("star") ||
      text.includes("sky") ||
      text.includes("cloud")
    ) {
      return [493.88, 659.25, 783.99]; // B4 -> E5 -> G5 (celestial)
    }
    if (
      text.includes("flower") ||
      text.includes("garden") ||
      text.includes("grow")
    ) {
      return [392.0, 523.25, 659.25]; // G4 -> C5 -> E5 (growing, blooming)
    }

    // Menu/Navigation choices
    if (text.includes("main menu") || text.includes("🏠")) {
      return [523.25, 659.25, 523.25, 392.0]; // C5 -> E5 -> C5 -> G4 (returning home)
    }
    if (text.includes("play again") || text.includes("🔄")) {
      return [392.0, 523.25, 659.25, 523.25]; // G4 -> C5 -> E5 -> C5 (restart cycle)
    }
    if (text.includes("what's new") || text.includes("📝")) {
      return [587.33, 659.25, 783.99]; // D5 -> E5 -> G5 (excited about updates)
    }

    // Puzzle-specific choices
    if (text.includes("answer:") || text.includes("🔢")) {
      return [440.0, 523.25, 587.33]; // A4 -> C5 -> D5 (calculating)
    }
    if (text.includes("try again") || text.includes("🔄")) {
      return [392.0, 440.0, 523.25]; // G4 -> A4 -> C5 (encouraging retry)
    }
    if (text.includes("think more") || text.includes("🤔")) {
      return [493.88, 440.0, 493.88]; // B4 -> A4 -> B4 (pondering)
    }
    if (text.includes("touch") && text.includes("red")) {
      return [659.25, 783.99]; // E5 -> G5 (bright, red-like)
    }
    if (text.includes("touch") && text.includes("orange")) {
      return [622.25, 698.46]; // E♭5 -> F5 (warm, orange-like)
    }
    if (text.includes("touch") && text.includes("yellow")) {
      return [587.33, 659.25]; // D5 -> E5 (sunny, yellow-like)
    }
    if (text.includes("touch") && text.includes("green")) {
      return [392.0, 493.88]; // G4 -> B4 (natural, green-like)
    }
    if (text.includes("touch") && text.includes("blue")) {
      return [440.0, 523.25]; // A4 -> C5 (cool, blue-like)
    }
    if (text.includes("touch") && text.includes("indigo")) {
      return [369.99, 440.0]; // F#4 -> A4 (deep, indigo-like)
    }
    if (text.includes("touch") && text.includes("violet")) {
      return [329.63, 392.0]; // E4 -> G4 (royal, violet-like)
    }

    // Special quiz feedback sounds
    if (text.includes("🎊")) {
      // Super cheerful reward completion - ascending triumphant melody
      return [523.25, 659.25, 783.99, 987.77, 1174.66]; // C5 -> E5 -> G5 -> B5 -> D6 (victory fanfare)
    }
    if (text.includes("🎉")) {
      // Regular correct answer - happy but shorter
      return [523.25, 659.25, 783.99]; // C5 -> E5 -> G5 (correct cheer)
    }
    if (text.includes("❌")) {
      // Gentle sad tone for wrong answers - descending but encouraging
      return [392.0, 329.63, 369.99]; // G4 -> E4 -> F#4 (gentle disappointment, ends on hopeful note)
    }
    if (text.includes("💡")) {
      // Curious/interesting tone for fun facts - playful and intriguing
      return [440.0, 523.25, 587.33, 659.25]; // A4 -> C5 -> D5 -> E5 (ascending curiosity)
    }

    // Default based on emoji emotions
    if (text.includes("😊") || text.includes("😄") || text.includes("🎉")) {
      return [523.25, 659.25, 783.99]; // C5 -> E5 -> G5 (happy)
    }
    if (text.includes("🤔") || text.includes("❓")) {
      return [440.0, 493.88, 440.0]; // A4 -> B4 -> A4 (questioning)
    }

    // Default neutral choice
    return [523.25, 587.33]; // C5 -> D5 (neutral positive)
  }

  // Keep the old method for backward compatibility (now unused)
  async playSceneTone(sceneId: string) {
    // This method is now deprecated in favor of choice-based audio
    return;
  }
}

// Create singleton instance
export const audioManager = new AudioManager();
