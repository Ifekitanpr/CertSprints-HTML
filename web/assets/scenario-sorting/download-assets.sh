#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
ICON="$ROOT/icons"
IMG="$ROOT/images"
download() { curl -fsSL "$1" -o "$2"; echo "OK $2"; }

download "https://www.figma.com/api/mcp/asset/9138f587-d1ae-4e1f-b4fa-86c2aec5bb86" "$IMG/intro-illustration.png"
download "https://www.figma.com/api/mcp/asset/f2d72581-d2f5-48a7-80dd-f364e1376961" "$ICON/smart-phone-01-16.svg"
download "https://www.figma.com/api/mcp/asset/deefc70b-92a2-41dd-9b78-5b1a789cca16" "$ICON/drag-left-03-20.svg"
download "https://www.figma.com/api/mcp/asset/8b9fd679-7bed-45ad-b9e4-ed80d3206510" "$ICON/task-done-02-20.svg"
download "https://www.figma.com/api/mcp/asset/4f362a03-ece3-4138-9ccc-bd91c3dfa6c9" "$ICON/horizontal-drag-drop-24.svg"
download "https://www.figma.com/api/mcp/asset/68395580-3514-4d81-ab24-32cd916ab86a" "$ICON/list-view-16.svg"
download "https://www.figma.com/api/mcp/asset/04faf812-f9ac-4c06-b9e3-184eed0c3053" "$ICON/chart-relationship-16.svg"
download "https://www.figma.com/api/mcp/asset/b40dac08-b70f-41f1-a8f9-a97233e2b357" "$ICON/tv-01-16.svg"
download "https://www.figma.com/api/mcp/asset/f24c7d2b-f2e8-47de-b34b-780887a8b699" "$ICON/arrow-down-double-blue-20.svg"
download "https://www.figma.com/api/mcp/asset/c9c69123-af1a-4a19-86c9-72314c2b005b" "$ICON/arrow-down-double-orange-20.svg"
download "https://www.figma.com/api/mcp/asset/b4b21670-9860-4f31-927d-de31af9b8fd0" "$ICON/arrow-down-double-teal-20.svg"
download "https://www.figma.com/api/mcp/asset/7912d712-7082-4d23-885a-6f28fc82a8cc" "$ICON/deck-curve.svg"
download "https://www.figma.com/api/mcp/asset/49c206b6-49d7-4546-a56b-ac3bffd7c410" "$ICON/drag-hint-curve.svg"
download "https://www.figma.com/api/mcp/asset/c9c69123-af1a-4a19-86c9-72314c2b005b" "$ICON/reload-20.svg"
download "https://www.figma.com/api/mcp/asset/1e4fe7c3-537a-4d00-87dc-361c73ac0ea1" "$ICON/tick-double-01-20.svg"
download "https://www.figma.com/api/mcp/asset/e189b66b-0958-485a-8fb3-c3b7dea58fbe" "$ICON/information-circle-20.svg"
download "https://www.figma.com/api/mcp/asset/5de4f84a-527c-484a-ac69-5d8902d2976e" "$ICON/checkmark-circle-02-16.svg"
download "https://www.figma.com/api/mcp/asset/362d9c46-1cf2-481f-a433-f2b4bd355bba" "$ICON/tick-02-17.svg"
download "https://www.figma.com/api/mcp/asset/c9570872-efde-4bb4-bf07-8d31128c448d" "$ICON/help-circle-24.svg"
echo Done.
