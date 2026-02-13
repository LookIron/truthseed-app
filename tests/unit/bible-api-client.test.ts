import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BibleApiClient } from '@/lib/bible-api-client';
import { Reference } from '@/domain/models/Reference';

describe('BibleApiClient', () => {
  let client: BibleApiClient;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Create client instance (docs-bible-api)
    client = new BibleApiClient('https://bible-api.deno.dev/api/read', 'nvi');

    // Mock fetch
    fetchMock = vi.spyOn(global, 'fetch') as ReturnType<typeof vi.fn>;

    // Use fake timers for retry delay testing
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Clean up mocks
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('successful verse fetch', () => {
    it('should fetch single verse successfully', async () => {
      const reference: Reference = {
        book: 'Mateo',
        chapter: 5,
        verseStart: 13,
        display: 'Mateo 5:13',
        translation: 'nvi',
      };

      const mockResponse = [
        {
          verse: 'Vosotros sois la sal de la tierra.',
          number: 13,
          study: '',
          id: 'mateo-5-13',
        },
      ];

      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await client.fetchVerse(reference);

      expect(result).not.toBeNull();
      expect(result?.text).toBe('Vosotros sois la sal de la tierra.');
      expect(result?.translation).toBe('nvi');
    });

    it('should fetch verse range successfully', async () => {
      const reference: Reference = {
        book: 'Mateo',
        chapter: 5,
        verseStart: 13,
        verseEnd: 14,
        display: 'Mateo 5:13-14',
        translation: 'nvi',
      };

      const mockResponse = [
        {
          verse: 'Vosotros sois la sal de la tierra.',
          number: 13,
          study: '',
          id: 'mateo-5-13',
        },
        {
          verse: 'Vosotros sois la luz del mundo.',
          number: 14,
          study: '',
          id: 'mateo-5-14',
        },
      ];

      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await client.fetchVerse(reference);

      expect(result).not.toBeNull();
      expect(result?.text).toBe(
        'Vosotros sois la sal de la tierra. Vosotros sois la luz del mundo.'
      );
    });

    it('should strip HTML tags from verse text', async () => {
      const reference: Reference = {
        book: 'Juan',
        chapter: 3,
        verseStart: 16,
        display: 'Juan 3:16',
        translation: 'nvi',
      };

      const mockResponse = [
        {
          verse:
            '<strong>Porque de tal manera amó Dios</strong> al mundo, que ha dado a su <em>Hijo unigénito</em>.',
          number: 16,
          study: '',
          id: 'juan-3-16',
        },
      ];

      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await client.fetchVerse(reference);

      expect(result).not.toBeNull();
      expect(result?.text).toBe(
        'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito.'
      );
      // Verify no HTML tags remain
      expect(result?.text).not.toContain('<');
      expect(result?.text).not.toContain('>');
    });

    it('should use reference translation if provided', async () => {
      const reference: Reference = {
        book: 'Mateo',
        chapter: 5,
        verseStart: 13,
        display: 'Mateo 5:13',
        translation: 'rvr60',
      };

      const mockResponse = [
        {
          verse: 'Test content',
          number: 13,
          study: '',
          id: 'mateo-5-13',
        },
      ];

      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      await client.fetchVerse(reference);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('rvr60'),
        expect.any(Object)
      );
    });
  });

  describe('error scenarios', () => {
    it('should return null on 404 response (verse not found)', async () => {
      const reference: Reference = {
        book: 'Mateo',
        chapter: 999,
        verseStart: 999,
        display: 'Mateo 999:999',
        translation: 'nvi',
      };

      fetchMock.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            statusCode: 404,
            message: 'Passage not found',
          }),
          { status: 404 }
        )
      );

      const result = await client.fetchVerse(reference);

      expect(result).toBeNull();
    });

    it('should return null on 429 response (rate limit exceeded)', async () => {
      const reference: Reference = {
        book: 'Mateo',
        chapter: 5,
        verseStart: 13,
        display: 'Mateo 5:13',
        translation: 'nvi',
      };

      fetchMock.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            statusCode: 429,
            message: 'Rate limit exceeded',
          }),
          { status: 429 }
        )
      );

      const result = await client.fetchVerse(reference);

      expect(result).toBeNull();
    });

    it('should handle 500 response with retry', async () => {
      const reference: Reference = {
        book: 'Mateo',
        chapter: 5,
        verseStart: 13,
        display: 'Mateo 5:13',
        translation: 'nvi',
      };

      // First attempt returns 500
      fetchMock.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            statusCode: 500,
            message: 'Internal server error',
          }),
          { status: 500 }
        )
      );

      // Second attempt (after retry) also fails
      fetchMock.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            statusCode: 500,
            message: 'Internal server error',
          }),
          { status: 500 }
        )
      );

      const promise = client.fetchVerse(reference);

      // Fast-forward time for retry delay
      await vi.advanceTimersByTimeAsync(1000);

      const result = await promise;

      expect(result).toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(2); // Initial + 1 retry
    });

    it('should handle 503 response with retry', async () => {
      const reference: Reference = {
        book: 'Mateo',
        chapter: 5,
        verseStart: 13,
        display: 'Mateo 5:13',
        translation: 'nvi',
      };

      // First attempt returns 503
      fetchMock.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            statusCode: 503,
            message: 'Service unavailable',
          }),
          { status: 503 }
        )
      );

      // Second attempt (after retry) also fails
      fetchMock.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            statusCode: 503,
            message: 'Service unavailable',
          }),
          { status: 503 }
        )
      );

      const promise = client.fetchVerse(reference);

      // Fast-forward time for retry delay
      await vi.advanceTimersByTimeAsync(1000);

      const result = await promise;

      expect(result).toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(2); // Initial + 1 retry
    });

    it('should return null on network error', async () => {
      const reference: Reference = {
        book: 'Mateo',
        chapter: 5,
        verseStart: 13,
        display: 'Mateo 5:13',
        translation: 'nvi',
      };

      fetchMock.mockRejectedValueOnce(new Error('Network error'));

      const result = await client.fetchVerse(reference);

      expect(result).toBeNull();
    });

    it('should return null on timeout', async () => {
      const reference: Reference = {
        book: 'Mateo',
        chapter: 5,
        verseStart: 13,
        display: 'Mateo 5:13',
        translation: 'nvi',
      };

      // Mock fetch to throw AbortError
      fetchMock.mockImplementationOnce(() => {
        const error = new Error('The operation was aborted');
        error.name = 'AbortError';
        return Promise.reject(error);
      });

      const result = await client.fetchVerse(reference);

      expect(result).toBeNull();
    });
  });

  describe('retry logic', () => {
    it('should retry on 5xx errors', async () => {
      const reference: Reference = {
        book: 'Mateo',
        chapter: 5,
        verseStart: 13,
        display: 'Mateo 5:13',
        translation: 'nvi',
      };

      // First attempt returns 500
      fetchMock.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            statusCode: 500,
            message: 'Internal server error',
          }),
          { status: 500 }
        )
      );

      // Retry succeeds
      const mockResponse = [
        {
          verse: 'Test content',
          number: 13,
          study: '',
          id: 'mateo-5-13',
        },
      ];

      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const promise = client.fetchVerse(reference);

      // Fast-forward time for retry delay
      await vi.advanceTimersByTimeAsync(1000);

      const result = await promise;

      expect(result).not.toBeNull();
      expect(result?.text).toBe('Test content');
      expect(fetchMock).toHaveBeenCalledTimes(2); // Initial + 1 retry
    });

    it('should NOT retry on 4xx errors', async () => {
      const reference: Reference = {
        book: 'Mateo',
        chapter: 5,
        verseStart: 13,
        display: 'Mateo 5:13',
        translation: 'nvi',
      };

      fetchMock.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            statusCode: 404,
            message: 'Not found',
          }),
          { status: 404 }
        )
      );

      const result = await client.fetchVerse(reference);

      expect(result).toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1); // No retry
    });

    it('should wait 1 second before retry', async () => {
      const reference: Reference = {
        book: 'Mateo',
        chapter: 5,
        verseStart: 13,
        display: 'Mateo 5:13',
        translation: 'nvi',
      };

      fetchMock.mockResolvedValue(
        new Response(
          JSON.stringify({
            statusCode: 500,
            message: 'Internal server error',
          }),
          { status: 500 }
        )
      );

      const promise = client.fetchVerse(reference);

      // Should have made first request
      expect(fetchMock).toHaveBeenCalledTimes(1);

      // Advance time by 500ms - retry should not have happened yet
      await vi.advanceTimersByTimeAsync(500);
      expect(fetchMock).toHaveBeenCalledTimes(1);

      // Advance another 500ms - retry should happen now
      await vi.advanceTimersByTimeAsync(500);
      await promise;
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('should return null if retry fails', async () => {
      const reference: Reference = {
        book: 'Mateo',
        chapter: 5,
        verseStart: 13,
        display: 'Mateo 5:13',
        translation: 'nvi',
      };

      // Both attempts fail
      fetchMock.mockResolvedValue(
        new Response(
          JSON.stringify({
            statusCode: 500,
            message: 'Internal server error',
          }),
          { status: 500 }
        )
      );

      const promise = client.fetchVerse(reference);

      await vi.advanceTimersByTimeAsync(1000);

      const result = await promise;

      expect(result).toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('edge cases', () => {
    it('should return null immediately for invalid book name', async () => {
      const reference: Reference = {
        book: 'Invalid Book',
        chapter: 1,
        verseStart: 1,
        display: 'Invalid Book 1:1',
        translation: 'nvi',
      };

      const result = await client.fetchVerse(reference);

      expect(result).toBeNull();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should return null for empty response array', async () => {
      const reference: Reference = {
        book: 'Mateo',
        chapter: 5,
        verseStart: 13,
        display: 'Mateo 5:13',
        translation: 'nvi',
      };

      const mockResponse: never[] = [];

      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await client.fetchVerse(reference);

      expect(result).toBeNull();
    });

    it('should return null for verse with empty text', async () => {
      const reference: Reference = {
        book: 'Mateo',
        chapter: 5,
        verseStart: 13,
        display: 'Mateo 5:13',
        translation: 'nvi',
      };

      const mockResponse = [
        {
          verse: '',
          number: 13,
          study: '',
          id: 'mateo-5-13',
        },
      ];

      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await client.fetchVerse(reference);

      expect(result).toBeNull();
    });

    it('should handle malformed JSON response gracefully', async () => {
      const reference: Reference = {
        book: 'Mateo',
        chapter: 5,
        verseStart: 13,
        display: 'Mateo 5:13',
        translation: 'nvi',
      };

      fetchMock.mockResolvedValueOnce(
        new Response('This is not valid JSON', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await client.fetchVerse(reference);

      expect(result).toBeNull();
    });

    it('should normalize multiple whitespace characters', async () => {
      const reference: Reference = {
        book: 'Mateo',
        chapter: 5,
        verseStart: 13,
        display: 'Mateo 5:13',
        translation: 'nvi',
      };

      const mockResponse = [
        {
          verse: 'Vosotros   sois\n\nla    sal   \t  de la tierra.',
          number: 13,
          study: '',
          id: 'mateo-5-13',
        },
      ];

      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await client.fetchVerse(reference);

      expect(result).not.toBeNull();
      expect(result?.text).toBe('Vosotros sois la sal de la tierra.');
    });

    it('should handle non-array response', async () => {
      const reference: Reference = {
        book: 'Mateo',
        chapter: 5,
        verseStart: 13,
        display: 'Mateo 5:13',
        translation: 'nvi',
      };

      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await client.fetchVerse(reference);

      expect(result).toBeNull();
    });
  });
});
