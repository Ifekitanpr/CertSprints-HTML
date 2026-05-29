#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
ICON="$ROOT/icons"
download() { curl -fsSL "$1" -o "$2"; echo "OK $2"; }

download "https://www.figma.com/api/mcp/asset/6edc9435-b056-47fa-8508-54c4e9b581be" "$ICON/clock-01-16.svg"
download "https://www.figma.com/api/mcp/asset/c2b3de44-b48b-42e1-bfe9-b2f5c7f96d9e" "$ICON/tick-02-20.svg"
download "https://www.figma.com/api/mcp/asset/f1af4f29-f834-43af-9e15-958191726241" "$ICON/cancel-01-20.svg"
download "https://www.figma.com/api/mcp/asset/ee44c520-742b-4a02-947c-2b97e3b73cd7" "$ICON/sparkles-20.svg"
download "https://www.figma.com/api/mcp/asset/bfbc8f09-ff32-4c91-ab87-7b4ae97a75c9" "$ICON/help-circle-24.svg"
download "https://www.figma.com/api/mcp/asset/632dac53-40a6-48c3-971b-c774577b7ced" "$ICON/tick-01-20.svg"
download "https://www.figma.com/api/mcp/asset/783c2738-b006-4364-a9f2-a83fee90cfc7" "$ICON/feedback-ring-outer.svg"
download "https://www.figma.com/api/mcp/asset/d11191c4-31e3-4c9c-a26f-35ef5bde3e3b" "$ICON/feedback-ring-inner.svg"
download "https://www.figma.com/api/mcp/asset/5b3d4ea5-77a8-4d35-8f12-771afd142359" "$ICON/information-diamond-20.svg"
download "https://www.figma.com/api/mcp/asset/237538b6-6af7-42f4-81d6-2bf587ab8072" "$ICON/feedback-ring-outer-red.svg"
download "https://www.figma.com/api/mcp/asset/a618565f-f4eb-4146-9276-887f8a70f6e2" "$ICON/feedback-ring-inner-red.svg"
echo Done.
