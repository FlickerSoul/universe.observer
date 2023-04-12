import 'vue-router'
import type { IPostData } from "./src/components/types"
import type { ViteSSGOptions } from "vite-ssg"

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
