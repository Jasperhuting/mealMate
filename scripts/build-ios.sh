#!/usr/bin/env bash
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
ARTIFACT="$ROOT/ios/build/Build/Products/Release-iphonesimulator/Tably.app"
DEST_DIR="$ROOT/builds"
DEST="$DEST_DIR/Tably.app"

echo "==> Building iOS Simulator .app (Release)"
cd "$ROOT/ios"
xcodebuild \
  -workspace Tably.xcworkspace \
  -scheme Tably \
  -configuration Release \
  -sdk iphonesimulator \
  -derivedDataPath build \
  -quiet

if [ ! -d "$ARTIFACT" ]; then
  echo "Build did not produce $ARTIFACT" >&2
  exit 1
fi

mkdir -p "$DEST_DIR"
rm -rf "$DEST"
cp -R "$ARTIFACT" "$DEST"

echo "Done: $DEST"
