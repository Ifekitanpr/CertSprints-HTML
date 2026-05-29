#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$ROOT/covers"

download() {
  local out="$1" url="$2"
  curl -fsSL -o "$out" "$url"
  echo "OK $out ($(wc -c < "$out") bytes)"
}

download "$ROOT/covers/cover-fundamentals.png" "https://www.figma.com/api/mcp/asset/787b5adf-4b9d-4c41-b306-8b01fadbe79e"
download "$ROOT/covers/cover-body-of-knowledge.png" "https://www.figma.com/api/mcp/asset/b850a290-a4d3-4e04-80c9-e3c4bf83aa5e"
download "$ROOT/covers/cover-eco.png" "https://www.figma.com/api/mcp/asset/5c224583-bbf4-430f-aa9f-3f9e91abfa0e"
download "$ROOT/covers/cover-templates.png" "https://www.figma.com/api/mcp/asset/6e747ed1-7663-4ad5-8ed4-e5a0d30d61e5"
download "$ROOT/covers/cover-glossary.png" "https://www.figma.com/api/mcp/asset/86197d66-a881-4076-82ff-519aae80e0f5"
download "$ROOT/covers/cover-study-notes.png" "https://www.figma.com/api/mcp/asset/0569ca51-d0ca-44dc-9e3b-4f56566f11a3"
download "$ROOT/fundamentals-hero.jpg" "https://www.figma.com/api/mcp/asset/6226b663-92f0-4dfe-a9fd-9ae8d30878ed"
download "$ROOT/eco-content.jpg" "https://www.figma.com/api/mcp/asset/1bc64072-5aca-4701-ba28-fee04245f4d3"
download "$ROOT/glossary-card-pattern.png" "https://www.figma.com/api/mcp/asset/481160e3-6acb-413c-ba2f-9240bd329967"

ls -la "$ROOT/covers" "$ROOT"/*.jpg "$ROOT"/*.png 2>/dev/null || true
