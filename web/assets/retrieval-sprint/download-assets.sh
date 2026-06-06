#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
ICON="$ROOT/icons"
mkdir -p "$ICON"
download() { curl -fsSL "$1" -o "$2"; echo "OK $2"; }

# Intro screen icons
download "https://www.figma.com/api/mcp/asset/5a24e73c-2452-486c-8dd4-35ed55451e2d" "$ICON/flash-16.svg"
download "https://www.figma.com/api/mcp/asset/1013dcf6-ee2c-47b6-a00b-deed158bae3e" "$ICON/clock-01-16.svg"
download "https://www.figma.com/api/mcp/asset/5eb79f32-5e65-4973-b76e-2c9442883661" "$ICON/arrow-right-20.svg"
download "https://www.figma.com/api/mcp/asset/1b98e1ff-fed8-4e66-ab26-cafae555e701" "$ICON/flashcard-illustration.png"

# Flashcard question icons
download "https://www.figma.com/api/mcp/asset/9f4f80ae-ffa7-47cf-9051-dfebeccded7e" "$ICON/reload-16.svg"
download "https://www.figma.com/api/mcp/asset/b8d207dc-44dd-401d-90bb-577f6a9c96e2" "$ICON/bulb-charging-16.svg"
download "https://www.figma.com/api/mcp/asset/8666e791-95a2-453e-913a-6a09b6797a4d" "$ICON/touchpad-02-16.svg"
download "https://www.figma.com/api/mcp/asset/1d03a93e-6e94-403f-9fa9-bcc4e5d8844d" "$ICON/divider.svg"
download "https://www.figma.com/api/mcp/asset/59847f70-da0b-42de-9b61-bbe381bd779e" "$ICON/sparkles-16.svg"
download "https://www.figma.com/api/mcp/asset/5c5ce21e-c04b-4092-9be4-06eae4be6e9a" "$ICON/arrow-right-20-disabled.svg"

# Flashcard answer icons
download "https://www.figma.com/api/mcp/asset/8911c6d7-6a3a-42c6-adf2-6f91c2036760" "$ICON/checkmark-circle-03-16.svg"
download "https://www.figma.com/api/mcp/asset/e1eed413-50a0-4f26-811b-b5be71336684" "$ICON/arrow-right-20-active.svg"

# Result screen icons
download "https://www.figma.com/api/mcp/asset/ec9a094a-b236-4adf-9078-c2c107f06462" "$ICON/gauge-outer.png"
download "https://www.figma.com/api/mcp/asset/cc45c85b-db61-4494-ad73-a0f9024faedf" "$ICON/gauge-progress.png"
download "https://www.figma.com/api/mcp/asset/846e4ff3-b8ca-4274-bfe5-8e7091f962d3" "$ICON/arrow-up-right-16.svg"
download "https://www.figma.com/api/mcp/asset/7d37f58b-629c-4958-a240-2f88312427ef" "$ICON/target-02-16.svg"
download "https://www.figma.com/api/mcp/asset/17438163-4192-4002-99df-c6938ba78866" "$ICON/cards-01-16.svg"
download "https://www.figma.com/api/mcp/asset/e1b30f91-01dd-4308-8c08-c1cafec273c9" "$ICON/flash-intensity-16.svg"
download "https://www.figma.com/api/mcp/asset/f81a0cf6-1ce7-411d-94e7-7ead7a8453fe" "$ICON/arrow-right-20-result.svg"

echo Done.
