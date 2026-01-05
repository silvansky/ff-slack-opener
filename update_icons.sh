#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SVG="$SCRIPT_DIR/slack-opener.svg"
ICONS_DIR="$SCRIPT_DIR/icons"

mkdir -p "$ICONS_DIR"

rsvg-convert -w 16 -h 16 "$SVG" -o "$ICONS_DIR/icon-16.png"
rsvg-convert -w 32 -h 32 "$SVG" -o "$ICONS_DIR/icon-32.png"
rsvg-convert -w 48 -h 48 "$SVG" -o "$ICONS_DIR/icon-48.png"
rsvg-convert -w 128 -h 128 "$SVG" -o "$ICONS_DIR/icon-128.png"

echo "Icons updated successfully"

