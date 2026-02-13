'use client';

import { Truth } from '@/domain/models/Truth';
import { formatReference } from '@/domain/models/Reference';
import { useState, useEffect } from 'react';
import { bibleProvider } from '@/lib/bible-provider-factory';
import { isVerseError } from '@/domain/services/BibleProvider';
import { verseCache } from '@/infrastructure/cache/IndexedDBCache';
import { getReferenceCacheKey } from '@/domain/models/Reference';
import { ListenButton } from './ListenButton';
import { TranslationSelector } from './TranslationSelector';
import { getTranslation, Translation } from '@/lib/translation-storage';

interface TruthCardProps {
  truth: Truth;
}

/**
 * Component that displays a truth with its biblical references
 * Fetches and caches verse text from Bible provider
 */
export function TruthCard({ truth }: TruthCardProps) {
  const [verseText, setVerseText] = useState<string | null>(null);
  const [verseError, setVerseError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTranslation, setSelectedTranslation] = useState<Translation>(
    () => getTranslation()
  );

  useEffect(() => {
    async function fetchVerse() {
      setIsLoading(true);
      setVerseError(null);

      try {
        // Use first reference and apply selected translation
        const baseReference = truth.references[0];
        const reference = {
          ...baseReference,
          translation: selectedTranslation,
        };
        const cacheKey = getReferenceCacheKey(reference);

        // Try cache first
        if (verseCache.constructor.name === 'IndexedDBCache') {
          const cached = await verseCache.get(cacheKey);
          if (cached) {
            setVerseText(cached);
            setIsLoading(false);
            return;
          }
        }

        // Fetch from provider
        const result = await bibleProvider.fetchVerse(reference);

        if (isVerseError(result)) {
          setVerseError(result.error);
        } else {
          setVerseText(result.text);
          // Cache the result
          if (verseCache.constructor.name === 'IndexedDBCache') {
            await verseCache.set(cacheKey, result.text);
          }
        }
      } catch (error) {
        setVerseError(
          error instanceof Error ? error.message : 'Error desconocido'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchVerse();
  }, [truth, selectedTranslation]);

  return (
    <div className="card max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Category Badge */}
      <div className="flex items-center gap-2">
        <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
          {getCategoryLabel(truth.category)}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
        {truth.title}
      </h1>

      {/* Renounce Statement */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 rounded-lg border-l-4 border-blue-600">
        <p className="text-lg text-gray-800 dark:text-gray-200 font-medium">
          {truth.renounceStatement}
        </p>
      </div>

      {/* Translation Selector */}
      <div className="flex justify-end">
        <TranslationSelector
          onChange={(translation) => setSelectedTranslation(translation)}
        />
      </div>

      {/* Biblical Reference */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Referencia Bíblica
          </h2>
          {verseText && <ListenButton text={verseText} />}
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              <span>Cargando versículo...</span>
            </div>
          )}

          {verseError && (
            <div className="text-amber-600 dark:text-amber-400">
              <p className="font-medium">
                {formatReference(truth.references[0])}
              </p>
              <p className="text-sm mt-2">{verseError}</p>
            </div>
          )}

          {verseText && !isLoading && (
            <>
              <p className="text-gray-700 dark:text-gray-300 italic mb-2">
                &ldquo;{verseText}&rdquo;
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                — {formatReference(truth.references[0])}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Tags */}
      {truth.tags && truth.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {truth.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    accepted: 'Aceptado',
    secure: 'Seguro',
    significant: 'Significante',
    identity: 'Identidad',
    freedom: 'Libertad',
    loved: 'Amado',
  };
  return labels[category] || category;
}
