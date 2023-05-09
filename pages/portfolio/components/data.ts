import type { IContentItem, IInfoItem, ISkillSection } from './types'
import { TechItems } from './types'

export const infoItems: IInfoItem[] = [
  {
    icon: 'i-mdi-email',
    name: 'email',
    value: 'hi@universe.observer',
    url: 'mailto:hi@universe.observer',
  },
  {
    icon: 'i-mdi-key',
    name: 'GPG key',
    value: '4101 ED17 F1A5 9D01',
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

export const contentItems: IContentItem[] = [
  {
    title: 'Graphery: Interactive Graph Algorithm Tutorial Website',
    role: 'Software Engineer',
    url: 'https://graphery.reedcompbio.org',
    descriptions: [
      'Built the backend from scratch with Django and Python, supporting GraphQL API and PostgreSQL',
      'Built the frontend from scratch with Vue and TypeScript, supporing i18n, markdown rendering, graph visualiztaion',
      'Visualize any Python code on provided biological networks with a debugger like web interface',
      'Graph algorithm tutorials are translated into multiple languages including Chinese and Spanish',
      'Published paper at NAR: <a href="https://academic.oup.com/nar/article/49/W1/W257/6284175">GRAPHERY: interactive tutorials for biological network algorithms</a>',
    ],
    techStack: [
      TechItems.Vue,
      TechItems.TypeScript,
      TechItems.Python,
      TechItems.Django,
    ],
  },

  {
    title: 'Personal Blog',
    role: 'Designer & Developer',
    url: 'https://universe.observer',
    descriptions: [
      'Built with Vue and Vite, deployed on Vercel with GitHub Actions',
      'Supports i18n, markdown rendering, SSR, and dark mode',
    ],
    techStack: [
      TechItems.Vue,
      TechItems.Vite,
      TechItems.TypeScript,
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
    title: 'Programming Language Theory and Compiler',
    descriptions: [
      'Developed a Lambda Calculus parser and interpreter in Python and SML to demonstrate a deep understanding of functional programming concepts',
      'Designed and implemented a type checker for Lambda Calculus to ensure type safety',
      'Developed a tokenizer, parser, and interpreter for a subset of Python using <code>flex</code>, <code>bison</code>, and <code>c++</code> to demonstrate proficiency in compiler design',
    ],
    techStack: [TechItems.Python, TechItems.CPP, TechItems.bison, TechItems.flex],
  },

  {
    title: 'Toy Renderers and Scenes in WebGL',
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
      'CSCI 221 -- Intro to C/C++ and Asembly',
      'CSCI 396 -- Computer Networks',
    ],
  },
]

export const skillSets: ISkillSection[] = [
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
      { name: 'Swift' },
      { name: 'Rust' },
      { name: 'Haskell' },
      { name: 'R' },
      { name: 'SQL' },
      { name: 'GLSL' },
      { name: 'SML' },
      { name: 'Lambda Calculus' },
    ],
  },
  {
    name: 'Technologies',
    skills: [
      { name: 'Vim/NeoVim' },
      { name: 'JetBrains IDE' },
      { name: 'Git' },
      { name: 'GitHub' },
      { name: 'Docker' },
      { name: 'Linux/Unix' },
      { name: 'Vue' },
      { name: 'Vite' },
      { name: 'Sass' },
      { name: 'GraphQL' },
      { name: 'Pandas' },
      { name: 'Matplotlib' },
      { name: 'CICD' },
      { name: 'PostgreSQL' },
    ],
  },
]
