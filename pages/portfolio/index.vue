<script setup lang="ts">
import { useHead } from '@vueuse/head'
import InfoItem from './components/InfoItem.vue'
import ContentItem from './components/ContentItem.vue'
import SkillSection from './components/SkillSection.vue'
import { contentItems, infoItems, skillSets } from './components/data.ts'

const TITLE = 'Portfolio %sep %site.author'
const DESCRIPTION = 'Portfolio of Larry Zeng'
useHead({
  title: TITLE,
  meta: [
    { name: 'description', content: DESCRIPTION },
    { property: 'og:title', content: TITLE },
    { property: 'og:description', content: DESCRIPTION },
    { property: 'og:image', content: 'https://universe.observer/head.jpg' },
  ],
})
</script>

<template>
  <div class="portfolio-wrapper flex mx-auto content-center mt-5">
    <div class="info-sec">
      <div class="cv-info-avatar mb-5">
        <img src="./head.jpg" alt="profile-photo" class="h-80% w-80% ma border-rd-50%">
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
  div[class$=sec]
    margin-bottom: 1em
  .portfolio-wrapper
    flex-direction: column
    gap: .5rem
    ul
      line-height: 1.25rem
    .info-sec
      display: flex
      font-size: 1rem
      line-height: 1rem
      flex-direction: column
      gap: 1em
      min-width: 200px
      justify-content: space-between
      .cv-info-items
        & div[id^="cv-info-item"]
          display: inline-block
          margin-right: 2em
        & div[id^="cv-info-item-GPG"]
          display: none
      .cv-info-avatar
        display: none
      .cv-info-name
        font-size: 2em
      .print-button
          display: none
    .content-sec
      .cv-content-title
        font-size: 1.2em
</style>
