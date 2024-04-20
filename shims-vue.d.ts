import 'vue-router'
import type { ViteSSGOptions } from 'vite-ssg'
import type { IPostData } from './src/components/types'

declare module 'vue-router' {
  interface RouteMeta {
    frontmatter: IPostData
    defaultLang?: string
  }
}

declare module 'vite' {
  interface UserConfig {
    ssgOptions?: ViteSSGOptions
  }
}

declare module '*.vue' {
  import type { ComponentOptions } from 'vue'

  const Component: ComponentOptions
  export default Component
}

declare module '*.md' {
  import type { ComponentOptions } from 'vue'

  const Component: ComponentOptions
  export default Component
}
