#!/bin/bash
# Double-click to publish the portfolio: commits any new changes and pushes to GitHub.
cd "$(dirname "$0")" || exit 1
git add -A -- . ':!Claude outputs'
if ! git diff --cached --quiet; then
  git commit -m "Site update $(date '+%Y-%m-%d %H:%M')"
fi
if git push; then
  echo; echo "Published. cassandramay.com updates in a minute or two."
else
  echo; echo "Push failed. Copy the message above and send it to Claude."
fi
echo; read -n 1 -s -r -p "Press any key to close"
