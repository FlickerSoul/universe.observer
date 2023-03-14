<script setup lang="ts">
import InfoItem from './components/InfoItem.vue'
import ContentItem from './components/ContentItem.vue'
import type { IContentItem, IInfoItem, ISkillSection } from './components/types'
import { TechItems } from './components/types'
import SkillSection from './components/SkillSection.vue'

const infoItems: IInfoItem[] = [
  {
    icon: 'i-mdi-email',
    name: 'email',
    value: 'hi@universe.observer',
    url: 'mailto:hi@universe.observer',
  },
  {
    icon: 'i-mdi-key',
    name: 'GPG key',
    value: 'C591 74DB 000B 0AAF',
    mono: true,
  },
  {
    icon: 'i-mdi-github',
    name: 'GitHub',
    value: 'FlickerSoul',
    url: 'https://github.com/FlickerSoul',
  },
  {
    icon: 'i-mdi-linkedin',
    name: 'LinkedIn',
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
      'Published paper: <a href="https://academic.oup.com/nar/article/49/W1/W257/6284175">GRAPHERY: interactive tutorials for biological network algorithms</a>',
    ],
    techStack: [
      TechItems.Vue,
      TechItems.TypeScript,
      TechItems.Python,
      TechItems.Django,
    ],
  },
  {
    title: 'AGA: autograder for gradescope',
    role: 'Software Engineer',
    url: 'https://github.com/nihilistkitten/aga',
    descriptions: [
      'Autograder infrastructure for <a href="https://gradescope.com/">gradescope</a>',
      'Automated testing with GitHub Actions',
    ],
    techStack: [TechItems.Python, TechItems.GitHubCICD],
  },
  {
    title: 'PL and Compiler',
    descriptions: [
      'Developed a Lambda Calculus parser and interpreter in Python and SML to demonstrate a deep understanding of functional programming concepts',
      'Designed and implemented a type checker for Lambda Calculus to ensure type safety',
      'Developed a tokenizer, parser, and interpreter for a subset of Python using <code>flex</code>, <code>bison</code>, and <code>c++</code> to demonstrate proficiency in compiler design',
    ],
    techStack: [TechItems.Python, TechItems.CPP, TechItems.bison, TechItems.flex],
  },
  {
    title: 'Graphics',
    descriptions: [
      'Developed a ray-casting mirror scene using GLSL, showcasing proficiency in shader programming and rendering techniques. Project is available online at <a href="https://flickersoul.github.io/bezier-funhouse/" target="_blank">here</a>',
      'Created a cloth physics simulation scene in WebGL, demonstrating expertise in physics simulation and real-time graphics',
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

const skillSets: ISkillSection[] = [
  {
    name: 'Spoken Languages',
    skills: [
      { name: 'Chinese', note: 'Native Proficiency' },
      { name: 'English', note: 'Full Professional Proficiency' },
      { name: 'French', note: 'Elementry Proficiency' },
    ],
  },
  {
    name: 'Languages',
    skills: [
      { name: 'Python' },
      { name: 'C++' },
      { name: 'TypeScript' },
      { name: 'Rust' },
      { name: 'Haskell' },
      { name: 'R' },
      { name: 'SML' },
      { name: 'SQL' },
      { name: 'Lambda Calculus' },
    ],
  }]
</script>

<template>
  <div class="portfolio-wrapper flex mx-auto content-center mt-5">
    <div class="info-sec">
      <div class="cv-info-avatar mb-5">
        <img src="./head.jpg" class="h-80% w-80% ma border-rd-50%">
      </div>
      <div class="mb-1 text-10 cv-info-name serif-font">
        Larry Zeng
      </div>
      <div class="cv-info-items">
        <InfoItem
          v-for="info in infoItems"
          :key="info.value"
          :info="info"
          class="my-1"
        />
        <div class="i-mdi-printer hover-cursor-pointer print-button my-1" onclick="window.print();return false;" />
      </div>
    </div>
    <div>
      <div class="content-sec">
        <div class="section-title">
          Experience
        </div>
        <ContentItem
          v-for="content in contentItems"
          :key="content.title"
          class="mb-2 ml-3"
          :content="content"
        />
      </div>
      <div class="skill-sec">
        <div class="section-title">
          Skills
        </div>
        <SkillSection
          v-for="skills in skillSets"
          :key="skills.name"
          :skills="skills"
          class="ml-3"
        />
      </div>
    </div>
  </div>
</template>

<style lang="sass">
$breakpoint-md: 1024px

.serif-font
  font-family: Georgia,'Times New Roman',Times,serif

.section-title
  @extend .serif-font
  --at-apply: "text-7 leading-none mb-3 border-0 border-b border-style-solid"
ul
  margin-block-start: 0.5em
  line-height: 1.5em
div[class$=sec]
  margin-bottom: 2em

@media screen and (min-width: $breakpoint-md)
  .portfolio-wrapper
    max-width: $breakpoint-md
    flex-direction: row
    .info-sec
      width: 380px
      border-width: 2px
      border-right: solid
      margin-right: 1.5em
    .content-sec
      width: 100%
    .skill-sec
      width: 100%

@media screen and (max-width: $breakpoint-md)
  .portfolio-wrapper
    margin-left: 2rem
    margin-right: 2rem
    flex-direction: column
    .info-sec
      display: flex
      flex-direction: column
      flex-wrap: nowrap
      align-items: center
      .cv-info-items
        display: flex
        flex-direction: column
        flex-wrap: nowrap
      width: 100%
      margin-bottom: 2em
      img
        max-width: 180px
        max-height: 180px
    .content-sec
      width: 100%
      margin-bottom: 20px

@media print
  .portfolio-wrapper
    flex-direction: column
    gap: .5rem
    ul
      line-height: 1.25rem
    .info-sec
      display: flex
      font-size: 1rem
      line-height: 1rem
      flex-direction: row
      min-width: 200px
      justify-content: space-between
      .cv-info-avatar
        display: none
      div[id^="cv-info-item-GPG"]
        display: none
      .cv-info-name
        font-size: 2em
      .print-button
          display: none
    .content-sec
      .cv-content-title
        font-size: 1.2em
</style>
