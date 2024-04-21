#!/usr/bin/env python3

import argparse
import re
import subprocess
import pathlib
import md2bril


def arg_parse() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Process md file to bril json.')
    parser.add_argument('file_path', type=str, help='The path to the file to process.')
    parser.add_argument(
        '--auto-write',
        '-w',
        action='store_true',
        default=False,
        help='Automatically write the JSON output to a file.'
    )
    args = parser.parse_args()
    return args


def to_json(bril: str) -> str:
    """ Convert bril code to JSON format using bril2json. """
    try:
        result = subprocess.run(['bril2json'], input=bril, capture_output=True, text=True)
        result.check_returncode()
        return result.stdout
    except subprocess.CalledProcessError as e:
        sys.exit(f"bril2json conversion failed: {e.stderr}")


def camel_to_kebab(camel_str: str) -> str:
    step1 = re.sub(r'(?<=[a-z])([A-Z])', r'-\1', camel_str)
    step2 = re.sub(r'(?<=[A-Z])([A-Z][a-z])', r'-\1', step1)
    kebab_str = step2.lower()
    return kebab_str


def convert(file_path: str, auto_write: bool) -> str | None:
    content = md2bril.convert(file_path)
    json_content = to_json(content)
    if auto_write:
        file_path = pathlib.Path(file_path)
        write_path = file_path.parent / 'code' / f'{camel_to_kebab(file_path.stem)}.json'
        with open(write_path, 'w') as file:
            file.write(json_content)
    else:
        return json_content


def main() -> None:
    # Check if exactly one argument (file path) is provided
    args = arg_parse()

    file_path = args.file_path
    auto_write = args.auto_write

    json = convert(file_path, auto_write=auto_write)
    if json:
        print(json, end="")


if __name__ == "__main__":
    main()
