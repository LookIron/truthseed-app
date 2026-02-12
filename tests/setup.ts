import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Web Speech API
global.speechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  getVoices: vi.fn(() => []),
  speaking: false,
  pending: false,
  paused: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
} as unknown as SpeechSynthesis;

global.SpeechSynthesisUtterance = vi
  .fn()
  .mockImplementation((text: string) => ({
    text,
    lang: 'es-ES',
    volume: 1,
    rate: 1,
    pitch: 1,
    voice: null,
    onstart: null,
    onend: null,
    onerror: null,
    onpause: null,
    onresume: null,
    onmark: null,
    onboundary: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof SpeechSynthesisUtterance;

// Mock SpeechSynthesisEvent
global.SpeechSynthesisEvent = class SpeechSynthesisEvent extends Event {
  utterance: SpeechSynthesisUtterance;
  constructor(
    type: string,
    eventInitDict?: { utterance?: SpeechSynthesisUtterance }
  ) {
    super(type);
    this.utterance =
      eventInitDict?.utterance || ({} as SpeechSynthesisUtterance);
  }
} as unknown as typeof SpeechSynthesisEvent;

// Mock SpeechSynthesisErrorEvent
global.SpeechSynthesisErrorEvent =
  class SpeechSynthesisErrorEvent extends Event {
    utterance: SpeechSynthesisUtterance;
    error: string;
    constructor(
      type: string,
      eventInitDict?: { utterance?: SpeechSynthesisUtterance; error?: string }
    ) {
      super(type);
      this.utterance =
        eventInitDict?.utterance || ({} as SpeechSynthesisUtterance);
      this.error = eventInitDict?.error || 'unknown';
    }
  } as unknown as typeof SpeechSynthesisErrorEvent;

// Mock IndexedDB for tests
const indexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn(),
  cmp: vi.fn(),
  databases: vi.fn(),
};

global.indexedDB = indexedDB as unknown as IDBFactory;
