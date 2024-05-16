import type { ShikiTransformer } from 'shiki'
import { getHighlighter } from 'shiki'
import { reachingDefinitionTransformer } from './bril'

export async function BrilTransformerFactory(
  bril: any,
  nord: any,
  rose: any,
): Promise<ShikiTransformer[]> {
  const highlighter = await getHighlighter({
    themes: [nord, rose],
    langs: [bril],
  })

  return [reachingDefinitionTransformer(highlighter)]
}
