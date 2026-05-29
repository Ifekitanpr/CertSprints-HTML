#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
ICON="$ROOT/icons"
download() { curl -fsSL "$1" -o "$2"; echo "OK $2"; }
# Intro 4498:66411
download "https://www.figma.com/api/mcp/asset/1b4cc3e7-999d-4b4f-88ed-6061ed4f37e7" "$ICON/flash-16.svg"
download "https://www.figma.com/api/mcp/asset/cb7455a7-32ee-4fd7-8cb3-4191eed36213" "$ICON/inbox-upload-40.svg"
download "https://www.figma.com/api/mcp/asset/2502ac92-5ea7-46b8-9d2f-ee217cf25d84" "$ICON/alarm-clock-40.svg"
# Scenario 4498:66653
download "https://www.figma.com/api/mcp/asset/c2a9e9b1-4776-4d28-9891-0872e34aeadb" "$ICON/diamond-16.svg"
download "https://www.figma.com/api/mcp/asset/b69bf202-2c15-489e-806a-74116191f5d2" "$ICON/clock-01-16.svg"
download "https://www.figma.com/api/mcp/asset/e15d1cf4-2ece-49f9-89ed-12fcc12be7d4" "$ICON/medal-06-16.svg"
# Feedback correct 4498:67322
download "https://www.figma.com/api/mcp/asset/e06bc700-57e6-459b-9245-e5017fe29ace" "$ICON/tick-01-20.svg"
download "https://www.figma.com/api/mcp/asset/f8c94ebc-8779-4686-a998-fc735f4537b2" "$ICON/thumbs-up-20.svg"
download "https://www.figma.com/api/mcp/asset/cb176b48-8e74-4ffc-9a69-652d679b66ad" "$ICON/ai-brain-03-20.svg"
# Feedback wrong 4501:67569
download "https://www.figma.com/api/mcp/asset/16771b02-a605-47a4-a815-fa755be63e3d" "$ICON/information-diamond-20.svg"
echo Done.
