#!/usr/bin/env bash
set -euo pipefail
command -v plantuml

set -x
rm -f ./*.svg ./*.png
for i in *.dot; do
  #plantuml -Tpng "$i";
  plantuml -Tsvg "$i";
done
