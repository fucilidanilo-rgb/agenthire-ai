/**
 * Centralised skill database + keyword extraction utility.
 * Uses word-boundary regex (lookbehind/lookahead) to avoid false positives
 * like matching "go" inside "google" or "ai" inside "maintain".
 * No external libraries — pure TypeScript + standard RegExp.
 */

interface SkillDef {
  name: string;
  patterns: RegExp[];
}

/** Build a word-boundary-safe RegExp for an alias (case-insensitive). */
function wp(alias: string): RegExp {
  const esc = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![a-z0-9])${esc}(?![a-z0-9])`, 'i');
}

const SKILL_DB: SkillDef[] = [
  // ── Frontend ────────────────────────────────────────────────────
  { name: 'Angular',          patterns: [wp('angular'), wp('angularjs')] },
  { name: 'React',            patterns: [wp('react')] },
  { name: 'Vue',              patterns: [wp('vue.js'), wp('vuejs'), wp('vue')] },
  { name: 'TypeScript',       patterns: [wp('typescript')] },
  { name: 'JavaScript',       patterns: [wp('javascript')] },
  { name: 'HTML',             patterns: [wp('html'), wp('html5')] },
  { name: 'CSS',              patterns: [wp('css'), wp('css3')] },
  { name: 'SCSS',             patterns: [wp('scss'), wp('sass')] },
  { name: 'Tailwind',         patterns: [wp('tailwind'), wp('tailwindcss')] },
  { name: 'Next.js',          patterns: [wp('next.js'), wp('nextjs'), wp('next js')] },
  { name: 'Nuxt',             patterns: [wp('nuxt'), wp('nuxt.js')] },
  { name: 'Redux',            patterns: [wp('redux')] },
  { name: 'RxJS',             patterns: [wp('rxjs')] },
  { name: 'GraphQL',          patterns: [wp('graphql')] },
  { name: 'WebComponents',    patterns: [wp('web components'), wp('webcomponents')] },

  // ── Backend ─────────────────────────────────────────────────────
  { name: 'Node.js',          patterns: [wp('node.js'), wp('nodejs'), wp('node js')] },
  { name: 'Python',           patterns: [wp('python')] },
  { name: 'Django',           patterns: [wp('django')] },
  { name: 'FastAPI',          patterns: [wp('fastapi'), wp('fast api')] },
  { name: 'Express',          patterns: [wp('express')] },
  { name: 'NestJS',           patterns: [wp('nestjs'), wp('nest.js')] },
  { name: 'Java',             patterns: [wp('java')] },
  { name: 'Spring',           patterns: [wp('spring boot'), wp('spring')] },
  { name: 'Go',               patterns: [wp('golang'), wp('go lang')] },
  { name: 'Rust',             patterns: [wp('rust')] },
  { name: 'PHP',              patterns: [wp('php')] },
  { name: 'Laravel',          patterns: [wp('laravel')] },
  { name: 'Ruby',             patterns: [wp('ruby')] },
  { name: 'Rails',            patterns: [wp('ruby on rails'), wp('rails')] },

  // ── Data & Storage ──────────────────────────────────────────────
  { name: 'SQL',              patterns: [wp('sql')] },
  { name: 'PostgreSQL',       patterns: [wp('postgresql'), wp('postgres')] },
  { name: 'MySQL',            patterns: [wp('mysql')] },
  { name: 'MongoDB',          patterns: [wp('mongodb'), wp('mongo')] },
  { name: 'Redis',            patterns: [wp('redis')] },
  { name: 'Firebase',         patterns: [wp('firebase'), wp('firestore')] },
  { name: 'Elasticsearch',    patterns: [wp('elasticsearch'), wp('elastic search')] },
  { name: 'Pandas',           patterns: [wp('pandas')] },
  { name: 'NumPy',            patterns: [wp('numpy')] },

  // ── DevOps & Cloud ──────────────────────────────────────────────
  { name: 'Docker',           patterns: [wp('docker')] },
  { name: 'Kubernetes',       patterns: [wp('kubernetes'), wp('k8s')] },
  { name: 'AWS',              patterns: [wp('aws'), wp('amazon web services')] },
  { name: 'GCP',              patterns: [wp('gcp'), wp('google cloud')] },
  { name: 'Azure',            patterns: [wp('azure'), wp('microsoft azure')] },
  { name: 'CI/CD',            patterns: [wp('ci/cd'), wp('cicd'), wp('continuous integration')] },
  { name: 'GitHub Actions',   patterns: [wp('github actions')] },
  { name: 'Terraform',        patterns: [wp('terraform')] },
  { name: 'Linux',            patterns: [wp('linux'), wp('unix')] },
  { name: 'Nginx',            patterns: [wp('nginx')] },

  // ── Testing ─────────────────────────────────────────────────────
  { name: 'Jest',             patterns: [wp('jest')] },
  { name: 'Cypress',          patterns: [wp('cypress')] },
  { name: 'Playwright',       patterns: [wp('playwright')] },
  { name: 'Jasmine',          patterns: [wp('jasmine')] },
  { name: 'TDD',              patterns: [wp('tdd'), wp('test-driven'), wp('test driven development')] },

  // ── Design & AI ─────────────────────────────────────────────────
  { name: 'Figma',            patterns: [wp('figma')] },
  { name: 'UI/UX',            patterns: [wp('ui/ux'), wp('ux design'), wp('ui design'), wp('user experience'), wp('user interface')] },
  { name: 'Machine Learning', patterns: [wp('machine learning')] },
  { name: 'Deep Learning',    patterns: [wp('deep learning')] },
  { name: 'Prompt Engineering', patterns: [wp('prompt engineering')] },

  // ── Process & Tools ─────────────────────────────────────────────
  { name: 'Agile',            patterns: [wp('agile')] },
  { name: 'Scrum',            patterns: [wp('scrum')] },
  { name: 'Git',              patterns: [wp('git')] },
  { name: 'REST API',         patterns: [wp('rest api'), wp('restful'), wp('api rest')] },
  { name: 'Microservices',    patterns: [wp('microservices'), wp('microservice')] },
  { name: 'Jira',             patterns: [wp('jira')] },
];

/**
 * Scans free-form text and returns the canonical skill names found.
 * Case-insensitive; uses word-boundary matching to avoid false positives.
 */
export function extractSkillsFromText(text: string): string[] {
  return SKILL_DB
    .filter(def => def.patterns.some(p => p.test(text)))
    .map(def => def.name);
}

/** Flat list of all skill display names — useful for documentation / autocomplete. */
export const ALL_SKILL_NAMES: readonly string[] = SKILL_DB.map(d => d.name);
