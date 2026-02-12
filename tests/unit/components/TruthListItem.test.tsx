import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TruthListItem } from '@/components/TruthListItem';
import { Truth } from '@/domain/models/Truth';

describe('TruthListItem', () => {
  const mockTruthWithTags: Truth = {
    id: 'accepted-child-of-god',
    title: 'Soy aceptado: Soy hijo de Dios',
    renounceStatement:
      'Renuncio a la mentira que soy rechazado. En Cristo, soy hijo de Dios.',
    category: 'accepted',
    references: [
      {
        book: 'Juan',
        chapter: 1,
        verseStart: 12,
        display: 'Juan 1:12',
        translation: 'RVR60',
      },
    ],
    tags: ['identity', 'adoption', 'acceptance'],
  };

  const mockTruthWithoutTags: Truth = {
    id: 'truth-without-tags',
    title: 'Verdad sin etiquetas',
    renounceStatement: 'Renuncio a la mentira.',
    category: 'accepted',
    references: [
      {
        book: 'Romanos',
        chapter: 8,
        verseStart: 1,
        display: 'Romanos 8:1',
        translation: 'RVR60',
      },
    ],
    tags: [],
  };

  const mockTruthWithVerseRange: Truth = {
    id: 'truth-with-range',
    title: 'Verdad con rango de versículos',
    renounceStatement: 'Renuncio a la mentira.',
    category: 'secure',
    references: [
      {
        book: 'Romanos',
        chapter: 8,
        verseStart: 1,
        verseEnd: 2,
        display: 'Romanos 8:1-2',
        translation: 'RVR60',
      },
    ],
    tags: ['freedom', 'forgiveness'],
  };

  it('should render with required props', () => {
    render(<TruthListItem truth={mockTruthWithTags} />);
    expect(
      screen.getByText('Soy aceptado: Soy hijo de Dios')
    ).toBeInTheDocument();
  });

  it('should display truth title correctly', () => {
    render(<TruthListItem truth={mockTruthWithTags} />);
    const title = screen.getByText('Soy aceptado: Soy hijo de Dios');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H3');
  });

  it('should display formatted biblical reference', () => {
    render(<TruthListItem truth={mockTruthWithTags} />);
    expect(screen.getByText('Juan 1:12')).toBeInTheDocument();
  });

  it('should display all tags as badges', () => {
    render(<TruthListItem truth={mockTruthWithTags} />);
    expect(screen.getByText('#identity')).toBeInTheDocument();
    expect(screen.getByText('#adoption')).toBeInTheDocument();
    expect(screen.getByText('#acceptance')).toBeInTheDocument();
  });

  it('should handle truths with no tags gracefully', () => {
    const { container } = render(
      <TruthListItem truth={mockTruthWithoutTags} />
    );

    // Should still render the title and reference
    expect(screen.getByText('Verdad sin etiquetas')).toBeInTheDocument();
    expect(screen.getByText('Romanos 8:1')).toBeInTheDocument();

    // Should not render any tag badges
    const tagElements = container.querySelectorAll('[class*="px-2"]');
    expect(tagElements.length).toBe(0);
  });

  it('should handle verse range references correctly', () => {
    render(<TruthListItem truth={mockTruthWithVerseRange} />);
    expect(screen.getByText('Romanos 8:1-2')).toBeInTheDocument();
  });

  it('should display only the first reference when multiple exist', () => {
    const truthWithMultipleRefs: Truth = {
      ...mockTruthWithTags,
      references: [
        {
          book: 'Juan',
          chapter: 1,
          verseStart: 12,
          display: 'Juan 1:12',
          translation: 'RVR60',
        },
        {
          book: 'Romanos',
          chapter: 8,
          verseStart: 1,
          display: 'Romanos 8:1',
          translation: 'RVR60',
        },
      ],
    };

    render(<TruthListItem truth={truthWithMultipleRefs} />);

    // Should show first reference
    expect(screen.getByText('Juan 1:12')).toBeInTheDocument();

    // Should not show second reference
    expect(screen.queryByText('Romanos 8:1')).not.toBeInTheDocument();
  });

  it('should apply correct CSS classes for card styling', () => {
    const { container } = render(<TruthListItem truth={mockTruthWithTags} />);
    const cardElement = container.firstChild as HTMLElement;

    expect(cardElement.className).toContain('card');
    expect(cardElement.className).toContain('hover:shadow-lg');
    expect(cardElement.className).toContain('cursor-pointer');
  });

  it('should handle long titles without breaking layout', () => {
    const truthWithLongTitle: Truth = {
      ...mockTruthWithTags,
      title:
        'Este es un título muy largo que probablemente se extenderá a múltiples líneas en la interfaz de usuario y debería manejarse correctamente sin romper el diseño',
    };

    render(<TruthListItem truth={truthWithLongTitle} />);
    const title = screen.getByRole('heading', { level: 3 });

    expect(title).toBeInTheDocument();
    expect(title.className).toContain('leading-tight');
  });

  it('should render tags with proper structure', () => {
    const { container } = render(<TruthListItem truth={mockTruthWithTags} />);
    const tagContainer = container.querySelector('.flex.flex-wrap');

    expect(tagContainer).toBeInTheDocument();

    const tags = tagContainer?.querySelectorAll('span');
    expect(tags?.length).toBe(3);
  });
});
