#!/usr/bin/env bash
# Figma MCP asset downloads for narrative-quest
# Base URL: https://www.figma.com/api/mcp/asset/{uuid}
set -euo pipefail

BASE="https://www.figma.com/api/mcp/asset"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IC="$SCRIPT_DIR/icons"

download() {
  local uuid="$1"
  local out="$2"
  curl -fsSL "${BASE}/${uuid}" -o "$out"
}

# Parent narrative-quest folder
# Figma node 5480:94278 Layer_x0020_1 (chevron pattern over #e86130)
download c8cc0b2b-2a97-48df-a17d-f16a77eb4270 "$SCRIPT_DIR/bg-pattern.svg"
download 7f53c6fa-7854-4e78-a1a0-6b6b77e074d2 "$SCRIPT_DIR/intro-art.png"
download a3aa3117-fec6-4ba2-9566-4361c934930b "$SCRIPT_DIR/trophy-success.png"
download af07fe62-9230-4b8d-9234-54d0a065a48e "$SCRIPT_DIR/trophy-recalibration.png"

mkdir -p "$IC"

# icons/
download 846be1b7-ee1d-458d-ac68-cfc2dafa9333 "$IC/arrow-left-24.svg"
download 15d8c64a-2f7a-40a0-974c-df896b7a796c "$IC/volume-high-24.svg"
# No separate MCP UUID; copy volume-high as placeholder for volume-off
download 15d8c64a-2f7a-40a0-974c-df896b7a796c "$IC/volume-off-24.svg"
download c3e8518f-d2f8-4351-82b3-46b2dc80a270 "$IC/bulb-20.svg"
download 3e060046-26ff-45f2-a49f-6a5e942c70b5 "$IC/startup-02-20.svg"
download 267fbdb2-4fcf-46cd-b905-a74d120d2078 "$IC/book-open-16.svg"
download e980b871-961a-475c-9e3c-395f47517716 "$IC/touch-01-16.svg"
download e165cc0e-40c4-417a-9373-484630723194 "$IC/multiplication-sign-16.svg"
download 0c1ede1c-f06f-4524-af98-21d2ef19f104 "$IC/tick-02-16.svg"
download c6e7bc7e-1643-432e-a7d4-8aa16b589c8d "$IC/checkmark-circle-03-16.svg"
download 631f96fe-9f13-4223-bbc2-6e1a8f51fb3d "$IC/timer-02-16.svg"
download 44ae56df-286f-459d-b01b-3f7c8cfc25c4 "$IC/play-circle-20.svg"
download a2e245a4-4111-45a5-b0b5-d1c3cd73c2e4 "$IC/progress-dot-8.svg"
download 3de0e491-3ea5-4277-abaf-b6cc02b5e65c "$IC/timer-02-32.svg"
download eca85ba6-0b86-4373-90a1-7a5b68971f1d "$IC/confetti-tr.svg"
download 9bb5a1e2-8eea-404e-afb5-354689a0ffb9 "$IC/confetti-tl.svg"
download 9b755fd8-c6eb-4938-9c1f-f91ce7fa1a76 "$IC/confetti-polygon-blue.svg"
download 1df671d7-72eb-4990-998c-a78adc2838d2 "$IC/confetti-polygon-yellow.svg"
download 745153e8-e4f2-45da-b68d-a2c86f2737b7 "$IC/touchpad-16.svg"
download 3a694adf-57c4-4637-bafa-9be87e99730e "$IC/database-blue-12.svg"
download 4e077770-7345-4ea2-916d-e848f92312d9 "$IC/database-green-12.svg"
download 6072b007-fb26-480b-a712-e32b39662dad "$IC/file-purple-12.svg"
download a9161e2d-3ee5-4c71-adc1-03db2c6af1f0 "$IC/court-law-12.svg"
download ee5f6528-efe3-4da7-8155-37be22dfa6a1 "$IC/alert-01-16.svg"
download d2552c48-268b-45a8-b2f9-cc25c94ffce9 "$IC/checkmark-badge-16.svg"
download 81a4f1a2-e98b-420f-bb0e-6a1b7d0bf570 "$IC/target-02-24.svg"
download e0501e32-f520-4177-ad6a-c25f24f8b4fb "$IC/alert-01-24.svg"
download 377a0971-0b30-44d1-9c08-7a27fa2a00e2 "$IC/startup-01-24.svg"
download 475b2c05-b812-489b-a3fa-585040a9da74 "$IC/game-controller-20.svg"

echo "Done. Assets written under $SCRIPT_DIR and $IC"
