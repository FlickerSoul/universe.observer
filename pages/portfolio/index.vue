<script setup lang="ts">
import InfoItem from './components/InfoItem.vue'
import ContentItem from './components/ContentItem.vue'
import type { IContentItem, IInfoItem } from './components/types'
import { TechItems } from './components/types'

const infoItems: IInfoItem[] = [
  {
    icon: 'i-mdi-email',
    value: 'hi@universe.observer',
    url: 'mailto:hi@universe.observer',
  },
  { icon: 'i-mdi-key', value: 'C591 74DB 000B 0AAF', mono: true },
  {
    icon: 'i-mdi-github',
    value: 'FlickerSoul',
    url: 'https://github.com/FlickerSoul',
  },
  {
    icon: 'i-mdi-linkedin',
    value: 'Larry Z.',
    url: 'https://www.linkedin.com/in/larry-zeng-heyuan/',
  },
]

const contentItems: IContentItem[] = [
  {
    title: 'Graphery: Interactive Graph Algorithm Tutorial Website',
    role: 'Software Engineer',
    url: 'https://graphery.reedcompbio.org',
    descriptions: [
      'Built the backend from scratch with Django and Python, supporting GraphQL API and PostgreSQL',
      'Built the frontend from scratch with Vue and TypeScript, supporing i18n, markdown rendering, graph visualiztaion',
      'Visualize any Python code on provided biological networks with a debugger like web interface',
      'Graph algorithm tutorials are translated into multiple languages including Chinese and Spanish',
    ],
    techStack: [
      TechItems.Vue,
      TechItems.TypeScript,
      TechItems.Python,
      TechItems.Django,
    ],
  },
  {
    title: 'aga: autograder for gradescope',
    role: 'Software Engineer',
    url: 'https://github.com/nihilistkitten/aga',
    descriptions: [
      'Autograder infrastructure for <a href="https://gradescope.com/">gradescope</a>',
      'Python pickle is used to pack questions',
      'Automated testing with GitHub Actions',
    ],
    techStack: [TechItems.Python],
  },
  {
    title: 'PL and Compiler',
    descriptions: [
      'Implemented a Lambda Calculus parser and interpreter with Python and SML',
      'Implemented Type Checker For Lambda Calculus',
      'Implemented tokenizer, parser, and interpreter in <code>flex</code>, <code>bison</code>, and <code>c++</code>',
    ],
    techStack: [TechItems.Python, TechItems.CPP, TechItems.bison, TechItems.flex],
  },
  {
    title: 'Graphics',
    descriptions: [
      'Implemented <a href="https://flickersoul.github.io/bezier-funhouse/" target="_blank">a ray-casting mirror scene</a> with GLSL.',
      'Implemented a cloth physics simulation scene in WebGL',
    ],
    techStack: [TechItems.WebGL, TechItems.GLSL, TechItems.JavaScript],
  },
  {
    title: 'Teaching Assistant & Grader',
    descriptions: [
      'MATH 121 -- Intro to Analysis',
      'CSCI 121 -- Intro to Python',
      'CSCI 221 -- Intro to C/++ and Asembly',
      'CSCI 396 -- Computer Networks',
    ],
  },
]
</script>

<template>
  <div class="portfolio-wrapper flex mx-auto content-center mt-5 gap-7">
    <div class="info-sec">
      <div class="mb-5">
        <img src="./head.jpg" class="h-80% w-80% ma border-rd-50%">
      </div>
      <div class="mb-2 text-10">
        Larry Z.
      </div>
      <InfoItem
        v-for="info in infoItems"
        :key="info.value"
        :info="info"
        class="my-1"
      />
    </div>
    <div class="content-sec">
      <ContentItem
        v-for="content in contentItems"
        :key="content.title"
        :content="content"
      />
    </div>
  </div>
</template>

<style lang="sass">
$breakpoint-md: 1024px

.serif-font
  font-family: Georgia,'Times New Roman',Times,serif

@media screen and (min-width: $breakpoint-md)
  .portfolio-wrapper
    margin-left: 1rem
    margin-right: 1rem
    max-width: $breakpoint-md
    flex-direction: row
    .info-sec
      width: 280px
      border-width: 2px
      border-right: solid

@media screen and (max-width: $breakpoint-md)
  .portfolio-wrapper
    margin-left: 2rem
    margin-right: 2rem
    flex-direction: column
    .info-sec
      text-align: center
      width: 100%
      margin-bottom: 2em
      img
        max-width: 180px
        max-height: 180px
    .content-sec
      width: 100%
      margin-bottom: 20px
</style>
