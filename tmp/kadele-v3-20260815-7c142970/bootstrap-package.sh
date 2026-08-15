#!/usr/bin/env bash
set -euo pipefail

ZIP="${1:-Kadele_EvoMind_V3_EXEC_PACKAGE_20260815.zip}"
SHA256="846ccc8081eddacc391c2a70712cd46831e9232bf10532426a683b01ff674ed6"
URLS=(
  "https://cdn.jsdelivr.net/gh/jimmyyuzhiqiu/jimmyyuzhiqiu.github.io@main/tmp/kadele-v3-20260815-7c142970/Kadele_EvoMind_V3_EXEC_PACKAGE_20260815.zip"
  "https://jimmyyuzhiqiu.github.io/tmp/kadele-v3-20260815-7c142970/Kadele_EvoMind_V3_EXEC_PACKAGE_20260815.zip"
  "https://raw.githubusercontent.com/jimmyyuzhiqiu/jimmyyuzhiqiu.github.io/main/tmp/kadele-v3-20260815-7c142970/Kadele_EvoMind_V3_EXEC_PACKAGE_20260815.zip"
)

ok=0
for u in "${URLS[@]}"; do
  echo "[download] trying: $u" >&2
  if command -v curl >/dev/null 2>&1; then
    if curl -fL --connect-timeout 12 --retry 2 --retry-delay 1 "$u" -o "$ZIP"; then ok=1; break; fi
  elif command -v wget >/dev/null 2>&1; then
    if wget --timeout=12 --tries=2 -O "$ZIP" "$u"; then ok=1; break; fi
  else
    echo "curl/wget not found" >&2; exit 2
  fi
done

if [ "$ok" -ne 1 ]; then
  echo "All download routes failed." >&2
  exit 3
fi

ACTUAL="$(sha256sum "$ZIP" | awk '{print $1}')"
if [ "$ACTUAL" != "$SHA256" ]; then
  echo "SHA256 mismatch: $ACTUAL" >&2
  rm -f "$ZIP"
  exit 4
fi

echo "OK: $ZIP"
echo "SHA256: $ACTUAL"

if command -v unzip >/dev/null 2>&1; then
  unzip -q -o "$ZIP"
  echo "Extracted. Read 00_MASTER_PROMPT_小龙虾总提示词_V3.md first, then execute the package requirements."
else
  echo "unzip not found; install/use another ZIP extractor, then read the master prompt."
fi
