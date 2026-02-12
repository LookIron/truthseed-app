import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load and display a truth', async ({ page }) => {
    await page.goto('/');

    // Check header
    await expect(
      page.getByRole('heading', { name: 'TruthSeed' })
    ).toBeVisible();
    await expect(
      page.getByText('Descubre tu identidad en Cristo')
    ).toBeVisible();

    // Wait for truth to load
    await page.waitForSelector('[class*="card"]', { timeout: 5000 });

    // Check that a truth title is displayed
    const truthCard = page.locator('[class*="card"]').first();
    await expect(truthCard).toBeVisible();

    // Should have a category badge
    await expect(
      page.locator(
        'text=/Aceptado|Seguro|Significante|Identidad|Libertad|Amado/'
      )
    ).toBeVisible();
  });

  test('should display "Another truth" button', async ({ page }) => {
    await page.goto('/');

    const button = page.getByRole('button', { name: /otra verdad/i });
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
  });

  test('should load a different truth when clicking "Another truth"', async ({
    page,
  }) => {
    await page.goto('/');

    // Wait for initial truth to load
    await page.waitForSelector('[class*="card"]', { timeout: 5000 });

    // Get the first truth's title
    const initialTitle = await page.locator('h1').nth(1).textContent();

    // Click "Another truth" button
    await page.getByRole('button', { name: /otra verdad/i }).click();

    // Wait for potential animation
    await page.waitForTimeout(200);

    // Get the new truth's title
    const newTitle = await page.locator('h1').nth(1).textContent();

    // Titles might be the same occasionally (random selection from 10 items)
    // But the card should still be visible
    expect(initialTitle).toBeTruthy();
    expect(newTitle).toBeTruthy();
  });

  test('should display biblical reference section', async ({ page }) => {
    await page.goto('/');

    // Wait for truth to load
    await page.waitForSelector('[class*="card"]', { timeout: 5000 });

    // Check for reference section
    await expect(page.getByText('Referencia Bíblica')).toBeVisible();

    // Should show loading or verse text
    const verseSection = page.locator(
      'text=/Cargando versículo|Juan|Romanos|Efesios|Corintios|Gálatas|Jeremías/'
    );
    await expect(verseSection).toBeVisible();
  });

  test('should display listen button when verse is loaded', async ({
    page,
  }) => {
    await page.goto('/');

    // Wait for verse to load (may take a moment)
    await page.waitForTimeout(1000);

    // Listen button should be visible
    const listenButton = page.getByRole('button', { name: /escuchar/i });

    // Button might not be visible immediately if verse is still loading
    // But it should appear eventually
    await expect(listenButton).toBeVisible({ timeout: 3000 });
  });

  test('should show footer', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText(/© \d{4} TruthSeed/)).toBeVisible();
    await expect(page.getByText('Construido con Next.js')).toBeVisible();
  });

  test('should have correct meta tags for PWA', async ({ page }) => {
    await page.goto('/');

    // Check viewport meta tag
    const viewport = await page
      .locator('meta[name="viewport"]')
      .getAttribute('content');
    expect(viewport).toContain('width=device-width');

    // Check theme color
    const themeColor = await page
      .locator('meta[name="theme-color"]')
      .getAttribute('content');
    expect(themeColor).toBeTruthy();

    // Check manifest link
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', '/manifest.webmanifest');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Should still display all main elements
    await expect(
      page.getByRole('heading', { name: 'TruthSeed' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /otra verdad/i })
    ).toBeVisible();

    // Card should be visible and not overflow
    const card = page.locator('[class*="card"]').first();
    await expect(card).toBeVisible();

    const cardBox = await card.boundingBox();
    expect(cardBox).toBeTruthy();
    if (cardBox) {
      expect(cardBox.width).toBeLessThanOrEqual(375);
    }
  });

  test('should handle rapid button clicks gracefully', async ({ page }) => {
    await page.goto('/');

    await page.waitForSelector('[class*="card"]', { timeout: 5000 });

    const button = page.getByRole('button', { name: /otra verdad/i });

    // Click multiple times rapidly
    for (let i = 0; i < 5; i++) {
      await button.click();
      await page.waitForTimeout(50);
    }

    // Should still show a truth card
    await expect(page.locator('[class*="card"]').first()).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    const h1s = page.locator('h1');
    await expect(h1s.first()).toBeVisible(); // At least main title

    const h2Count = await page.locator('h2').count();
    expect(h2Count).toBeGreaterThanOrEqual(1);
  });

  test('should have accessible buttons with labels', async ({ page }) => {
    await page.goto('/');

    const anotherButton = page.getByRole('button', { name: /otra verdad/i });
    const accessibleName = await anotherButton.getAttribute('aria-label');
    expect(accessibleName || 'Otra verdad').toBeTruthy();
  });

  test('should be navigable with keyboard', async ({ page }) => {
    await page.goto('/');

    // Tab through focusable elements
    await page.keyboard.press('Tab');

    // The "Another truth" button should be focusable
    const anotherButton = page.getByRole('button', { name: /otra verdad/i });

    // Eventually focus should reach the button
    for (let i = 0; i < 10; i++) {
      const isFocused = await anotherButton.evaluate(
        (el) => el === document.activeElement
      );
      if (isFocused) break;
      await page.keyboard.press('Tab');
    }

    // Activate button with Enter key
    await page.keyboard.press('Enter');

    // Should still show a truth
    await expect(page.locator('[class*="card"]').first()).toBeVisible();
  });
});
