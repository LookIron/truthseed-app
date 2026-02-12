'use client';

import { useSpeech } from '@/hooks/useSpeech';
import { SpeechSpeed } from '@/infrastructure/audio/WebSpeechService';
import { useState } from 'react';

interface ListenButtonProps {
  text: string;
}

/**
 * Component that provides audio playback controls for text-to-speech
 */
export function ListenButton({ text }: ListenButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const { speak, cancel, isSpeaking, isSupported, speed, setSpeed } = useSpeech(
    {
      onError: (err) => {
        setError(err.message);
        setTimeout(() => setError(null), 3000);
      },
    }
  );

  if (!isSupported) {
    return (
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Audio no disponible en este navegador
      </div>
    );
  }

  const handleSpeak = () => {
    if (isSpeaking) {
      cancel();
    } else {
      speak(text).catch(() => {
        // Error already handled by onError callback
      });
    }
  };

  const handleSpeedChange = (newSpeed: SpeechSpeed) => {
    setSpeed(newSpeed);
    setShowSpeedMenu(false);
  };

  const speedLabels: Record<SpeechSpeed, string> = {
    0.8: '0.8x',
    1: '1x',
    1.2: '1.2x',
  };

  return (
    <div className="flex items-center gap-2">
      {error && (
        <div className="text-xs text-red-600 dark:text-red-400">{error}</div>
      )}

      {/* Speed selector */}
      <div className="relative">
        <button
          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
          className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          aria-label="Cambiar velocidad"
        >
          {speedLabels[speed]}
        </button>

        {showSpeedMenu && (
          <div className="absolute right-0 bottom-full mb-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10">
            {([0.8, 1, 1.2] as SpeechSpeed[]).map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  s === speed
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-medium'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {speedLabels[s]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Play/Stop button */}
      <button
        onClick={handleSpeak}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={isSpeaking ? 'Detener audio' : 'Escuchar'}
      >
        {isSpeaking ? (
          <>
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">Detener</span>
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">Escuchar</span>
          </>
        )}
      </button>
    </div>
  );
}
