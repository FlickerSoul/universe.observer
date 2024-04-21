#!/usr/bin/env bash

# This script takes one input uses md2bril and then uses bril2json to convert the bril output to json

if [ $# -ne 1 ]; then
    echo "Usage: $0 <file path>"
    exit 1
fi

file=$1
current_dir=$(dirname "$0")
md2bril="$current_dir/md2bril.sh"

# Convert markdown to bril
bril=$($md2bril "$file")

# Convert bril to json
echo "$bril" | bril2json
