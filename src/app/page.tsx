'use client';

import { useState, useEffect } from 'react';
import { Truth } from '@/domain/models/Truth';
import { TruthCard } from '@/components/TruthCard';
import { selectRandom } from '@/lib/randomSelector';
import truthsData from '@/content/truths.json';

/**
 * Home page - displays random truth with "Another truth" button
 */
export default function Home() {
  const [currentTruth, setCurrentTruth] = useState<Truth | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load initial truth on mount
  useEffect(() => {
    const truth = selectRandom(truthsData.truths as Truth[]);
    setCurrentTruth(truth);
  }, []);

  const handleAnotherTruth = () => {
    setIsTransitioning(true);

    // Brief delay for animation
    setTimeout(() => {
      const truth = selectRandom(truthsData.truths as Truth[]);
      setCurrentTruth(truth);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <main className="min-h-screen py-8 px-4 md:py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TruthSeed
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Descubre tu identidad en Cristo
          </p>
        </header>

        {/* Truth Card */}
        <div
          className={`transition-opacity duration-150 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {currentTruth ? (
            <TruthCard truth={currentTruth} key={currentTruth.id} />
          ) : (
            <div className="card max-w-2xl mx-auto text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Cargando verdad...
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button
            onClick={handleAnotherTruth}
            disabled={!currentTruth || isTransitioning}
            className="btn btn-primary text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            aria-label="Cargar otra verdad"
          >
            <svg
              className="w-5 h-5 inline-block mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Otra verdad
          </button>

          <a
            href="/truths"
            className="btn btn-secondary text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            aria-label="Ver todas las verdades"
          >
            <svg
              className="w-5 h-5 inline-block mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            Ver Todas
          </a>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 dark:text-gray-400 pt-8">
          <p>&copy; {new Date().getFullYear()} TruthSeed.</p>
        </footer>
      </div>
    </main>
  );
}
