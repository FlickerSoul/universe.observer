import { useRouter } from 'vue-router'

export function getVisiblePosts() {
  return useRouter().getRoutes()
    .filter(route => route.path.startsWith('/posts/') && !route.path.endsWith('.html')) // filter valid ones
    .filter((route) => { // filter visible ones
      return route.meta.frontmatter.display === undefined
        ? route.meta.frontmatter.title
        : route.meta.frontmatter.display
    })
}
