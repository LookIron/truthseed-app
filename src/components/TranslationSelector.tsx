'use client';

import { useState, useEffect } from 'react';
import {
  getTranslation,
  setTranslation,
  Translation,
} from '@/lib/translation-storage';

interface TranslationSelectorProps {
  onChange?: (translation: Translation) => void;
}

/**
 * Dropdown component for selecting Bible translation
 * Persists selection to localStorage and notifies parent on change
 */
export function TranslationSelector({ onChange }: TranslationSelectorProps) {
  const [selectedTranslation, setSelectedTranslation] = useState<Translation>(
    () => getTranslation()
  );

  useEffect(() => {
    // Load translation from localStorage on mount
    const stored = getTranslation();
    setSelectedTranslation(stored);
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTranslation = event.target.value as Translation;
    setSelectedTranslation(newTranslation);
    setTranslation(newTranslation);

    // Notify parent component
    if (onChange) {
      onChange(newTranslation);
    }
  };

  const translations: { value: Translation; label: string }[] = [
    { value: 'rv1960', label: 'Reina-Valera 1960 (RVR60)' },
    { value: 'rv1995', label: 'Reina-Valera 1995 (RVR95)' },
    { value: 'nvi', label: 'Nueva Versión Internacional (NVI)' },
    { value: 'dhh', label: 'Dios Habla Hoy (DHH)' },
    { value: 'pdt', label: 'Palabra de Dios para Todos (PDT)' },
    { value: 'kjv', label: 'King James Version (KJV)' },
  ];

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="translation-selector"
        className="text-sm font-medium text-gray-600 dark:text-gray-400"
      >
        Traducción:
      </label>
      <select
        id="translation-selector"
        value={selectedTranslation}
        onChange={handleChange}
        className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {translations.map((translation) => (
          <option key={translation.value} value={translation.value}>
            {translation.label}
          </option>
        ))}
      </select>
    </div>
  );
}
