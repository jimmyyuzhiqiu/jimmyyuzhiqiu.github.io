#!/usr/bin/env bash
set -euo pipefail

OUT="${1:-Kadele_EvoMind_V3_SELF_CONTAINED_20260815.md}"
SHA256="7c142970ac81660a90800003b6f090503be76436f9e89bdb12bab28b27dfd441"

URLS=(
  "https://cdn.jsdelivr.net/gh/jimmyyuzhiqiu/jimmyyuzhiqiu.github.io@main/tmp/kadele-v3-20260815-7c142970/Kadele_EvoMind_V3_SELF_CONTAINED_20260815.md"
  "https://jimmyyuzhiqiu.github.io/tmp/kadele-v3-20260815-7c142970/Kadele_EvoMind_V3_SELF_CONTAINED_20260815.md"
  "https://raw.githubusercontent.com/jimmyyuzhiqiu/jimmyyuzhiqiu.github.io/main/tmp/kadele-v3-20260815-7c142970/Kadele_EvoMind_V3_SELF_CONTAINED_20260815.md"
)

ok=0
for u in "${URLS[@]}"; do
  echo "[download] trying: $u" >&2
  if command -v curl >/dev/null 2>&1; then
    if curl -fL --connect-timeout 12 --retry 2 --retry-delay 1 "$u" -o "$OUT"; then ok=1; break; fi
  elif command -v wget >/dev/null 2>&1; then
    if wget --timeout=12 --tries=2 -O "$OUT" "$u"; then ok=1; break; fi
  else
    echo "curl/wget not found" >&2; exit 2
  fi
done

if [ "$ok" -ne 1 ]; then
  echo "All download routes failed. Network may block GitHub/jsDelivr." >&2
  exit 3
fi

ACTUAL="$(sha256sum "$OUT" | awk '{print $1}')"
if [ "$ACTUAL" != "$SHA256" ]; then
  echo "SHA256 mismatch: $ACTUAL" >&2
  rm -f "$OUT"
  exit 4
fi

echo "OK: $OUT"
echo "SHA256: $ACTUAL"
echo
printf '%s\n' \
  'NEXT:' \
  '1) Read the entire Markdown file.' \
  '2) Follow the embedded 00_MASTER_PROMPT_小龙虾总提示词_V3.md.' \
  '3) Recreate embedded files marked BEGIN FILE / END FILE as needed.' \
  '4) Produce the teacher execution manual, student materials, cards, EvoMind prompts, PPT and Remotion deliverables, then run QA.'
