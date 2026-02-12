'use client';

import { Truth } from '@/domain/models/Truth';
import { formatReference } from '@/domain/models/Reference';

interface TruthListItemProps {
  truth: Truth;
}

/**
 * Component that displays a truth as a list item
 * Shows title, primary reference, and tags in a compact format
 */
export function TruthListItem({ truth }: TruthListItemProps) {
  return (
    <div className="card hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1">
      {/* Title */}
      <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
        {truth.title}
      </h3>

      {/* Biblical Reference */}
      <p className="text-sm md:text-base text-blue-600 dark:text-blue-400 font-medium mb-3">
        {formatReference(truth.references[0])}
      </p>

      {/* Tags */}
      {truth.tags && truth.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
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
