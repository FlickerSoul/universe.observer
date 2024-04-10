export type Grid = number[][]

export interface GridFeatureInput {
  grid: Grid
  targetNumber: number
  gridSize: number
}

export type GridFeature = (input: GridFeatureInput) => boolean

const LOW_BOUND = 1
const DEFAULT_FEATURES: GridFeature[] = [twoDiagonalSum]
const SENTINEL = -1

const range = (start: number, end: number): number[] => {
  return [...Array(end - start + 1).keys()].map(i => i + start)
}

export function twoDiagonalSum({ grid, gridSize, targetNumber }: GridFeatureInput): boolean {
  const leftToRight = range(0, gridSize - 1).reduce((acc, i) => acc + grid[i][i], 0)
  const rightToLeft = range(0, gridSize - 1).reduce((acc, i) => acc + grid[i][gridSize - i - 1], 0)

  return leftToRight === targetNumber && rightToLeft === targetNumber
}

export function getAllGrids(
  gridSize: number,
  targetNumber: number,
  features: GridFeature[] = DEFAULT_FEATURES,
): Grid[] {
  console.log(gridSize, targetNumber, features)

  const HIGH_BOUND = targetNumber - 1
  const grids = fillGrid(
    Array.from({ length: gridSize }, () => Array(gridSize).fill(SENTINEL)),
    0, 0,
    LOW_BOUND, HIGH_BOUND,
    gridSize, targetNumber,
    Array(gridSize * 2).fill(targetNumber),
  ).filter(grid => features.every(feature => feature({ grid, gridSize, targetNumber })))

  console.log(grids)

  return grids
}

function fillGrid(
  grid: Grid,
  i: number,
  j: number,
  lowBound: number,
  highBound: number,
  gridSize: number,
  targetNumber: number,
  remainders: number[],
): Grid[] {
  const rowRemain = remainders[i]
  const colRemain = remainders[j + gridSize]

  if (i === gridSize - 1 && j === gridSize - 1) {
    // the last one has to complete both row and column
    // it has to have something remaining
    // and it has to be less than the target number, cuz we can't fill it
    if (rowRemain === colRemain && rowRemain > 0 && rowRemain < targetNumber) {
      const copied = JSON.parse(JSON.stringify(grid))
      copied[i][j] = rowRemain
      return [copied]
    }
    return []
  } else if (j === gridSize - 1) {
    // when it's the last digit at the end of the row
    // we can only fill the row reminder, it has to be less than what the column requires
    // and the remaining has to have something
    if (rowRemain >= colRemain || rowRemain === 0)
      return []

    grid[i][j] = rowRemain
    remainders[i] -= rowRemain
    remainders[j + gridSize] -= rowRemain

    const result = fillGrid(grid, i + 1, 0, lowBound, highBound, gridSize, targetNumber, remainders)

    grid[i][j] = SENTINEL
    remainders[i] += rowRemain
    remainders[j + gridSize] += rowRemain

    return result
  } else if (i === gridSize - 1) {
    // filling in the last column,
    // every cell has to be the col remainder and less than row remainder
    if (colRemain >= rowRemain || colRemain === 0)
      return []

    grid[i][j] = colRemain
    remainders[i] -= colRemain
    remainders[j + gridSize] -= colRemain

    const results = fillGrid(grid, i, j + 1, lowBound, highBound, gridSize, targetNumber, remainders)

    grid[i][j] = SENTINEL
    remainders[i] += colRemain
    remainders[j + gridSize] += colRemain

    return results
  } else {
    // everywhere else on the grid, get the remainders and
    // get the min from the row and column remainders, use it as the range of candidates
    const minTopChoice = Math.max(rowRemain, colRemain)

    return range(lowBound, minTopChoice).flatMap((choice) => {
      if (rowRemain - choice <= 0 || colRemain - choice <= 0)
        return []

      grid[i][j] = choice
      remainders[i] -= choice
      remainders[j + gridSize] -= choice

      const result = fillGrid(grid, i, j + 1, lowBound, highBound, gridSize, targetNumber, remainders)

      grid[i][j] = SENTINEL
      remainders[i] += choice
      remainders[j + gridSize] += choice

      return result
    })
  }
}
