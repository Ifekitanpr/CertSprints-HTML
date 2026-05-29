#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
ICON="$ROOT/icons"
IMG="$ROOT/images"
AV="$ROOT/avatars"
BASE="https://www.figma.com/api/mcp/asset"

download() {
  local out="$1"
  local id="$2"
  mkdir -p "$(dirname "$out")"
  curl -fsSL "$BASE/$id" -o "$out"
}

# Icons
download "$ICON/ai-search-20.svg"           "589f1bcd-4df7-4a86-a33f-d63e2b913764"
download "$ICON/award-02-24.svg"            "b650bd19-2714-4b57-8d2d-ef101c0a93b9"
download "$ICON/award-04-24.svg"            "b9ded057-3386-45ae-a9e0-048bea043a36"
download "$ICON/fire-18.svg"                "03873c19-0632-427d-a98b-b96565c34c9b"
download "$ICON/motion-02-18.svg"           "294591e5-421c-4bff-ab0f-dd7729f8dbce"
download "$ICON/dashboard-speed-02-18.svg"    "85a68c3d-90eb-45a5-adf9-2a3801e4aa6c"
download "$ICON/comment-01-24.svg"           "029706bd-4dae-49cb-bc6a-87e7faf1e38b"
download "$ICON/comment-01-12.svg"           "459d29af-5480-4bf2-bfeb-340cd449b5d8"
download "$ICON/partner-link-24.svg"         "755873f1-f75c-4868-b4b9-843c337600c4"
download "$ICON/ai-fill-20.svg"              "aafe3caa-8105-4537-96bb-9e2073653639"
download "$ICON/ai-spinner-ring.svg"         "b71eb2fd-874f-4246-a177-43d45da27dc1"
download "$ICON/add-reaction-round-20.svg"   "b1cc556c-d234-46e4-b0d8-5ed43c6e10c7"

# Images
download "$IMG/medal-gold.png"               "1b8247ee-6df0-4008-ac80-53c779500104"
download "$IMG/medal-silver.png"             "13108b22-4975-42e0-a0f9-80b78c2cfb56"
download "$IMG/award-risk-guru.svg"          "adfa5bc6-d597-4e75-b55d-ab875e16eab7"
download "$IMG/award-domain-master.svg"      "12e37930-e9f1-47f4-a77e-b89bde60ba32"

# Avatars
download "$AV/partners-empty-you.jpg"        "2229ddd5-0dc5-41c6-a97f-99c6bc3da229"
download "$AV/partners-empty-partner.jpg"    "5a52ab85-51a2-46da-9d98-9b1473110b0f"
download "$AV/patrick.jpg"                   "750d9b7b-d2cc-45aa-af68-52f159bddec2"
download "$AV/match-you.jpg"                   "c31ba928-f614-4c7e-ae9b-0142a19dbdd2"
download "$AV/match-partner.jpg"             "539172c4-3a31-4021-b578-b5c7075c456f"

echo "Partners assets downloaded to $ROOT"
