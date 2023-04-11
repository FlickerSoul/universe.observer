import 'vue-router'
import type { IPostData } from "./src/components/types";

declare module 'vue-router' {
    interface RouteMeta {
        frontmatter: IPostData
        defaultLang?: string
    }
}
