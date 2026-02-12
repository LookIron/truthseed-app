import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

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

    // In a real implementation, you would:
    // 1. Map book name to Bible API book ID
    // 2. Construct the proper API URL
    // 3. Make the request with authentication
    // 4. Parse the response

    // For now, return mock data since we don't have actual API credentials
    // This allows the app to function without real API setup
    const mockResponse = {
      text: `Texto bíblico de ${book} ${chapter}:${verseStart}${verseEnd ? `-${verseEnd}` : ''} (${translation})`,
      reference: {
        book,
        chapter: parseInt(chapter),
        verseStart: parseInt(verseStart),
        verseEnd: verseEnd ? parseInt(verseEnd) : undefined,
        display: `${book} ${chapter}:${verseStart}${verseEnd ? `-${verseEnd}` : ''}`,
        translation,
      },
      translation,
    };

    // Example of how you would make a real API call:
    /*
    const bibleId = await getBibleIdForTranslation(translation);
    const verseId = `${bookId}.${chapter}.${verseStart}${verseEnd ? `-${verseEnd}` : ''}`;

    const response = await fetch(
      `${baseUrl}/bibles/${bibleId}/verses/${verseId}`,
      {
        headers: {
          'api-key': apiKey,
        },
        next: {
          revalidate: 60 * 60 * 24 * 7, // Cache for 7 days
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Bible API error: ${response.statusText}`);
    }

    const data = await response.json();
    const verseText = data.data.content; // Extract text from API response
    */

    return NextResponse.json(mockResponse, {
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
