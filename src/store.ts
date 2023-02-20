import { defineStore } from 'pinia'

export const useCommStore = defineStore('comm', {
  state: () => {
    return { tagList: {} as { [key: string]: boolean } }
  },
  actions: {
    changeTag(tag: string, value: boolean) {
      this.tagList[tag] = value
    },
    chooseTag(tag: string) {
      this.changeTag(tag, true)
    },
    pushTag(tag: string) {
      this.tagList[tag] = false
    },
  },
  getters: {
    tags(): string[] {
      return Object.keys(this.tagList)
    },
    selectedTags(): string[] {
      return this.tags.filter(tag => this.tagList[tag])
    },
    isTagSelected(): (tag: string) => boolean {
      return tag => this.tagList[tag]
    },
  },
})
