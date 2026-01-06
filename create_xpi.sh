#!/bin/bash

# Create XPI package for Firefox extension distribution

NAME="open-in-slack-app"
VERSION=$(grep '"version"' manifest.json | sed 's/.*: *"\([^"]*\)".*/\1/')
OUTPUT="${NAME}-${VERSION}.xpi"

# Remove old xpi if exists
rm -f "$OUTPUT"

# Create xpi (it's just a zip)
zip -r "$OUTPUT" \
    manifest.json \
    background.js \
    popup.html \
    popup.js \
    icons/ \
    -x "*.DS_Store"

echo "Created: $OUTPUT"

