<script setup lang="ts">
import InfoItem from './components/InfoItem.vue'
import ContentItem from './components/ContentItem.vue'
import type { IContentItem, IInfoItem } from './components/types'
import { TechItems } from './components/types'

const infoItems: IInfoItem[] = [
  { icon: "i-mdi-email", value: "hi@universe.observer", url: "mailto:hi@universe.observer"},
  { icon: "i-mdi-key", value: "C591 74DB 000B 0AAF" },
  { icon: "i-mdi-github", value: "FlickerSoul", url: "https://github.com/FlickerSoul"},
  { icon: "i-mdi-linkedin", value: "Larry Z.", url: "https://www.linkedin.com/in/larry-zeng-heyuan/"}
]
const contentItems: IContentItem[] = [
  { 
    title: "Graphery: Interactive Graph Algorithm Tutorial Website", 
    role: "Software Engineer",
    url: "https://graphery.reedcompbio.org",
    descriptions: [
      "Built the backend from scratch with Django and Python, supporting GraphQL API and PostgreSQL.",
      "Built the frontend from scratch with Vue and TypeScript, supporing i18n, markdown rendering, graph visualiztaion.",
      "Visualize any Python code on provided biological networks with a debugger like web interface.",
      "Graph algorithm tutorials are translated into multiple languages including Chinese and Spanish."
    ],
    techStack: [TechItems.Vue, TechItems.TypeScript, TechItems.Python, TechItems.Django]
  }
]
</script>

<template>
  <div class="portfolio-wrapper flex mx-auto content-center mt-5 gap-3">
    <div class="info-sec">
      <div class="mb-5">
        <img src="./head.JPG" class="h-70% w-70% ma border-rd-50%"/>
      </div>
      <div class="mb-2 text-10">
        Larry Z.
      </div>
      <InfoItem v-for="info in infoItems" :key="info.value" :info="info" class="my-1"/>
    </div>
    <div class="content-sec">
      <ContentItem v-for="content in contentItems" :key="content.title" :content="content" />
    </div>
  </div>
</template>

<style scoped lang="sass">
$breakpoint-md: 1024px 
// fix the spacing stuff 

@media screen and (min-width: $breakpoint-md)
  .portfolio-wrapper
    max-width: $breakpoint-md
    flex-direction: row
    .info-sec
      width: 30%
      border-width: 2px
      border-right: solid
    .content-sec
      width: 70%

@media screen and (max-width: $breakpoint-md)
  .portfolio-wrapper
    margin-left: 2rem
    margin-right: 2rem
    flex-direction: column
    .info-sec
      text-align: center
      width: 100%
      margin-bottom: 10px
      img
        max-width: 160px
        max-height: 160px
    .content-sec
      width: 100%
      margin-bottom: 20px
</style>
