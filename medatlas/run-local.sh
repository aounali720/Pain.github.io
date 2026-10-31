#!/bin/sh
cd "$(dirname "$0")" || exit 1
printf '\nMedAtlas is available at http://localhost:8000\nPress Ctrl+C to stop.\n'
python3 -m http.server 8000