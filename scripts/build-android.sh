#!/usr/bin/env bash
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
ARTIFACT="$ROOT/android/app/build/outputs/apk/release/app-release.apk"
DEST_DIR="$ROOT/builds"
DEST="$DEST_DIR/mealmate.apk"

echo "==> Building Android release APK"
cd "$ROOT/android"
./gradlew assembleRelease

if [ ! -f "$ARTIFACT" ]; then
  echo "Build did not produce $ARTIFACT" >&2
  exit 1
fi

mkdir -p "$DEST_DIR"
rm -f "$DEST"
cp "$ARTIFACT" "$DEST"

echo "Done: $DEST"
