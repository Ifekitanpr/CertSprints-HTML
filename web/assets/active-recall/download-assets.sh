#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
ICON="$ROOT/icons"
IMG="$ROOT/images"
mkdir -p "$ICON" "$IMG"
download() { curl -fsSL "$1" -o "$2"; echo "OK $2"; }

download "https://www.figma.com/api/mcp/asset/403ac7a4-d614-4e78-a12e-4fd307371184" "$IMG/intro-illustration.png"
download "https://www.figma.com/api/mcp/asset/bb5992a7-a626-4262-ae92-a937674f44e7" "$IMG/ai-orb-core.png"
download "https://www.figma.com/api/mcp/asset/66117578-3fec-43e7-b9c0-8d16edb73f08" "$IMG/ai-orb-halo.svg"
download "https://www.figma.com/api/mcp/asset/802e5331-bcd8-4aa3-8d6a-b0e44499b9cf" "$ICON/mic-02-16.svg"
download "https://www.figma.com/api/mcp/asset/c06373c2-066f-4695-b079-2f9d3270e763" "$ICON/clock-01-16.svg"
download "https://www.figma.com/api/mcp/asset/3087006c-0a6c-4a01-99b8-b8e3b4d44164" "$ICON/voice-20.svg"
download "https://www.figma.com/api/mcp/asset/dad44940-5061-481c-854c-e9fdb769581d" "$ICON/message-01-20.svg"
download "https://www.figma.com/api/mcp/asset/f1cfc889-e6fd-466d-9fef-ae5cb7756c2e" "$ICON/message-01-gradient-20.svg"
download "https://www.figma.com/api/mcp/asset/0bfba04e-b210-4cb0-9efc-4d333213f1e6" "$ICON/help-circle-24.svg"
download "https://www.figma.com/api/mcp/asset/e0496a97-496b-47c4-9c0a-cb6607078df3" "$ICON/avatar-mentor.svg"
download "https://www.figma.com/api/mcp/asset/cbc44477-6476-43f5-8c0e-0db1357e7536" "$ICON/avatar-user.svg"
download "https://www.figma.com/api/mcp/asset/68a7074d-1a5c-40cb-8d5e-2aca7388727f" "$ICON/sent-20.svg"
download "https://www.figma.com/api/mcp/asset/a083446b-b75a-46e8-a811-01e4cf7c07ae" "$ICON/feedback-ring-outer.svg"
download "https://www.figma.com/api/mcp/asset/e76ededf-f966-4e5a-bbfb-2ca42b6a538e" "$ICON/feedback-ring-inner.svg"
download "https://www.figma.com/api/mcp/asset/bdd84c3a-0603-4d3a-9842-f2ae06a6520d" "$ICON/tick-01-20.svg"
download "https://www.figma.com/api/mcp/asset/d216ad9b-98cc-48b9-98cd-5da7ee2237a2" "$ICON/mic-02-24.svg"
download "https://www.figma.com/api/mcp/asset/7f1aec22-dbd7-4ba6-add8-9d8b064f9cf7" "$ICON/call-end-02-24.svg"
download "https://www.figma.com/api/mcp/asset/22b980c6-3ff8-4536-95e8-4789c1e77b20" "$ICON/volume-high-24.svg"
# mic-off / volume-off: derived from community + mindset-sprint slash (not separate Figma exports)
echo Done.
