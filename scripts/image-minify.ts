import { cwd } from 'node:process'
import * as path from 'node:path'
import * as fs from 'node:fs'
import tinify from 'tinify'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

if (process.env.TINY_PNG_API_KEY)
  tinify.key = process.env.TINY_PNG_API_KEY
else
  throw new Error('TINY_PNG_API_KEY is not set')

const WORKING_DIR = cwd()
const PAGE_DIR = path.join(WORKING_DIR, 'pages')
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.webp', '.jpeg'])
const ORIGINAL_REGEX = /(.*)-original.(.*)$/

function calculateRatio(original: string, compressed: string) {
  return fs.statSync(compressed).size / fs.statSync(original).size
}

interface ICompressedInfo {
  path: string
  ratio: string
}

const compressed: ICompressedInfo[] = []

async function shrinkImagesInDir(dirPath: string) {
  console.log('👓', dirPath)

  for (const dirent of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      await shrinkImagesInDir(path.join(dirPath, dirent.name))
    } else if (dirent.isFile()) {
      const filePath = path.join(dirPath, dirent.name)
      const parsed = path.parse(filePath)
      const originalPath = path.join(parsed.dir, `${parsed.name}-original${parsed.ext}`)

      // check if it's an image file original and if it's not already compressed
      if (IMAGE_EXTENSIONS.has(parsed.ext.toLowerCase()) && !ORIGINAL_REGEX.test(filePath)) {
        console.log('🏞️', dirent.name)

        // check if the original file exists or not
        if (!fs.existsSync(originalPath)) {
          // copy the file to -original file
          fs.copyFileSync(filePath, originalPath)
          // compress with tiny png
          const source = tinify.fromFile(filePath)
          await source.toFile(filePath)
          compressed.push({
            path: originalPath,
            ratio: `${calculateRatio(originalPath, filePath) * 100}%`
          })
          // log the result
          console.log('✅', ' compressed', 'ratio:', compressed[compressed.length - 1].ratio)
        } else {
          console.log('❌', ' already compressed')
        }
      }
    }
  }
}

await shrinkImagesInDir(PAGE_DIR)

if (compressed.length > 0) {
  console.error("New Files Compressed. Aborting git commit...")
  process.exit(1)
} else {
  console.log("Everything is compressed!")
}

