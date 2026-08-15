#!/usr/bin/env bash
set -euo pipefail
F='artifact_handoff_skill_v1.zip'
SHA='c3ca4345e55f28e8d131e423f483875626aa44fd736b68916285d00b2ebcd3bd'
URLS=(
  'https://cdn.jsdelivr.net/gh/jimmyyuzhiqiu/jimmyyuzhiqiu.github.io@20263d1d34971809075a6ab843eaead811df91d7/tmp/artifact-handoff-skill-v1-20260815-c3ca4345/artifact_handoff_skill_v1.zip'
  'https://raw.githubusercontent.com/jimmyyuzhiqiu/jimmyyuzhiqiu.github.io/20263d1d34971809075a6ab843eaead811df91d7/tmp/artifact-handoff-skill-v1-20260815-c3ca4345/artifact_handoff_skill_v1.zip'
)
for u in "${URLS[@]}"; do
  echo "trying $u" >&2
  rm -f "$F"
  if command -v curl >/dev/null 2>&1; then
    curl -fL --connect-timeout 15 --retry 2 "$u" -o "$F" || continue
  elif command -v wget >/dev/null 2>&1; then
    wget --timeout=15 --tries=2 -O "$F" "$u" || continue
  else
    echo 'curl/wget not found' >&2; exit 2
  fi
  A=$(sha256sum "$F" | awk '{print $1}')
  if [ "$A" = "$SHA" ]; then
    unzip -oq "$F"
    echo "OK: $F SHA256=$A"
    echo 'Read artifact_handoff_skill_v1/SKILL.md first.'
    exit 0
  fi
  echo "SHA mismatch: expected=$SHA actual=$A" >&2
done
exit 4
