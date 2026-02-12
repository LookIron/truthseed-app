# PWA Icons

This directory should contain PWA icons in various sizes.

## Required Sizes

- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## Generation Methods

### Option 1: Using ImageMagick

If you have ImageMagick installed:

```bash
./scripts/generate-icons.sh
```

Install ImageMagick:

```bash
brew install imagemagick  # macOS
```

### Option 2: Online Icon Generators

Use one of these services to generate icons from the `public/icon.svg` file:

1. **PWA Builder Image Generator**
   - https://www.pwabuilder.com/imageGenerator
   - Upload the SVG and download all sizes

2. **Real Favicon Generator**
   - https://realfavicongenerator.net/
   - Comprehensive icon generation for all platforms

3. **Favicon.io**
   - https://favicon.io/
   - Simple and free

### Option 3: Manual Creation

Use any image editor to create PNG files in the required sizes from the `public/icon.svg` file.

## Apple Touch Icon

Also generate an `apple-touch-icon.png` (180x180) in the `public/` directory.

## Note for Development

For development purposes, you can use placeholder icons. The app will still function without them, but won't be installable as a PWA until proper icons are generated.
