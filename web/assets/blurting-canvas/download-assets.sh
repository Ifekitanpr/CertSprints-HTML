#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
ICON="$ROOT/icons"
mkdir -p "$ICON"
download() { curl -fsSL "$1" -o "$2"; echo "OK $2"; }

download "https://www.figma.com/api/mcp/asset/f6756b23-bfd3-4a71-b195-63fd4fae6a5f" "$ICON/arrow-left-24.svg"
download "https://www.figma.com/api/mcp/asset/ca1b2e84-11ef-4e43-b5ec-2c9fae1b001a" "$ICON/help-circle-24.svg"
download "https://www.figma.com/api/mcp/asset/8e72c8d3-114b-4f49-bb11-2cfaf41c3d39" "$ICON/waterfall-down-03-16.svg"
download "https://www.figma.com/api/mcp/asset/2573f332-bbc4-4f70-b835-396c40232e75" "$ICON/tick-02-20.svg"
download "https://www.figma.com/api/mcp/asset/f02df85d-9327-4f07-b10c-57ae6514ec71" "$ICON/feedback-ring-outer.svg"
download "https://www.figma.com/api/mcp/asset/b45880b7-3e3b-48ec-bc0b-e47a36afdac1" "$ICON/feedback-ring-inner.svg"
download "https://www.figma.com/api/mcp/asset/fc84aada-0f43-47b8-8551-ff52d016cdfd" "$ICON/tick-01-20-white.svg"
download "https://www.figma.com/api/mcp/asset/27134489-63c3-4227-96ac-2bc77c3745a0" "$ICON/checkbox-checked-20.svg"
download "https://www.figma.com/api/mcp/asset/f72cceb1-44ce-48db-b25a-9f09cdcb93e3" "$ICON/thumbs-up-20.svg"
download "https://www.figma.com/api/mcp/asset/a1686a25-e260-4f8d-b51e-56afb0e230fc" "$ICON/ai-brain-03-20.svg"
echo Done.
