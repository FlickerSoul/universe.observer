#!/usr/bin/env deno run --allow-read --allow-write

import { parseArgs } from 'https://deno.land/std/cli/mod.ts'
import { ensureDir } from 'https://deno.land/std/fs/mod.ts'
import { basename, extname, join, resolve } from 'https://deno.land/std/path/mod.ts'
import { loadBril } from './tools.ts'
import { eliminateDeadAssignment } from './dce.ts'
import { brilProgramToText } from './bril-txt'

function getFilenameWithoutExtension(path: string) {
  const filename = basename(path) // Get the full filename with extension
  const extension = extname(path) // Get the extension
  return filename.substring(0, filename.length - extension.length) // Remove the extension
}

async function processJsonFile(progJsonFilePath: string, passOutputFolder: string) {
  progJsonFilePath = resolve(progJsonFilePath)
  passOutputFolder = resolve(passOutputFolder)

  try {
    // Read JSON file
    const baseName = getFilenameWithoutExtension(progJsonFilePath)

    const jsonText = await Deno.readTextFile(progJsonFilePath)
    const prog = loadBril(jsonText)

    await ensureDir(passOutputFolder)

    const result = eliminateDeadAssignment(prog)
    for (let i = 0; i < result.passes.length; i++) {
      const currentPass = result.passes[i]
      const outputPath = join(passOutputFolder, `${baseName}_${i}.json`)

      const currentPassText = brilProgramToText(currentPass)

      await Deno.writeTextFile(outputPath, JSON.stringify(currentPass, null, 2))
      await Deno.writeTextFile(outputPath.replace('.json', '.bril'), currentPassText)
    }
  } catch (error) {
    console.error('Error processing JSON file:', error)
  }
}

async function main() {
  // Parse command line arguments
  const args = parseArgs(Deno.args, {
    string: ['progJson', 'passFolder'],
  })

  if (args.progJson && args.passFolder)
    await processJsonFile(args.progJson, args.passFolder)
  else
    console.log('Usage: deno run --allow-read --allow-write script.js --progJson=[PATH] --progJson=[PATH]')
}

if (typeof Deno !== 'undefined')
  await main()
