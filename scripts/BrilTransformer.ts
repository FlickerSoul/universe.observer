import type { ShikiTransformer } from 'shiki'
import { getSingletonHighlighter } from 'shiki'
import { reachingDefinitionTransformer } from './bril'

export async function BrilTransformerFactory(
  bril: any,
  nord: any,
  rose: any,
): Promise<ShikiTransformer[]> {
  const highlighter = await getSingletonHighlighter({
    themes: [nord, rose],
    langs: [bril],
  })

  return [reachingDefinitionTransformer(highlighter)]
}
