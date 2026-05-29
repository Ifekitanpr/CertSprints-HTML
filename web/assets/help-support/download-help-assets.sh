#!/usr/bin/env bash
# Figma file jQQNeG4neiYhWSninOO0Gt — Help & Support 5755:75611
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
ICON="$ROOT/icons"
IMG="$ROOT/images"

download() {
  local dest="$1" url="$2"
  curl -fsSL "$url" -o "$dest"
  echo "OK $dest"
}

download "$ICON/chatting-01-14.svg"   "https://www.figma.com/api/mcp/asset/cbf85126-cbbc-477e-88d2-829409ad534e"
download "$ICON/list-view-14.svg"     "https://www.figma.com/api/mcp/asset/509d6885-2c3c-4a4e-847a-b69b9d612ce8"
download "$ICON/play-18.svg"          "https://www.figma.com/api/mcp/asset/a9b26114-6bc7-431a-8cd2-4fe676afa2c4"
download "$ICON/search-18.svg"        "https://www.figma.com/api/mcp/asset/7f9eaefb-cb8d-453c-b1ca-111626f2de0e"
download "$ICON/plus-sign-24.svg"     "https://www.figma.com/api/mcp/asset/9402ddce-9492-46ce-a4f5-3a75b38361d4"
download "$ICON/minus-sign-24.svg"    "https://www.figma.com/api/mcp/asset/c85f74a4-9e92-4bef-a61b-33d5149f8490"
download "$ICON/instagram-24.svg"    "https://www.figma.com/api/mcp/asset/46c7e6a3-84e6-44d3-bbcc-44330c0c2137"
download "$ICON/linkedin-24.svg"      "https://www.figma.com/api/mcp/asset/4baf08c6-f727-4681-8726-b21ea5a826c3"
download "$ICON/social-x-24.svg"      "https://www.figma.com/api/mcp/asset/ff55e1bc-2688-4fd6-b112-7fa68344bbf9"
download "$IMG/tutorial-preview.png"  "https://www.figma.com/api/mcp/asset/7e2710f8-e4a7-4971-b888-3539bdd697d0"
download "$IMG/tutorial-ui.svg"         "https://www.figma.com/api/mcp/asset/261edce2-8126-4f9d-ade3-a019f03852b1"

echo "Done."
