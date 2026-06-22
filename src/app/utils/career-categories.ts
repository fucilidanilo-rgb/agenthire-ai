/**
 * Multi-industry career analysis engine.
 * Detects the most likely professional sector from combined text
 * (role + job offer + CV) and extracts relevant skills for that sector.
 * No external libraries — pure TypeScript + standard RegExp.
 */

export type CategoryId =
  | 'tech'
  | 'content-creator'
  | 'marketing'
  | 'design-ux'
  | 'travel-hospitality'
  | 'general-business';

interface SkillDef { name: string; patterns: RegExp[]; }

interface CareerCategory {
  id: CategoryId;
  label: string;               // Italian display name
  detectionKeywords: string[]; // simple includes() scan for category scoring
  skills: SkillDef[];          // word-boundary regex skill extraction
}

/** Word-boundary-safe pattern (lookbehind + lookahead, case-insensitive). */
function wp(alias: string): RegExp {
  const esc = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![a-z0-9])${esc}(?![a-z0-9])`, 'i');
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

const CAREER_CATEGORIES: CareerCategory[] = [

  // ── 1. TECH / DEVELOPER ──────────────────────────────────────────────────
  {
    id: 'tech',
    label: 'Tech / Developer',
    detectionKeywords: [
      'developer', 'engineer', 'frontend', 'backend', 'fullstack', 'software',
      'coding', 'programming', 'typescript', 'javascript', 'react', 'angular',
      'python', 'nodejs', 'github', 'devops', 'docker', 'sql', 'framework',
      'sviluppatore', 'programmatore', 'ingegnere software', 'codebase',
      'rest api', 'graphql', 'microservices',
    ],
    skills: [
      // Frontend
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
      // Backend
      { name: 'Node.js',          patterns: [wp('node.js'), wp('nodejs'), wp('node js')] },
      { name: 'Python',           patterns: [wp('python')] },
      { name: 'Django',           patterns: [wp('django')] },
      { name: 'FastAPI',          patterns: [wp('fastapi'), wp('fast api')] },
      { name: 'Express',          patterns: [wp('express')] },
      { name: 'NestJS',           patterns: [wp('nestjs'), wp('nest.js')] },
      { name: 'Java',             patterns: [wp('java')] },
      { name: 'Spring',           patterns: [wp('spring boot'), wp('spring')] },
      { name: 'Go',               patterns: [wp('golang'), wp('go lang')] },
      { name: 'PHP',              patterns: [wp('php')] },
      { name: 'Ruby',             patterns: [wp('ruby')] },
      { name: 'Rails',            patterns: [wp('ruby on rails'), wp('rails')] },
      // Data & Storage
      { name: 'SQL',              patterns: [wp('sql')] },
      { name: 'PostgreSQL',       patterns: [wp('postgresql'), wp('postgres')] },
      { name: 'MongoDB',          patterns: [wp('mongodb'), wp('mongo')] },
      { name: 'Redis',            patterns: [wp('redis')] },
      { name: 'Firebase',         patterns: [wp('firebase'), wp('firestore')] },
      { name: 'MySQL',            patterns: [wp('mysql')] },
      { name: 'Elasticsearch',    patterns: [wp('elasticsearch')] },
      // DevOps & Cloud
      { name: 'Docker',           patterns: [wp('docker')] },
      { name: 'Kubernetes',       patterns: [wp('kubernetes'), wp('k8s')] },
      { name: 'AWS',              patterns: [wp('aws'), wp('amazon web services')] },
      { name: 'GCP',              patterns: [wp('gcp'), wp('google cloud')] },
      { name: 'Azure',            patterns: [wp('azure')] },
      { name: 'CI/CD',            patterns: [wp('ci/cd'), wp('cicd'), wp('continuous integration')] },
      { name: 'GitHub Actions',   patterns: [wp('github actions')] },
      { name: 'Terraform',        patterns: [wp('terraform')] },
      { name: 'Linux',            patterns: [wp('linux'), wp('unix')] },
      // Testing
      { name: 'Jest',             patterns: [wp('jest')] },
      { name: 'Cypress',          patterns: [wp('cypress')] },
      { name: 'Playwright',       patterns: [wp('playwright')] },
      { name: 'TDD',              patterns: [wp('tdd'), wp('test-driven')] },
      // AI & Tools
      { name: 'Machine Learning', patterns: [wp('machine learning')] },
      { name: 'Deep Learning',    patterns: [wp('deep learning')] },
      { name: 'Prompt Engineering', patterns: [wp('prompt engineering')] },
      { name: 'REST API',         patterns: [wp('rest api'), wp('restful'), wp('api rest')] },
      { name: 'Microservices',    patterns: [wp('microservices'), wp('microservice')] },
      { name: 'Git',              patterns: [wp('git')] },
      { name: 'Figma',            patterns: [wp('figma')] },
      { name: 'Agile',            patterns: [wp('agile')] },
      { name: 'Scrum',            patterns: [wp('scrum')] },
      { name: 'Jira',             patterns: [wp('jira')] },
    ],
  },

  // ── 2. CONTENT / MARKETING (Creator + Specialist) ────────────────────────
  {
    id: 'content-creator',
    label: 'Content / Marketing',
    detectionKeywords: [
      // Corporate content terms (cover specialist/strategist roles)
      'content strategy', 'content creation', 'content production', 'content calendar',
      'copywriting', 'editorial', 'brand voice', 'content specialist',
      'social media manager', 'social media management', 'gestione social',
      // Platform / influencer terms
      'content creator', 'creator', 'tiktok', 'instagram', 'youtube', 'reels',
      'viral', 'followers', 'ugc', 'influencer', 'brand deal', 'engagement rate',
      'capcut', 'sponsorship', 'personal brand', 'creator economy', 'social media creator',
    ],
    skills: [
      { name: 'Content Strategy',     patterns: [wp('content strategy'), wp('piano editoriale'), wp('calendario editoriale'), wp('strategia contenuti')] },
      { name: 'Copywriting',          patterns: [wp('copywriting'), wp('copy writing'), wp('copy'), wp('testi'), wp('caption'), wp('captions')] },
      { name: 'Brand Voice',          patterns: [wp('brand voice'), wp('tone of voice')] },
      { name: 'Editorial Planning',   patterns: [wp('editorial'), wp('editorial planning'), wp('editorial calendar'), wp('content calendar'), wp('piano editoriale'), wp('calendario editoriale')] },
      { name: 'Storytelling',         patterns: [wp('storytelling')] },
      { name: 'Social Media',         patterns: [wp('social media'), wp('contenuti social'), wp('social content'), wp('gestione social')] },
      { name: 'Instagram',            patterns: [wp('instagram'), wp('instagram stories'), wp('ig stories'), wp('stories')] },
      { name: 'TikTok',               patterns: [wp('tiktok'), wp('tik tok')] },
      { name: 'YouTube',              patterns: [wp('youtube')] },
      { name: 'Reels',                patterns: [wp('reels'), wp('video brevi'), wp('short-form video'), wp('short form video')] },
      { name: 'Video Editing',        patterns: [wp('video editing'), wp('video edit'), wp('montaggio video')] },
      { name: 'UGC',                  patterns: [wp('ugc'), wp('user generated content')] },
      { name: 'Brand Collaboration',  patterns: [wp('brand collaboration'), wp('brand deal'), wp('brand partner')] },
      { name: 'Community Management', patterns: [wp('community management'), wp('community manager'), wp('community'), wp('gestione community')] },
      { name: 'Canva',                patterns: [wp('canva')] },
      { name: 'CapCut',               patterns: [wp('capcut'), wp('cap cut')] },
      { name: 'Analytics',            patterns: [wp('analytics'), wp('metriche'), wp('insight'), wp('dati performance')] },
      { name: 'Personal Branding',    patterns: [wp('personal branding'), wp('personal brand')] },
      { name: 'SEO',                  patterns: [wp('seo')] },
      { name: 'Newsletter',           patterns: [wp('newsletter'), wp('email newsletter')] },
    ],
  },

  // ── 3. MARKETING ─────────────────────────────────────────────────────────
  {
    id: 'marketing',
    label: 'Marketing',
    detectionKeywords: [
      'marketing', 'seo', 'digital marketing', 'google analytics', 'google ads',
      'email marketing', 'campaign manager', 'conversion rate', 'funnel',
      'lead generation', 'advertising', 'sem', 'ppc', 'affiliate marketing',
      'marketing manager', 'brand manager', 'growth marketing',
    ],
    skills: [
      { name: 'Digital Marketing',    patterns: [wp('digital marketing')] },
      { name: 'SEO',                  patterns: [wp('seo'), wp('search engine optimization'), wp('posizionamento')] },
      { name: 'SEM',                  patterns: [wp('sem'), wp('google ads'), wp('google adwords'), wp('search engine marketing')] },
      { name: 'Email Marketing',      patterns: [wp('email marketing')] },
      { name: 'Campaign Management',  patterns: [wp('campaign management'), wp('campaign manager'), wp('gestione campagne')] },
      { name: 'Social Ads',           patterns: [wp('social ads'), wp('facebook ads'), wp('instagram ads'), wp('meta ads')] },
      { name: 'Google Analytics',     patterns: [wp('google analytics'), wp('ga4'), wp('metriche'), wp('dati performance')] },
      { name: 'Content Marketing',    patterns: [wp('content marketing')] },
      { name: 'CRM',                  patterns: [wp('crm'), wp('salesforce'), wp('hubspot')] },
      { name: 'Brand Strategy',       patterns: [wp('brand strategy'), wp('brand positioning'), wp('strategia brand')] },
      { name: 'Copywriting',          patterns: [wp('copywriting'), wp('copy writing'), wp('copy'), wp('testi'), wp('caption')] },
      { name: 'Marketing Automation', patterns: [wp('marketing automation'), wp('mailchimp'), wp('klaviyo')] },
      { name: 'A/B Testing',          patterns: [wp('a/b testing'), wp('a/b test'), wp('split test')] },
    ],
  },

  // ── 4. DESIGN / UX ────────────────────────────────────────────────────────
  {
    id: 'design-ux',
    label: 'Design / UX',
    detectionKeywords: [
      'designer', 'ux design', 'ui design', 'wireframe', 'prototype', 'figma',
      'design system', 'user research', 'usability', 'visual design', 'graphic design',
      'user experience', 'interaction design', 'product designer', 'ux researcher',
    ],
    skills: [
      { name: 'UI Design',        patterns: [wp('ui design'), wp('interface design'), wp('design interfacce'), wp('design interfaccia')] },
      { name: 'UX Research',      patterns: [wp('ux research'), wp('user research'), wp('ricerca utenti')] },
      { name: 'Wireframing',      patterns: [wp('wireframing'), wp('wireframe'), wp('wireframes')] },
      { name: 'Prototyping',      patterns: [wp('prototyping'), wp('prototype'), wp('prototipo'), wp('prototipi')] },
      { name: 'Figma',            patterns: [wp('figma')] },
      { name: 'Design System',    patterns: [wp('design system'), wp('design systems')] },
      { name: 'User Testing',     patterns: [wp('user testing'), wp('usability testing'), wp('test di usabilità')] },
      { name: 'Accessibility',    patterns: [wp('accessibility'), wp('wcag'), wp('a11y'), wp('accessibilità')] },
      { name: 'Visual Design',    patterns: [wp('visual design'), wp('visual designer')] },
      { name: 'Adobe XD',         patterns: [wp('adobe xd')] },
      { name: 'Sketch',           patterns: [wp('sketch')] },
      { name: 'Brand Identity',   patterns: [wp('brand identity'), wp('identità visiva')] },
    ],
  },

  // ── 5. TRAVEL / HOSPITALITY ──────────────────────────────────────────────
  {
    id: 'travel-hospitality',
    label: 'Travel / Hospitality',
    detectionKeywords: [
      'travel', 'tourism', 'hospitality', 'hotel', 'itinerary', 'dmc',
      'travel design', 'luxury travel', 'destination management', 'tour operator',
      'travel agency', 'viaggio', 'turismo', 'ospitalità', 'itinerario',
      'travel designer', 'travel consultant',
    ],
    skills: [
      { name: 'Travel Design',         patterns: [wp('travel design'), wp('travel designer')] },
      { name: 'Client Management',     patterns: [wp('client management'), wp('gestione clienti'), wp('account management')] },
      { name: 'Supplier Coordination', patterns: [wp('supplier coordination'), wp('supplier management'), wp('gestione fornitori')] },
      { name: 'Itinerary Planning',    patterns: [wp('itinerary planning'), wp('itinerary'), wp('itinerario'), wp('itinerari'), wp('travel planning'), wp('pianificazione viaggio')] },
      { name: 'Luxury Travel',         patterns: [wp('luxury travel'), wp('luxury'), wp('lusso')] },
      { name: 'DMC',                   patterns: [wp('dmc'), wp('destination management')] },
      { name: 'Customer Experience',   patterns: [wp('customer experience'), wp('esperienza cliente'), wp('customer care'), wp('gestione cliente'), wp('assistenza clienti')] },
      { name: 'Operations',            patterns: [wp('operations'), wp('operazioni'), wp('operativo')] },
      { name: 'International Clients', patterns: [wp('international clients'), wp('clienti internazionali')] },
      { name: 'Problem Solving',       patterns: [wp('problem solving'), wp('problem-solving')] },
      { name: 'Tour Operator',         patterns: [wp('tour operator'), wp('tour operators')] },
      { name: 'Booking Systems',       patterns: [wp('booking system'), wp('reservation'), wp('prenotazione'), wp('gds')] },
    ],
  },

  // ── 6. GENERAL BUSINESS (fallback) ───────────────────────────────────────
  {
    id: 'general-business',
    label: 'General Business',
    detectionKeywords: [
      'coordinator', 'operations manager', 'business analyst', 'human resources',
      'accounting', 'procurement', 'customer service', 'office manager', 'hr manager',
      'business development', 'sales manager', 'finance manager',
    ],
    skills: [
      { name: 'Project Management', patterns: [wp('project management'), wp('gestione progetti'), wp('pm')] },
      { name: 'Communication',      patterns: [wp('communication'), wp('comunicazione')] },
      { name: 'Problem Solving',    patterns: [wp('problem solving'), wp('problem-solving')] },
      { name: 'Workflow Management',patterns: [wp('workflow management'), wp('workflow')] },
      { name: 'Client Relations',   patterns: [wp('client relations'), wp('customer relations'), wp('relazioni clienti')] },
      { name: 'Organization',       patterns: [wp('organization'), wp('organizzazione')] },
      { name: 'Data Analysis',      patterns: [wp('data analysis'), wp('analisi dati')] },
      { name: 'Reporting',          patterns: [wp('reporting')] },
      { name: 'Team Management',    patterns: [wp('team management'), wp('gestione team'), wp('leadership')] },
      { name: 'Budget Management',  patterns: [wp('budget management'), wp('budget')] },
      { name: 'Negotiation',        patterns: [wp('negotiation'), wp('negoziazione')] },
      { name: 'Microsoft Office',   patterns: [wp('microsoft office'), wp('excel'), wp('powerpoint')] },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ROLE-TITLE KEYWORDS (dominant signal — checked only against the role field)
// ─────────────────────────────────────────────────────────────────────────────
// These are professional-title phrases. A match in the ROLE field scores ×20,
// making it impossible for CV skill noise to flip the category.
// Order within each array: specific phrases first, generic terms last.

const ROLE_KEYWORDS: Readonly<Record<CategoryId, readonly string[]>> = {
  tech: [
    // AI / ML roles — common career transition targets
    'ai developer', 'ai engineer', 'ai specialist', 'ai analyst', 'ai researcher',
    'ai trainer', 'ai consultant', 'ai manager', 'ai lead', 'ai solutions',
    'ai product manager', 'ai product designer', 'ai product',
    'ai ux designer', 'ai ui designer', 'ai designer',
    'machine learning engineer', 'ml engineer',
    'llm engineer', 'prompt engineer', 'solutions architect', 'solutions manager',
    'technical solutions manager', 'data scientist', 'data engineer',
    // Classic tech roles
    'software engineer', 'software developer', 'frontend engineer',
    'backend engineer', 'fullstack engineer', 'full stack engineer',
    'angular developer', 'react developer', 'vue developer',
    'web developer', 'mobile developer', 'ios developer', 'android developer',
    'cloud engineer', 'devops engineer', 'tech lead',
    'developer', 'frontend', 'backend', 'fullstack', 'full stack',
    'programmer', 'devops',
  ],
  'content-creator': [
    // Corporate content roles (most specific first)
    'content specialist', 'content strategist', 'content strategy specialist',
    'content writer', 'content editor', 'content lead', 'content manager',
    'copywriter', 'copy specialist', 'copywriting specialist',
    'editorial specialist', 'editorial manager', 'editorial lead',
    'social media manager', 'social media specialist', 'social media coordinator',
    'brand content specialist', 'digital content specialist',
    // Creator economy roles
    'content creator', 'ugc creator', 'social media creator',
    'video creator', 'content producer', 'ugc',
    'influencer', 'creator',
  ],
  marketing: [
    'marketing specialist', 'marketing manager', 'marketing coordinator',
    'digital marketing manager', 'digital marketing specialist',
    'brand manager', 'brand strategist', 'growth marketer', 'growth hacker',
    'campaign manager', 'seo specialist', 'seo manager',
    'sem specialist', 'email marketing specialist', 'community manager',
    'content marketing manager', 'content marketing specialist',
    'digital marketing', 'content marketing',
    'marketing',  // generic catch-all — must be last
  ],
  'design-ux': [
    'ux designer', 'ui designer', 'product designer',
    'visual designer', 'graphic designer', 'ux researcher',
    'design lead', 'interaction designer',
  ],
  'travel-hospitality': [
    'travel designer', 'travel consultant', 'travel manager', 'travel agent',
    'hospitality manager', 'tour operator',
    'travel', 'hospitality', 'tourism',
  ],
  'general-business': [
    'operations manager', 'hr manager', 'human resources manager',
    'business analyst', 'account manager', 'project manager',
    'office manager', 'sales manager', 'finance manager',
    'business development manager', 'coordinator',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Detects the most likely professional category.
 *
 * Weighting (prevents CV skill noise from overriding the desired role):
 *   role field  — role-title keywords  → ×30 per match (dominant signal)
 *   job offer   — context keywords     → ×2  per match
 *   cv          — context keywords     → ×1  per match
 *
 * Falls back to 'general-business' when no category reaches a positive score.
 */
export function detectCategory(role: string, jobOffer: string, cv: string): CategoryId {
  const roleLower = role.toLowerCase();
  const jobLower  = jobOffer.toLowerCase();
  const cvLower   = cv.toLowerCase();

  let best: CategoryId = 'general-business';
  let bestScore = 0;

  for (const cat of CAREER_CATEGORIES.filter(c => c.id !== 'general-business')) {
    let score = 0;

    // Role-title keywords: dominant weight (×30)
    for (const kw of ROLE_KEYWORDS[cat.id]) {
      if (roleLower.includes(kw)) score += 30;
    }

    // Job offer context keywords: medium weight (×2)
    for (const kw of cat.detectionKeywords) {
      if (jobLower.includes(kw)) score += 2;
    }

    // CV context keywords: weak weight (×1) — cannot override a role match
    for (const kw of cat.detectionKeywords) {
      if (cvLower.includes(kw)) score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      best = cat.id;
    }
  }

  return best;
}

/** Extracts skill names found in `text` using the patterns for the given category. */
export function extractSkillsForCategory(text: string, categoryId: CategoryId): string[] {
  const cat = CAREER_CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return [];
  return cat.skills
    .filter(def => def.patterns.some(p => p.test(text)))
    .map(def => def.name);
}

/** Returns the human-readable Italian label for a category ID. */
export function getCategoryLabel(id: CategoryId): string {
  return CAREER_CATEGORIES.find(c => c.id === id)?.label ?? 'General Business';
}

/** Returns all skill display names defined for a category (used by Career Coach gap analysis). */
export function getAllCategorySkillNames(id: CategoryId): string[] {
  return CAREER_CATEGORIES.find(c => c.id === id)?.skills.map(s => s.name) ?? [];
}

/**
 * Detects the most likely TARGET category from the goal string alone.
 * Uses ×40 weight on role-title keywords and ×8 on detection keywords —
 * much higher than detectCategory() — so the career goal always dominates
 * over background noise. Falls back to 'general-business' if no signal found.
 *
 * Use this in Career Coach mode to answer "where does this person WANT to go?"
 */
export function detectCategoryFromGoal(goal: string): CategoryId {
  const goalLower = goal.toLowerCase();
  let best: CategoryId = 'general-business';
  let bestScore = 0;

  for (const cat of CAREER_CATEGORIES.filter(c => c.id !== 'general-business')) {
    let score = 0;

    // Role-title keyword hit: ×40 (dominant signal)
    for (const kw of ROLE_KEYWORDS[cat.id]) {
      if (goalLower.includes(kw)) score += 40;
    }

    // Detection keyword hit in goal: ×8 (supporting signal)
    for (const kw of cat.detectionKeywords) {
      if (goalLower.includes(kw)) score += 8;
    }

    if (score > bestScore) {
      bestScore = score;
      best = cat.id;
    }
  }

  return best;
}
