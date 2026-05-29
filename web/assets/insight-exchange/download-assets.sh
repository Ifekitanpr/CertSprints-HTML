#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
ICON="$ROOT/icons"
IMG="$ROOT/images"
download() { curl -fsSL "$1" -o "$2"; echo "OK $2"; }
download "https://www.figma.com/api/mcp/asset/951ba8d8-062b-4dc6-82b7-379f89ddaad7" "$ICON/chatting-01-16.svg"
download "https://www.figma.com/api/mcp/asset/abae6f89-967a-4f3b-94a3-0dc0a6de49f9" "$IMG/avatar-sprinter-1.png"
download "https://www.figma.com/api/mcp/asset/578613ae-8214-49a9-935a-4ccbcd53889b" "$IMG/avatar-ch-badge.svg"
download "https://www.figma.com/api/mcp/asset/53849a9b-607d-4a09-8e0f-a62a00ce4901" "$IMG/avatar-mark-k.png"
download "https://www.figma.com/api/mcp/asset/cff38c15-83ba-46c3-b7a5-4c8253730612" "$ICON/checkmark-circle-03-20.svg"
echo Done.
