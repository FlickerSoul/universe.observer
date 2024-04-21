#!/usr/bin/env python3

import sys
import argparse

__all__ = ['convert']


def arg_parse() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Process md file to bril code.')
    parser.add_argument('file_path', type=str, help='The path to the file to process.')
    args = parser.parse_args()
    return args


def convert(file_path: str) -> str:
    try:
        with open(file_path, 'r') as file:
            lines = file.readlines()
    except Exception as e:
        print(f"Error reading file: {e}")
        sys.exit(1)

    # Determine the number of lines to print
    if len(lines) > 2:
        # Exclude the first line and the last two lines
        contents = lines[1:-1]
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
