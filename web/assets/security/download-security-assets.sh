#!/usr/bin/env bash
# Figma file jQQNeG4neiYhWSninOO0Gt — Security screens 5755:*
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
ICON="$ROOT/icons"
IMG="$ROOT/images"

download() {
  local dest="$1" url="$2"
  curl -fsSL "$url" -o "$dest"
  echo "OK $dest"
}

# Icons (5755:74724 hub + sheets)
download "$ICON/password-24.svg"          "https://www.figma.com/api/mcp/asset/ccd1c093-701b-4bea-b218-7bacc50ec6b2"
download "$ICON/google-24.svg"              "https://www.figma.com/api/mcp/asset/d5fb1ae9-46b9-4d5d-9000-a2c768d098b7"
download "$ICON/linkedin-24.svg"           "https://www.figma.com/api/mcp/asset/ce72e2b2-5069-4981-9e46-bdceba023d00"
download "$ICON/email-24.svg"             "https://www.figma.com/api/mcp/asset/d4d01ef3-a571-4693-a4c5-f7517896e225"
download "$ICON/tfa-key-24.svg"           "https://www.figma.com/api/mcp/asset/4a084aa0-3706-4a30-b258-aa8f8ebf0e26"
download "$ICON/phone-24.svg"              "https://www.figma.com/api/mcp/asset/cb67e50e-a7a7-490a-85a1-0ab1337fabb1"
download "$ICON/laptop-24.svg"              "https://www.figma.com/api/mcp/asset/d247a6dd-76d3-4b33-9870-6b58007cd948"
download "$ICON/checkmark-circle-24.svg"    "https://www.figma.com/api/mcp/asset/c16fa34d-be06-4506-bf85-a9fad2519130"
download "$ICON/copy-01-16.svg"            "https://www.figma.com/api/mcp/asset/8f0b81ac-07d2-4878-8585-52146d2c9ad9"
download "$ICON/code-dash.svg"             "https://www.figma.com/api/mcp/asset/7f55243d-619b-4584-8be6-33c51efc6701"

# Images
download "$IMG/change-password-hero.png"    "https://www.figma.com/api/mcp/asset/234932ad-84f4-4c4a-a616-1b9ef6048c81"
download "$IMG/password-success.svg"        "https://www.figma.com/api/mcp/asset/1777e05f-2940-4cb1-b0b8-d61030d513ff"
download "$IMG/qr-code.svg"                 "https://www.figma.com/api/mcp/asset/dab29db2-248f-429a-a1e5-d34a9ab0dbc7"
download "$IMG/tfa-success.svg"             "https://www.figma.com/api/mcp/asset/1777e05f-2940-4cb1-b0b8-d61030d513ff"

echo "Done."
