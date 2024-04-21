#!/usr/bin/env bash

# This script takes a file path as input and outputs the file content without the first line and last two lines

if [ $# -ne 1 ]; then
    echo "Usage: $0 <file path>"
    exit 1
fi

file=$1
total_lines=$(wc -l < "$file")
start_line=2
end_line=$((total_lines - 1))

# Print the content without the first line and last two lines
sed -n "${start_line},${end_line}p" "$file"
