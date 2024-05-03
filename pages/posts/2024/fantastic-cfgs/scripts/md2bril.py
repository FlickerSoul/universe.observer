#!/usr/bin/env python3

import sys
import argparse

__all__ = ['convert']


def arg_parse() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Process md file to bril code.')
    parser.add_argument('file_path', type=str, help='The path to the file to process.')
    args = parser.parse_args()
    return args


def find_tilda(lines: list[str], start: int = 0) -> int:
    for i in range(start, len(lines)):
        if '```' in lines[i].strip():
            return i
    return -1


def convert(file_path: str) -> str:
    try:
        with open(file_path, 'r') as file:
            lines = file.readlines()
    except Exception as e:
        print(f"Error reading file: {e}")
        sys.exit(1)

    # Determine the number of lines to print

    start = find_tilda(lines)
    if start == -1:
        print("No code block found")
        sys.exit(1)

    end = find_tilda(lines, start + 1)
    if end == -1:
        print("No closing code block found")
        sys.exit(1)

    if end - start > 1:
        # Exclude the first line and the last two lines
        contents = lines[start + 1:end]
    else:
        # If there are 3 or fewer lines, nothing will be printed
        contents = []

    return ''.join(contents)

def main():
    # Check if exactly one argument (file path) is provided
    args = arg_parse()

    file_path = args.file_path

    result = convert(file_path)

    print(result, end="")

if __name__ == "__main__":
    main()
