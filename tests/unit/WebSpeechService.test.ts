import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WebSpeechService } from '@/infrastructure/audio/WebSpeechService';

describe('WebSpeechService', () => {
  let service: WebSpeechService;

  beforeEach(() => {
    service = new WebSpeechService();
    vi.clearAllMocks();
  });

  describe('isSupported', () => {
    it('should return true in test environment (mocked)', () => {
      expect(WebSpeechService.isSupported()).toBe(true);
    });
  });

  describe('speak', () => {
    it('should create utterance and speak', async () => {
      const text = 'Test speech';

      // Mock the onend callback to resolve immediately
      const originalSpeak = global.speechSynthesis.speak;
      vi.spyOn(global.speechSynthesis, 'speak').mockImplementation(
        (utterance) => {
          // Simulate immediate completion
          setTimeout(() => {
            if (utterance.onend) {
              utterance.onend(new SpeechSynthesisEvent('end', { utterance }));
            }
          }, 0);
        }
      );

      await service.speak(text);

      expect(global.speechSynthesis.speak).toHaveBeenCalled();

      // Restore original
      global.speechSynthesis.speak = originalSpeak;
    });

    it('should use custom speed', async () => {
      const text = 'Test speech';
      const speed = 1.2 as const;

      const originalSpeak = global.speechSynthesis.speak;
      let capturedUtterance: SpeechSynthesisUtterance | undefined;

      vi.spyOn(global.speechSynthesis, 'speak').mockImplementation(
        (utterance) => {
          capturedUtterance = utterance;
          setTimeout(() => {
            if (utterance.onend) {
              utterance.onend(new SpeechSynthesisEvent('end', { utterance }));
            }
          }, 0);
        }
      );

      await service.speak(text, { speed });

      expect(capturedUtterance).not.toBeNull();
      expect(capturedUtterance?.rate).toBe(speed);

      global.speechSynthesis.speak = originalSpeak;
    });

    it('should use custom language', async () => {
      const text = 'Test speech';
      const lang = 'en-US';

      const originalSpeak = global.speechSynthesis.speak;
      let capturedUtterance: SpeechSynthesisUtterance | undefined;

      vi.spyOn(global.speechSynthesis, 'speak').mockImplementation(
        (utterance) => {
          capturedUtterance = utterance;
          setTimeout(() => {
            if (utterance.onend) {
              utterance.onend(new SpeechSynthesisEvent('end', { utterance }));
            }
          }, 0);
        }
      );

      await service.speak(text, { lang });

      expect(capturedUtterance).not.toBeNull();
      expect(capturedUtterance?.lang).toBe(lang);

      global.speechSynthesis.speak = originalSpeak;
    });

    it('should handle errors', async () => {
      const text = 'Test speech';

      const originalSpeak = global.speechSynthesis.speak;
      vi.spyOn(global.speechSynthesis, 'speak').mockImplementation(
        (utterance) => {
          setTimeout(() => {
            if (utterance.onerror) {
              utterance.onerror(
                new SpeechSynthesisErrorEvent('error', {
                  utterance: utterance,
                  error: 'network',
                })
              );
            }
          }, 0);
        }
      );

      await expect(service.speak(text)).rejects.toThrow('Speech error');

      global.speechSynthesis.speak = originalSpeak;
    });
  });

  describe('status management', () => {
    it('should start with idle status', () => {
      expect(service.getStatus()).toBe('idle');
      expect(service.isSpeaking()).toBe(false);
      expect(service.isPaused()).toBe(false);
    });

    it('should return to idle after speaking completes', async () => {
      const originalSpeak = global.speechSynthesis.speak;
      vi.spyOn(global.speechSynthesis, 'speak').mockImplementation(
        (utterance) => {
          // Immediately end it
          setTimeout(() => {
            if (utterance.onend) {
              utterance.onend(new SpeechSynthesisEvent('end', { utterance }));
            }
          }, 0);
        }
      );

      expect(service.getStatus()).toBe('idle');

      await service.speak('test');

      expect(service.getStatus()).toBe('idle');

      global.speechSynthesis.speak = originalSpeak;
    });
  });

  describe('cancel', () => {
    it('should cancel ongoing speech', () => {
      service.cancel();
      expect(global.speechSynthesis.cancel).toHaveBeenCalled();
      expect(service.getStatus()).toBe('idle');
    });
  });

  describe('pause and resume', () => {
    it('should pause speech', () => {
      // Manually set speaking status
      service['status'] = 'speaking';
      service.pause();
      expect(global.speechSynthesis.pause).toHaveBeenCalled();
      expect(service.getStatus()).toBe('paused');
    });

    it('should resume paused speech', () => {
      // Manually set paused status
      service['status'] = 'paused';
      service.resume();
      expect(global.speechSynthesis.resume).toHaveBeenCalled();
      expect(service.getStatus()).toBe('speaking');
    });
  });

  describe('setSpeed', () => {
    it('should update current speed', () => {
      const newSpeed = 1.2;
      service.setSpeed(newSpeed);
      expect(service.getSpeed()).toBe(newSpeed);
    });
  });

  describe('getVoices', () => {
    it('should return empty array in test environment', () => {
      const voices = service.getVoices();
      expect(Array.isArray(voices)).toBe(true);
      expect(voices.length).toBe(0);
    });
  });
});
