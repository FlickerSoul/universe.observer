import type { Grid, GridFeature } from './computation'
import { getAllGrids } from './computation'

export interface WorkerRequestDataType {
  gridSize: number | null
  targetNumber: number | null
  features: GridFeature[] | undefined
}

export interface WorkerResponseDataType {
  grids: Grid[]
}

interface IRequestWorker {
  onmessage: (message: MessageEvent<WorkerRequestDataType>) => void
  postMessage: (message: WorkerResponseDataType) => void
}

export interface IResponseWorker {
  onmessage: (message: MessageEvent<WorkerResponseDataType>) => void
  postMessage: (message: WorkerRequestDataType) => void
}

const ctx: IRequestWorker = self as any

ctx.onmessage = ({ data }) => {
  if (data.gridSize === null || data.targetNumber === null)
    ctx.postMessage({ grids: [] })
  else
    ctx.postMessage({ grids: getAllGrids(data.gridSize, data.targetNumber, data.features) })
}

export default {} as IResponseWorker
