import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { BibleApiClient } from '@/lib/bible-api-client';
import { Reference } from '@/domain/models/Reference';

const VerseQuerySchema = z.object({
  book: z.string().min(1),
  chapter: z.string().regex(/^\d+$/),
  verseStart: z.string().regex(/^\d+$/),
  verseEnd: z.string().regex(/^\d+$/).optional(),
  translation: z.string().min(1).default('nvi'),
});

/**
 * API Route: GET /api/verse
 * Fetches Bible verses from docs-bible-api (free, no authentication required)
 * Caches responses using Next.js fetch cache
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const query = {
      book: searchParams.get('book'),
      chapter: searchParams.get('chapter'),
      verseStart: searchParams.get('verseStart'),
      verseEnd: searchParams.get('verseEnd'),
      translation: searchParams.get('translation') || 'nvi',
    };

    // Validate query parameters
    const validatedQuery = VerseQuerySchema.safeParse(query);
    if (!validatedQuery.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validatedQuery.error },
        { status: 400 }
      );
    }

    const { book, chapter, verseStart, verseEnd, translation } =
      validatedQuery.data;

    // Construct Reference object from validated query parameters
    const reference: Reference = {
      book,
      chapter: parseInt(chapter),
      verseStart: parseInt(verseStart),
      verseEnd: verseEnd ? parseInt(verseEnd) : undefined,
      display: `${book} ${chapter}:${verseStart}${verseEnd ? `-${verseEnd}` : ''}`,
      translation,
    };

    // Create BibleApiClient instance (no authentication required)
    const client = new BibleApiClient(undefined, translation);

    // Fetch verse from docs-bible-api
    const verseData = await client.fetchVerse(reference);

    // If API call fails, return error
    if (!verseData) {
      return NextResponse.json(
        {
          error: 'Verse not found',
          message: 'Failed to fetch verse from Bible API',
        },
        { status: 404 }
      );
    }

    // Return the verse with cache headers
    const response = {
      text: verseData.text,
      reference,
      translation: verseData.translation,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control':
          'public, s-maxage=604800, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Verse API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch verse',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
