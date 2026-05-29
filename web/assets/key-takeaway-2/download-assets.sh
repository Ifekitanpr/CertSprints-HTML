#!/usr/bin/env bash
# Figma 4495:* — Structural Recap Key Takeaways Type II
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
ICON="$ROOT/icons"
download() { curl -fsSL "$1" -o "$2"; echo "OK $2"; }
download "https://www.figma.com/api/mcp/asset/d62f3911-07fd-4441-b3dd-6fd380184c62" "$ICON/checkbox-unchecked-20.svg"
download "https://www.figma.com/api/mcp/asset/e0d028a9-fb5c-4ed5-8795-d27b7911b185" "$ICON/checkbox-checked-20.svg"
download "https://www.figma.com/api/mcp/asset/c2d188ed-b566-407b-9c0a-46486739ca48" "$ICON/progress-dot-8.svg"
echo Done.
