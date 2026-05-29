#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
ICON="$ROOT/icons"
IMG="$ROOT/images"
mkdir -p "$ICON" "$IMG"
download() { curl -fsSL "$1" -o "$2"; echo "OK $2"; }

download "https://www.figma.com/api/mcp/asset/ea114bfd-c823-472b-a499-97285c02ff89" "$IMG/intro-illustration.png"
download "https://www.figma.com/api/mcp/asset/62458bad-31c9-4b65-80f9-cddad67c8bb2" "$ICON/list-view-20.svg"
download "https://www.figma.com/api/mcp/asset/59387fbd-3d13-4918-a65a-4d7bf311db25" "$ICON/clock-01-20.svg"
download "https://www.figma.com/api/mcp/asset/9c9bdb5f-a93c-4c09-ad91-4d55c1983bd6" "$ICON/quote-up-16.svg"
download "https://www.figma.com/api/mcp/asset/8514815c-67d6-4dd2-b0c6-9bff46707f4c" "$ICON/tick-02-green-16.svg"
download "https://www.figma.com/api/mcp/asset/ef7249f2-59a0-4ea7-ad38-145ffd3bd98a" "$ICON/tick-02-red-16.svg"
download "https://www.figma.com/api/mcp/asset/e3036573-294f-4a5c-aa37-b60bc3bb0ff9" "$ICON/arrow-right-green-24.svg"
download "https://www.figma.com/api/mcp/asset/069e8444-6898-440f-948a-56d548c5db53" "$ICON/arrow-right-red-24.svg"
download "https://www.figma.com/api/mcp/asset/8ae96493-1d4f-45ff-9864-898e7dd83c8b" "$ICON/help-circle-24.svg"
download "https://www.figma.com/api/mcp/asset/a083446b-b75a-46e8-a811-01e4cf7c07ae" "$ICON/feedback-ring-outer.svg"
download "https://www.figma.com/api/mcp/asset/e76ededf-f966-4e5a-bbfb-2ca42b6a538e" "$ICON/feedback-ring-inner.svg"
download "https://www.figma.com/api/mcp/asset/bdd84c3a-0603-4d3a-9842-f2ae06a6520d" "$ICON/tick-01-20.svg"
download "https://www.figma.com/api/mcp/asset/ac67ede0-9488-4ba8-99ca-4ce4c0c43146" "$ICON/information-diamond-20.svg"
download "https://www.figma.com/api/mcp/asset/0ad2f819-a4b9-45b2-b203-69b613990011" "$ICON/feedback-ring-outer-red.svg"
download "https://www.figma.com/api/mcp/asset/4bac7844-3523-45fb-ad3c-95086e54c9bc" "$ICON/feedback-ring-inner-red.svg"
echo Done.
