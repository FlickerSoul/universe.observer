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

function calculateRatio(original, compressed) {
  return fs.statSync(compressed).size / fs.statSync(original).size
}

interface ICompressedStat { filePath: string; ratio: number }

async function shrinkImagesInDir(dirPath: string) {
  let compressed: ICompressedStat[] = []
  console.log('👓', dirPath)

  for (const dirent of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      compressed = compressed.concat(await shrinkImagesInDir(path.join(dirPath, dirent.name)))
    } else if (dirent.isFile()) {
      const filePath = path.join(dirPath, dirent.name)
      const parsed = path.parse(filePath)
      const originalPath = path.join(parsed.dir, `${parsed.name}-original${parsed.ext}`)
      if (IMAGE_EXTENSIONS.has(parsed.ext)) {
        console.log('🏞️', dirent.name)
        if (!ORIGINAL_REGEX.test(filePath) && !fs.existsSync(originalPath)) {
          fs.copyFileSync(filePath, originalPath)
          const source = tinify.fromFile(filePath)
          await source.toFile(filePath)
          compressed.push({ filePath, ratio: calculateRatio(originalPath, filePath) })
          console.log('✅', 'compressed')
        } else {
          console.log('❌', 'already compressed')
        }
      }
    }
  }
  return compressed
}

function print_result(result: ICompressedStat[]) {
  console.log('compressed images:')
  if (result.length === 0) {
    console.log('none')
  } else {
    result.forEach((stat) => {
      console.log(stat.filePath, 'ratio:', stat.ratio)
    })

    throw new Error('Images compressed, please commit the changes')
  }
}

print_result(await shrinkImagesInDir(PAGE_DIR))
