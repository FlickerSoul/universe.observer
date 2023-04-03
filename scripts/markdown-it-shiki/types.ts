import type { Highlighter, ILanguageRegistration, IThemeRegistration } from 'shiki'

/**
* Options needed to specify the dark mode
* @field light - the light theme info
* @field dark - the dark theme info
*/
export interface DarkModeThemes {
  dark: IThemeRegistration
  light: IThemeRegistration
}

/**
* Options available for the plugin
* @field theme - the theme to use
* @field langs - the languages to load
* @field timeout - the timeout for loading languages
* @field highlighter - the highlighter to use
* @field highlightLines - whether to highlight lines
* @field extra - extra processors to use
*/
export interface Options {
  theme?: IThemeRegistration | DarkModeThemes
  langs?: ILanguageRegistration[]
  timeout?: number
  highlighter?: Highlighter
  highlightLines?: boolean
  extra?: IExtraProcessor[]
}

/**
* The position of the extra element
* @field before - before the code element
* @field after - after the code element
*/
export enum ExtraPosition {
  before = 0,
  f_top_right = 1,
  f_top_left = 2,
  f_bottom_right = 3,
  f_bottom_left = 4,
  after = 5,
}

function positionHolderFormatter(pos: string) {
  return pos.split(' ').map(v => `shiki-extra-${v}`).join(' ')
}

export const PositionHolderClasses = [
  'before',
  'f-top-right f-top f-right',
  'f-top-left f-top f-left',
  'f-bottom-right f-bottom f-right',
  'f-bottom-left f-bottom f-left',
  'after',
].map(positionHolderFormatter)

export const PREPENDING_POSITIONS = [ExtraPosition.before, ExtraPosition.f_top_right, ExtraPosition.f_top_left] as const
export const APPENDING_POSITIONS = [ExtraPosition.f_bottom_right, ExtraPosition.f_bottom_left, ExtraPosition.after] as const
export const FLOATING_POSITIONS = [ExtraPosition.f_top_right, ExtraPosition.f_bottom_right, ExtraPosition.f_top_left, ExtraPosition.f_bottom_left] as Readonly<ExtraPosition[]>
export const FLOATING_TOP = [ExtraPosition.f_top_right, ExtraPosition.f_top_left] as Readonly<ExtraPosition[]>
export const FLOATING_BOTTOM = [ExtraPosition.f_bottom_right, ExtraPosition.f_bottom_left] as Readonly<ExtraPosition[]>
export const FLOATING_RIGHT = [ExtraPosition.f_top_right, ExtraPosition.f_bottom_right] as Readonly<ExtraPosition[]>
export const FLOATING_LEFT = [ExtraPosition.f_top_left, ExtraPosition.f_bottom_left] as Readonly<ExtraPosition[]>

/**
* The html element to be inserted
* @field tag - the tag name of the html element
* @field attrs - the attributes of the html element
* @field content - the content of the html element
* @example {
  * tag: 'div',
  * attrs: {
    * class: 'shiki-filename',
    * },
  * content: 'index.js',
  * }
*/
export interface IElementIntel {
  tag: string
  attrs: Record<string, string>
  content?: string | IElementIntel | IElementIntel[]
}

/**
* The processor to be used for extra elements
*/
export type Processor = (matched: RegExpExecArray | null, lang: string, code: string) => IElementIntel | undefined

interface _LightOnlyProcessor {
  light: Processor
  dark: null
}

interface _LightDarkProcessor {
  light: Processor
  dark?: Processor
}

/**
  * The processor info to be used for extra elements
* @field position - the position of the extra element
* @field attrRe - the regex to match the additional attributes after the ``` of a code fence
*/
interface _IExtraProcessor {
  position: ExtraPosition
  attrRe?: RegExp
}

/**
  * The processor to be used for extra elements
*/
export type IExtraProcessor = (_IExtraProcessor & _LightOnlyProcessor) | (_IExtraProcessor & _LightDarkProcessor)

/**
  * The output of the processor
* @field light - extra element in the light mode
* @field dark - extra element in the dark mode
* @field position - the position of the extra element
*/
export interface IProcessorOutput {
  light?: IElementIntel
  dark?: IElementIntel | null
  position: ExtraPosition
}

export type ElementProcessorType = (intel: IElementIntel | undefined) => string
