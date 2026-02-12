'use client';

import { Truth } from '@/domain/models/Truth';
import { TruthListItem } from '@/components/TruthListItem';
import truthsData from '@/content/truths.json';
import Link from 'next/link';

/**
 * Truths List Page - displays all available truths
 */
export default function TruthsPage() {
  const truths = truthsData.truths as Truth[];

  return (
    <main className="min-h-screen py-8 px-4 md:py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Todas las Verdades
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Explora {truths.length} verdades sobre tu identidad en Cristo
          </p>
        </header>

        {/* Back Button */}
        <div className="flex justify-center pt-2">
          <Link
            href="/"
            className="btn btn-secondary text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            aria-label="Volver al inicio"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver
          </Link>
        </div>

        {/* Truths Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
          {truths.map((truth) => (
            <TruthListItem key={truth.id} truth={truth} />
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 dark:text-gray-400 pt-8">
          <p>&copy; {new Date().getFullYear()} TruthSeed.</p>
        </footer>
      </div>
    </main>
  );
}
