'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  WebSpeechService,
  SpeechSpeed,
  SpeechStatus,
} from '@/infrastructure/audio/WebSpeechService';

interface UseSpeechOptions {
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

interface UseSpeechReturn {
  speak: (text: string) => Promise<void>;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
  setSpeed: (speed: SpeechSpeed) => void;
  status: SpeechStatus;
  speed: SpeechSpeed;
  isSupported: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
}

/**
 * React hook for text-to-speech functionality
 * Wraps WebSpeechService with React state management
 */
export function useSpeech(options: UseSpeechOptions = {}): UseSpeechReturn {
  const serviceRef = useRef<WebSpeechService | null>(null);
  const [status, setStatus] = useState<SpeechStatus>('idle');
  const [speed, setSpeedState] = useState<SpeechSpeed>(1);
  const [isSupported, setIsSupported] = useState(false);

  // Initialize service
  useEffect(() => {
    setIsSupported(WebSpeechService.isSupported());
    if (WebSpeechService.isSupported()) {
      serviceRef.current = new WebSpeechService();
    }
  }, []);

  // Update status periodically
  useEffect(() => {
    if (!serviceRef.current) return;

    const interval = setInterval(() => {
      if (serviceRef.current) {
        setStatus(serviceRef.current.getStatus());
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const speak = useCallback(
    async (text: string) => {
      if (!serviceRef.current) {
        const error = new Error('Speech synthesis not supported');
        options.onError?.(error);
        throw error;
      }

      try {
        setStatus('speaking');
        await serviceRef.current.speak(text, { speed });
        setStatus('idle');
        options.onEnd?.();
      } catch (error) {
        setStatus('idle');
        const err = error instanceof Error ? error : new Error('Speech error');
        options.onError?.(err);
        throw err;
      }
    },
    [speed, options]
  );

  const pause = useCallback(() => {
    if (!serviceRef.current) return;
    serviceRef.current.pause();
    setStatus('paused');
  }, []);

  const resume = useCallback(() => {
    if (!serviceRef.current) return;
    serviceRef.current.resume();
    setStatus('speaking');
  }, []);

  const cancel = useCallback(() => {
    if (!serviceRef.current) return;
    serviceRef.current.cancel();
    setStatus('idle');
  }, []);

  const setSpeed = useCallback((newSpeed: SpeechSpeed) => {
    if (!serviceRef.current) return;
    setSpeedState(newSpeed);
    serviceRef.current.setSpeed(newSpeed);
  }, []);

  return {
    speak,
    pause,
    resume,
    cancel,
    setSpeed,
    status,
    speed,
    isSupported,
    isSpeaking: status === 'speaking',
    isPaused: status === 'paused',
  };
}
