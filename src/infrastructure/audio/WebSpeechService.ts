/**
 * Service for managing text-to-speech using Web Speech API
 */

export type SpeechSpeed = 0.8 | 1 | 1.2;

export interface SpeechOptions {
  speed?: SpeechSpeed;
  lang?: string;
  voice?: SpeechSynthesisVoice;
}

export type SpeechStatus = 'idle' | 'speaking' | 'paused';

/**
 * Web Speech Service for text-to-speech functionality
 * Uses the browser's native SpeechSynthesis API
 */
export class WebSpeechService {
  private utterance: SpeechSynthesisUtterance | null = null;
  private status: SpeechStatus = 'idle';
  private currentSpeed: SpeechSpeed = 1;

  /**
   * Check if speech synthesis is supported
   */
  static isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      'SpeechSynthesisUtterance' in window
    );
  }

  /**
   * Get available voices for the specified language
   */
  getVoices(lang: string = 'es-ES'): SpeechSynthesisVoice[] {
    if (!WebSpeechService.isSupported()) return [];

    const voices = speechSynthesis.getVoices();
    return voices.filter((voice) => voice.lang.startsWith(lang.split('-')[0]));
  }

  /**
   * Get the best voice for the specified language
   */
  private getBestVoice(lang: string = 'es-ES'): SpeechSynthesisVoice | null {
    const voices = this.getVoices(lang);
    if (voices.length === 0) return null;

    // Prefer Google voices if available
    const googleVoice = voices.find((v) => v.name.includes('Google'));
    if (googleVoice) return googleVoice;

    // Otherwise return the first available voice
    return voices[0];
  }

  /**
   * Speak the given text
   */
  speak(text: string, options: SpeechOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!WebSpeechService.isSupported()) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      this.cancel();

      // Create new utterance
      this.utterance = new SpeechSynthesisUtterance(text);
      this.utterance.lang = options.lang || 'es-ES';
      this.utterance.rate = options.speed || this.currentSpeed;
      this.utterance.voice =
        options.voice || this.getBestVoice(this.utterance.lang);

      // Set up event handlers
      this.utterance.onstart = () => {
        this.status = 'speaking';
      };

      this.utterance.onend = () => {
        this.status = 'idle';
        this.utterance = null;
        resolve();
      };

      this.utterance.onerror = (event) => {
        this.status = 'idle';
        this.utterance = null;
        reject(new Error(`Speech error: ${event.error}`));
      };

      // Start speaking
      speechSynthesis.speak(this.utterance);
    });
  }

  /**
   * Pause current speech
   */
  pause(): void {
    if (!WebSpeechService.isSupported()) return;
    if (this.status === 'speaking') {
      speechSynthesis.pause();
      this.status = 'paused';
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (!WebSpeechService.isSupported()) return;
    if (this.status === 'paused') {
      speechSynthesis.resume();
      this.status = 'speaking';
    }
  }

  /**
   * Cancel current speech
   */
  cancel(): void {
    if (!WebSpeechService.isSupported()) return;
    speechSynthesis.cancel();
    this.status = 'idle';
    this.utterance = null;
  }

  /**
   * Set speech speed
   */
  setSpeed(speed: SpeechSpeed): void {
    this.currentSpeed = speed;
    // If currently speaking, restart with new speed
    if (this.utterance && this.status === 'speaking') {
      const text = this.utterance.text;
      const lang = this.utterance.lang;
      this.cancel();
      this.speak(text, { speed, lang });
    }
  }

  /**
   * Get current status
   */
  getStatus(): SpeechStatus {
    return this.status;
  }

  /**
   * Get current speed
   */
  getSpeed(): SpeechSpeed {
    return this.currentSpeed;
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.status === 'speaking';
  }

  /**
   * Check if currently paused
   */
  isPaused(): boolean {
    return this.status === 'paused';
  }
}
