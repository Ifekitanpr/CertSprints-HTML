#!/usr/bin/env bash
# Figma file jQQNeG4neiYhWSninOO0Gt — Profile screens 5755:72424, 5755:72520
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
ICON="$ROOT/icons"
IMG="$ROOT/images"

download() {
  local dest="$1" url="$2"
  curl -fsSL "$url" -o "$dest"
  echo "OK $dest"
}

download "$ICON/edit-02-16.svg"     "https://www.figma.com/api/mcp/asset/c0fbd6a1-35eb-4821-97e1-b8df1e0e112e"
download "$ICON/camera-02-14.svg"    "https://www.figma.com/api/mcp/asset/83bb0035-4b35-41e0-9bb6-e4d715db94ec"
download "$ICON/arrow-down-18.svg"  "https://www.figma.com/api/mcp/asset/3785a155-5c6d-43fc-9dfb-288fe323cdc2"
download "$IMG/user-avatar.jpg"       "https://www.figma.com/api/mcp/asset/147dc787-3f3b-4fce-b784-3c0771475120"

# Dashboard header avatar (reuse profile photo)
cp "$IMG/user-avatar.jpg" "$(cd "$ROOT/../dashboard/home" && pwd)/avatar.png" 2>/dev/null || \
  cp "$IMG/user-avatar.jpg" "$ROOT/../dashboard/home/avatar.png"

echo "Done."
