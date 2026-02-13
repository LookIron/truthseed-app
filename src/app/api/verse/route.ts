import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { BibleApiClient } from '@/lib/bible-api-client';
import { Reference } from '@/domain/models/Reference';
import { MockBibleProvider } from '@/infrastructure/bible/MockBibleProvider';

const VerseQuerySchema = z.object({
  book: z.string().min(1),
  chapter: z.string().regex(/^\d+$/),
  verseStart: z.string().regex(/^\d+$/),
  verseEnd: z.string().regex(/^\d+$/).optional(),
  translation: z.string().min(1).default('RVR60'),
});

/**
 * API Route: GET /api/verse
 * Proxies Bible API requests to keep API keys server-side
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
      translation: searchParams.get('translation') || 'RVR60',
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

    // Check if Bible API is configured
    const baseUrl = process.env.BIBLE_API_BASE_URL;
    const apiKey = process.env.BIBLE_API_KEY;

    if (!baseUrl || !apiKey) {
      return NextResponse.json(
        {
          error:
            'Bible API not configured. Please set BIBLE_API_BASE_URL and BIBLE_API_KEY environment variables.',
        },
        { status: 503 }
      );
    }

    // Construct Reference object from validated query parameters
    const reference: Reference = {
      book,
      chapter: parseInt(chapter),
      verseStart: parseInt(verseStart),
      verseEnd: verseEnd ? parseInt(verseEnd) : undefined,
      display: `${book} ${chapter}:${verseStart}${verseEnd ? `-${verseEnd}` : ''}`,
      translation,
    };

    // Create BibleApiClient instance
    const client = new BibleApiClient(baseUrl, apiKey, translation);

    // Attempt to fetch verse from scripture.api.bible
    const verseData = await client.fetchVerse(reference);

    // If API call succeeds, return the verse
    if (verseData) {
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
    }

    // Fallback to MockBibleProvider if API fails
    console.warn(
      '[Verse API] BibleApiClient failed, falling back to MockBibleProvider'
    );
    const mockProvider = new MockBibleProvider();
    const mockResult = await mockProvider.fetchVerse(reference);

    // If mock provider returns error, send 404
    if ('error' in mockResult) {
      return NextResponse.json(
        {
          error: 'Verse not found',
          message: mockResult.error,
        },
        { status: 404 }
      );
    }

    // Return mock result with cache headers
    const response = {
      text: mockResult.text,
      reference: mockResult.reference,
      translation: mockResult.translation,
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
