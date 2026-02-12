#!/bin/bash

# Script to generate PWA icons from SVG source
# Requires ImageMagick or similar tool
# For production, use a proper icon generator service

echo "Generating PWA icons..."

SIZES=(72 96 128 144 152 192 384 512)
SOURCE="public/icon.svg"
OUTPUT_DIR="public/icons"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Check if we have imagemagick or convert command
if ! command -v convert &> /dev/null; then
    echo "⚠️  ImageMagick not found. Skipping icon generation."
    echo "   Install ImageMagick to generate icons: brew install imagemagick"
    echo "   Or use an online PWA icon generator:"
    echo "   - https://www.pwabuilder.com/imageGenerator"
    echo "   - https://realfavicongenerator.net/"
    exit 0
fi

# Generate each size
for size in "${SIZES[@]}"; do
    echo "  Generating ${size}x${size}..."
    convert -background none -resize "${size}x${size}" "$SOURCE" "${OUTPUT_DIR}/icon-${size}x${size}.png"
done

# Generate apple-touch-icon
echo "  Generating apple-touch-icon..."
convert -background none -resize 180x180 "$SOURCE" "public/apple-touch-icon.png"

echo "✅ Icon generation complete!"
