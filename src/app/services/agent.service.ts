
import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { JobApplication } from '../models/job-application.model';
import { AnalysisResult, AnalysisGrade } from '../models/analysis-result.model';
import { AgentInsight } from '../models/agent.model';
import {
  CareerCoachInput,
  CareerCoachResult,
  RoadmapItem
} from '../models/career-coach.model';
import {
  CategoryId,
  detectCategory,
  detectCategoryFromGoal,
  extractSkillsForCategory,
  getCategoryLabel,
  getAllCategorySkillNames,
} from '../utils/career-categories';

// ─── localStorage keys ───────────────────────────────────────

const LS_ANALYSIS_KEY = 'ah_analysis_history';
const LS_COACH_KEY = 'ah_coach_history';
const LS_MAX_ITEMS = 20;

// ─── Tech project ideas ──────────────────────────────────────

const TECH_PROJECT_IDEAS: Record<string, string> = {
  'Angular': 'Crea una SPA Angular con lazy loading, routing guards e stato gestito con NgRx.',
  'React': "Sviluppa un'app React con hooks personalizzati, Context API e test con React Testing Library.",
  'Vue': "Costruisci un'app Vue 3 con Composition API, Pinia come store e TypeScript strict.",
  'TypeScript': 'Implementa una libreria TypeScript con generics avanzati, utility types e documentazione JSDoc.',
  'Node.js': "Sviluppa un'API REST con Node.js, autenticazione JWT e documentazione Swagger/OpenAPI.",
  'Python': "Crea uno script di automazione dati o un'API REST con FastAPI e validazione Pydantic.",
  'Docker': 'Containerizza una web app fullstack e configura docker-compose per ambienti dev e prod.',
  'Kubernetes': 'Crea un cluster Kubernetes locale con Minikube, deploy multi-container e Helm chart.',
  'AWS': "Fai il deploy di un'app serverless su AWS Lambda con API Gateway e CI/CD pipeline.",
  'GCP': 'Implementa un progetto su Google Cloud con Cloud Run, Firestore e autenticazione Google.',
  'Azure': "Crea un'app su Azure App Service con Azure DevOps per build e deploy automatico.",
  'CI/CD': 'Configura una pipeline GitHub Actions completa: lint, test, build, Docker push e deploy.',
  'SQL': 'Progetta un database relazionale con schema normalizzato, query ottimizzate e viste materializzate.',
  'PostgreSQL': "Costruisci un'app con PostgreSQL: indici avanzati, full-text search e aggregazioni complesse.",
  'MongoDB': "Sviluppa un'API REST con Express e MongoDB usando Mongoose, validazione e aggregation pipeline.",
  'Firebase': "Crea un'app real-time con Firebase Realtime DB o Firestore, auth e Cloud Functions.",
  'GraphQL': 'Implementa un server GraphQL con Apollo Server, subscriptions real-time e DataLoader per batching.',
  'REST API': 'Crea una REST API documentata con rate limiting, autenticazione, versioning e test di integrazione.',
  'Machine Learning': "Addestra un modello ML per classificazione o regressione e pubblicalo tramite un'API FastAPI.",
  'Deep Learning': 'Costruisci e addestra una rete neurale con PyTorch o TensorFlow su un dataset pubblico.',
  'Prompt Engineering': "Costruisci un'app che usa LLM con tecniche di prompting avanzate e chain of thought.",
  'TDD': 'Implementa un modulo da zero seguendo il ciclo TDD red-green-refactor con copertura >90%.',
  'Microservices': 'Architetta un sistema a microservizi con comunicazione via REST/gRPC e service discovery.',

  // Content Creator / Specialist skill suggestions

  'Content Strategy': 'Sviluppa una content strategy per un brand o progetto: obiettivi, target, piano editoriale e metriche di successo.',
  'Copywriting': 'Scrivi 5 copy diversi (headline, email, social post, landing page, descrizione prodotto) e documentali come portfolio.',
  'Brand Voice': "Definisci la brand voice per un brand esistente o fittizio: tono, valori, do/don't con esempi concreti.",
  'Editorial Planning': 'Costruisci un piano editoriale mensile con topic pillar, formato, canale e obiettivo per ogni contenuto.',
  'Storytelling': 'Scrivi 3 case study di storytelling aziendale: problema, soluzione, risultato con dati reali o simulati.',
  'Social Media': 'Crea un piano social su 30 giorni con contenuti, caption e obiettivi di engagement per ogni post.',
  'Analytics': "Analizza le performance di una pagina/canale reale o di test e produci un report con insight e raccomandazioni.",
  'Community Management': 'Gestisci una community reale o fittizia per 30 giorni: definisci linee guida, moderazione e piano di engagement.',
  'Newsletter': 'Progetta e lancia una newsletter: template, contenuto editoriale, call-to-action e piano di crescita abbonati.',
  'SEO': 'Conduci un audit SEO di un sito reale: keyword research, analisi on-page e piano di ottimizzazione.',

  // Marketing skill suggestions

  'Digital Marketing': 'Progetta una campagna digital end-to-end: obiettivo, canali, budget simulato, creatività e metriche.',
  'Email Marketing': 'Crea una sequenza email di 5 messaggi per un funnel reale: benvenuto, nurturing, offerta, follow-up.',
  'Campaign Management': 'Documenta la gestione di una campagna: brief, pianificazione, esecuzione, risultati e ottimizzazioni.',
  'Google Analytics': 'Configura GA4 su un sito reale o di test, definisci eventi key e produci un report mensile.',
  'Content Marketing': 'Sviluppa una strategia di content marketing con 3 formati diversi e misura le performance su 30 giorni.',
  'Brand Strategy': "Crea un documento di brand strategy per un'azienda: positioning, proposta di valore, tone of voice e visual direction.",
  'A/B Testing': 'Progetta e documenta un A/B test su email subject line, landing page o CTA con ipotesi e risultati.',
};

// ─── Category-specific portfolio extras ─────────────────────

const CATEGORY_PORTFOLIO_EXTRAS: Record<string, string[]> = {
  'tech': [
    'Inserisci metriche concrete nei README: performance, copertura test, riduzione bug.',
    'Documenta le scelte architetturali con ADR per mostrare seniorità tecnica.',
  ],
  'content-creator': [
    'Documenta la tua strategia editoriale con obiettivi, tone of voice e piano di distribuzione.',
    'Crea un case study di un progetto content: brief, produzione, metriche e risultati.',
    'Costruisci un portfolio editoriale con 3-5 esempi del tuo lavoro: articoli, copy, campagne o post.',
  ],
  'marketing': [
    'Documenta una campagna end-to-end: obiettivi, strategia, esecuzione e risultati.',
    "Pubblica un'analisi SEO o digital di un brand noto con dati e takeaway concreti.",
    'Crea un portfolio con screenshot di dashboard e metriche chiave raggiunte.',
  ],
  'design-ux': [
    'Crea un case study UX completo: ricerca utenti, wireframes, test usabilità e iterazioni.',
    'Pubblica il tuo processo di design per un progetto reale spiegando ogni scelta.',
    'Costruisci e documenta un design system completo con componenti e linee guida.',
  ],
  'travel-hospitality': [
    'Crea un itinerario di viaggio premium come sample del tuo approccio professionale.',
    'Documenta un processo di gestione cliente dalla richiesta alla realizzazione.',
    'Pubblica testimonianze di clienti soddisfatti per costruire credibilità.',
  ],
  'general-business': [
    'Documenta un progetto gestito: obiettivi, team, timeline e risultati.',
    "Pubblica un case study di problem solving con impatto misurabile sul business.",
    'Crea una presentazione executive che mostri le tue capacità comunicative.',
  ],
};

// ─── Career Coach: roadmaps ──────────────────────────────────

const COACH_ROADMAPS: Record<CategoryId, RoadmapItem[]> = {
  'tech': [
    {
      period: '30 giorni',
      actions: [
        'Scegli un framework primario (Angular, React o Vue) e completa un tutorial end-to-end',
        'Configura ambiente di sviluppo con Git, VS Code e Node.js',
        'Avvia il progetto personale: idea, repo GitHub, prima versione funzionante',
        'Completa 10 esercizi di algoritmi base (Exercism o LeetCode)',
      ],
    },
    {
      period: '60 giorni',
      actions: [
        'Completa e pubblica il progetto su GitHub con README curato e demo live',
        'Studia TypeScript strict e i pattern avanzati del framework scelto',
        'Aggiungi tecnologia backend al portfolio (Node.js o Python + FastAPI)',
        'Inizia a contribuire a un progetto open-source, anche con una piccola PR',
      ],
    },
    {
      period: '90 giorni',
      actions: [
        'Costruisci un progetto fullstack con frontend + API + database',
        'Prepara portfolio con 3 progetti documentati con case study e metriche',
        'Fai networking attivo su LinkedIn, community tech, eventi o hackathon locali',
        'Candida per i primi ruoli junior o inizia a fare colloqui di pratica',
      ],
    },
  ],

  'marketing': [
    {
      period: '30 giorni',
      actions: [
        'Ottieni la certificazione Google Analytics 4 (gratuita su Skillshop)',
        'Analizza 3 campagne di brand competitor e documenta gli insight chiave',
        'Avvia un progetto personale di content marketing (blog, newsletter o canale social)',
        'Studia le basi di SEO con Ahrefs Academy o Semrush Academy',
      ],
    },
    {
      period: '60 giorni',
      actions: [
        'Ottieni la certificazione Google Ads Search (gratuita su Skillshop)',
        'Lancia una campagna email reale e documenta risultati concreti con numeri',
        'Crea un caso studio di marketing end-to-end: obiettivo, strategia, esecuzione',
        'Esplora strumenti di marketing automation (Mailchimp, HubSpot gratuito)',
      ],
    },
    {
      period: '90 giorni',
      actions: [
        'Costruisci un portfolio con screenshot di dashboard e KPI raggiunti',
        'Approfondisci un canale verticale: SEO, SEM, email marketing o social ads',
        'Fai networking attivo su LinkedIn con professionisti del settore marketing',
        'Candida per ruoli junior, internship o posizioni in agenzia',
      ],
    },
  ],

  'content-creator': [
    {
      period: '30 giorni',
      actions: [
        'Definisci la tua nicchia di contenuto e il tuo stile comunicativo unico',
        'Pubblica almeno 12 contenuti sulla piattaforma primaria (TikTok, Instagram o YouTube)',
        "Studia l'algoritmo della piattaforma scelta e configura le analytics",
        'Inizia a sviluppare il tuo tono di voce e visual identity coerente',
      ],
    },
    {
      period: '60 giorni',
      actions: [
        'Crea il tuo primo media kit con metriche reali e audience persona',
        'Realizza il primo UGC o branded content (anche pro bono per il portfolio)',
        'Sperimenta con formati diversi: Reels, Stories, Short-form video, caroselli',
        'Avvia conversazioni con brand locali o piccoli per prime collaborazioni',
      ],
    },
    {
      period: '90 giorni',
      actions: [
        'Raggiungi 1.000+ follower organici sulla piattaforma principale',
        'Documenta la tua strategia editoriale per dimostrare professionalità ai brand',
        'Chiudi la prima collaborazione a pagamento o UGC retribuito',
        'Valuta espansione su seconda piattaforma con contenuti cross-platform',
      ],
    },
  ],

  'design-ux': [
    {
      period: '30 giorni',
      actions: [
        'Porta Figma al livello intermedio: auto layout, componenti, variables e styles',
        'Analizza 3 prodotti digitali noti e scrivi critique strutturate di usabilità',
        'Completa 15 esercizi Daily UI per costruire velocità e varietà visiva',
        'Studia la metodologia UX: Double Diamond, Jobs to Be Done e HCD',
      ],
    },
    {
      period: '60 giorni',
      actions: [
        'Conduci la prima sessione di user research con 3-5 partecipanti reali',
        'Progetta un case study UX completo: problema, ricerca, wireframe, test, iterazione',
        'Costruisci un piccolo design system personale (tipografia, colori, componenti base)',
        'Inizia a condividere il lavoro su Behance o Dribbble per visibilità',
      ],
    },
    {
      period: '90 giorni',
      actions: [
        'Porta il case study a livello portfolio-ready con presentazione executive',
        'Fai peer review su ADPList o community UX per feedback bidirezionale',
        'Prepara portfolio con 2-3 case study documentati con process walk-through',
        'Candida per primi ruoli junior UX/UI o inizia a lavorare come freelance',
      ],
    },
  ],

  'travel-hospitality': [
    {
      period: '30 giorni',
      actions: [
        'Analizza 3 itinerari premium o di lusso e studia la struttura dettagliata',
        'Aggiorna il profilo LinkedIn con focus specifico sul settore travel',
        'Contatta 2-3 DMC, travel agency o strutture hospitality per capire opportunità',
        'Ottieni o aggiorna certificazioni di destinazione (IATA Foundation o partner)',
      ],
    },
    {
      period: '60 giorni',
      actions: [
        'Crea un itinerario sample completo per una destinazione che conosci a fondo',
        'Documenta il tuo processo ideale di gestione cliente: dalla richiesta al follow-up',
        'Costruisci relazioni LinkedIn con travel designer e hospitality manager',
        'Partecipa a webinar o eventi di settore (fiere travel, TTG, workshop)',
      ],
    },
    {
      period: '90 giorni',
      actions: [
        'Costruisci portfolio con almeno 2 itinerari premium o esperienze curate',
        'Cerca esperienza pratica: stage, assistenza a un travel designer o freelance',
        'Sviluppa la tua proposta di valore differenziante nel settore',
        'Candida per posizioni junior o inizia a offrire consulenza travel',
      ],
    },
  ],

  'general-business': [
    {
      period: '30 giorni',
      actions: [
        'Mappa le competenze chiave del ruolo target e identifica i gap specifici',
        'Inizia una certificazione in project management (CAPM, Google PM o Coursera)',
        'Avvia un progetto personale o di volontariato da gestire end-to-end',
        'Studia Excel avanzato o Power BI per rafforzare le competenze analitiche',
      ],
    },
    {
      period: '60 giorni',
      actions: [
        'Completa un corso di analisi dati business (Google Data Studio o Power BI)',
        'Documenta una situazione reale di problem solving come case study strutturato',
        'Fai networking attivo su LinkedIn nei gruppi del settore target',
        'Cerca un mentore nel settore tramite ADPList (gratuito e accessibile)',
      ],
    },
    {
      period: '90 giorni',
      actions: [
        'Prepara un portfolio professionale con progetti e risultati misurabili',
        'Identifica 10-15 aziende target e avvia contatti diretti su LinkedIn',
        'Ottieni referenza o testimonianza da un progetto completato con successo',
        'Candida per ruoli junior, stage o internship nel settore target',
      ],
    },
  ],
};

// ─── Career Coach: azioni prioritarie ────────────────────────

const COACH_PRIORITY_ACTIONS: Record<CategoryId, string[]> = {
  'tech': [
    'Costruisci il tuo GitHub con almeno 3 progetti pratici con README curati e demo',
    'Inizia a costruire in pubblico su LinkedIn: condividi il tuo percorso di apprendimento',
    'Partecipa a una community tech attiva: meetup, Discord o forum specializzato',
    'Ottieni una certificazione riconosciuta (AWS, Google Cloud o corso Coursera con badge)',
  ],
  'marketing': [
    'Ottieni le certificazioni Google Analytics 4 e Google Ads Search come base credenziale',
    'Crea un portfolio digitale con almeno un case study con dati e risultati numerici',
    'Avvia un progetto marketing personale misurabile (blog, newsletter, campagna)',
    'Costruisci una rete di contatti nel settore con interazioni di qualità su LinkedIn',
  ],
  'content-creator': [
    'Pubblica in modo consistente per 30 giorni consecutivi senza interrompere il ritmo',
    'Crea il tuo media kit professionale con dati reali e audience persona dettagliata',
    'Analizza i creator di riferimento nella tua nicchia e studia la loro strategia',
    'Esegui il primo contenuto sponsorizzato o UGC, anche come test gratuito',
  ],
  'design-ux': [
    'Costruisci almeno un case study UX completo con ricerca utenti e iterazioni',
    'Condividi il lavoro attivamente su Behance, Dribbble o portfolio personale online',
    'Richiedi feedback da designer senior tramite ADPList (gratuito e accessibile)',
    'Partecipa a una sfida di design (Daily UI, hackathon UX) per accelerare il portfolio',
  ],
  'travel-hospitality': [
    'Crea un itinerario premium dettagliato per una destinazione specifica',
    'Ottieni la certificazione IATA Foundation o una certificazione destinazione rilevante',
    'Connettiti con travel designer e hospitality manager su LinkedIn in modo proattivo',
    'Cerca una esperienza pratica nel settore, anche breve o non retribuita',
  ],
  'general-business': [
    'Identifica 3 aziende target e studia il loro business e la cultura aziendale',
    'Ottieni una certificazione riconosciuta nel tuo settore target (PM, HR, Finance)',
    'Crea un caso studio di problem solving con impatto e risultati misurabili',
    'Avvia conversazioni su LinkedIn con professionisti nel ruolo target desiderato',
  ],
};

// ─── Career Coach: insight motivazionale ─────────────────────

const COACH_MOTIVATIONAL: Record<CategoryId, string> = {
  'tech': "Il tech è uno dei pochi settori dove il portfolio conta più del titolo di studio. Ogni progetto che costruisci è prova tangibile di ciò che sai fare — non aspettare la perfezione, pubblica e itera. I developer più forti non sono quelli che sanno tutto, ma quelli che imparano più velocemente. Il tuo percorso di transizione è un vantaggio reale: porti prospettive che chi è sempre stato in tech semplicemente non ha.",
  'marketing': "Il marketing moderno premia chi sa unire creatività e dati. La tua capacità di pensare per sistemi, misurare l'impatto e adattare la strategia è ciò che separa un esecutore da un marketer strategico. Ogni progetto — anche piccolo — è un esperimento: documenta, misura, impara. I recruiter nel marketing vogliono vedere numeri reali, anche su scala ridotta, che dimostrino che sai muovere l'ago.",
  'content-creator': "Nel creator economy, la coerenza batte il talento. I creator che ce la fanno non sono necessariamente i più creativi, ma quelli che si mostrano ogni giorno e imparano dai dati. La tua storia personale, il tuo punto di vista unico, la tua voce autentica: queste sono le risorse più difficili da copiare. Parti piccolo, sii consistente, costruisci la community un contatto autentico alla volta.",
  'design-ux': "Il design è empatia tradotta in forma visiva. La tua capacità di ascoltare gli utenti, tradurre bisogni in soluzioni e comunicare le scelte con chiarezza è ciò che un buon designer ha in più rispetto al semplice tool user. I case study sono il tuo portfolio di pensiero: mostrano non solo cosa hai fatto, ma come hai ragionato. Ogni critica ricevuta è carburante per migliorare, non un ostacolo.",
  'travel-hospitality': "Nel travel e nell'hospitality, l'eccellenza si trova nei dettagli che il cliente non vede ma sente profondamente. La tua capacità di anticipare i bisogni, risolvere imprevisti con eleganza e costruire fiducia nel tempo è un'arte rara e molto richiesta. I migliori travel designer non vendono vacanze: vendono trasformazioni. La tua prospettiva fresca è spesso ciò che manca nelle agenzie consolidate.",
  'general-business': "Il business è, in fondo, problem solving con persone e risorse limitate. Le competenze trasversali che hai sviluppato — comunicazione, organizzazione, capacità di collaborare sotto pressione — sono fondamenta solide su cui costruire la specializzazione verticale. Non sottovalutare ciò che hai già: la transizione non è ricominciare da zero, ma reindirizzare competenze esistenti verso un nuovo contesto con intenzione.",
};

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  private readonly authService = inject(AuthService);

  private latestResult: AnalysisResult | null = null;
  private latestCoachResult: CareerCoachResult | null = null;
  private activeUserId: number | null = null;

  // ─── Gestione account ──────────────────────────────────────

  private syncAccount(): void {
    const userId = this.authService.getUserId();

    if (this.activeUserId !== userId) {
      this.latestResult = null;
      this.latestCoachResult = null;
      this.activeUserId = userId;
    }
  }

  private requireUserId(): number {
    this.syncAccount();

    const userId = this.authService.getUserId();

    if (userId === null) {
      throw new Error(
        'Effettua l’accesso prima di salvare un’analisi.'
      );
    }

    return userId;
  }

  private scopedKey(key: string): string | null {
    this.syncAccount();

    const userId = this.authService.getUserId();

    return userId === null
      ? null
      : `${key}_user_${userId}`;
  }

  // ─── ANALISI CANDIDATURA ───────────────────────────────────

  async simulateAnalysis(
    application: JobApplication
  ): Promise<AnalysisResult> {

    const startedBy = this.requireUserId();

    await new Promise(resolve => setTimeout(resolve, 1800));

    const categoryId = detectCategory(
      application.role,
      application.jobOffer,
      application.candidateCv,
    );

    const categoryLabel = getCategoryLabel(categoryId);

    const jobSkills = extractSkillsForCategory(
      application.jobOffer + ' ' + application.role,
      categoryId,
    );

    const cvSkills = extractSkillsForCategory(
      application.candidateCv,
      categoryId
    );

    const bonus = this.computeBonus(application, jobSkills);

    const score = this.generateMatchScore(
      jobSkills,
      cvSkills,
      bonus
    );

    const missing = this.generateMissingSkills(
      jobSkills,
      cvSkills
    );

    const letter = this.generateCoverLetter(
      application,
      cvSkills,
      categoryId
    );

    const suggestions = this.generatePortfolioSuggestions(
      missing,
      application.role,
      categoryId
    );

    const result: AnalysisResult = {
      id: Date.now().toString(),
      application,
      matchScore: score,
      grade: this.scoreToGrade(score),
      detectedCategory: categoryLabel,
      detectedCategoryId: categoryId,
      detectedSkills: cvSkills,
      requiredSkills: jobSkills,
      missingSkills: missing,
      coverLetter: letter,
      portfolioSuggestions: suggestions,
      agentInsights: this.buildAgentInsights(
        score,
        cvSkills,
        jobSkills,
        missing,
        application.role,
        categoryId
      ),
      analyzedAt: new Date(),
    };

    if (this.authService.getUserId() !== startedBy) {
      throw new Error(
        'Sessione cambiata durante l’analisi: risultato non salvato.'
      );
    }

    this.latestResult = result;

    this.saveToLocalStorage(LS_ANALYSIS_KEY, result);

    return result;
  }

  extractSkills(
    role: string,
    jobOffer: string,
    cv: string
  ): string[] {
    return extractSkillsForCategory(
      cv,
      detectCategory(role, jobOffer, cv)
    );
  }

  generateMatchScore(
    jobSkills: string[],
    cvSkills: string[],
    bonus = 0
  ): number {

    if (jobSkills.length === 0) {
      return Math.min(
        97,
        Math.floor(Math.random() * 20) + 55 + bonus
      );
    }

    const cvSet = new Set(
      cvSkills.map(s => s.toLowerCase())
    );

    const matches = jobSkills.filter(
      s => cvSet.has(s.toLowerCase())
    ).length;

    const base = Math.round(
      (matches / jobSkills.length) * 100
    );

    const delta = Math.floor(Math.random() * 12) - 6;

    return Math.min(
      97,
      Math.max(38, base + delta + bonus)
    );
  }

  generateMissingSkills(
    jobSkills: string[],
    cvSkills: string[]
  ): string[] {

    const cvSet = new Set(
      cvSkills.map(s => s.toLowerCase())
    );

    return jobSkills
      .filter(s => !cvSet.has(s.toLowerCase()))
      .slice(0, 6);
  }

  generateCoverLetter(
    application: JobApplication,
    cvSkills: string[],
    category: CategoryId
  ): string {

    const { role, portfolioUrl } = application;

    const topSkills = cvSkills.slice(0, 5);

    const highlight = topSkills.length > 0
      ? topSkills.join(', ')
      : 'strumenti e metodologie del settore';

    const topTwo = topSkills.slice(0, 2).join(' e ')
      || 'competenze chiave';

    const portfolioLine = portfolioUrl?.trim()
      ? `\n\nPuoi consultare esempi concreti del mio lavoro su: ${portfolioUrl.trim()}`
      : '';

    const { para1, para2 } = this.buildLetterBody(
      category,
      highlight,
      topTwo
    );

    return `Gentile Team di Selezione,

Vi scrivo per candidarmi con entusiasmo alla posizione di ${role}. ${para1}

${para2} Sono abituato/a a lavorare in ambienti dinamici, con forte attenzione ai dettagli e ai risultati concreti.

Questa opportunità mi interessa in modo particolare perché si allinea con la mia direzione di crescita professionale e mi permetterebbe di contribuire in modo significativo ai vostri obiettivi.${portfolioLine}

Sono disponibile per un colloquio in qualsiasi momento conveniente per voi.

Grazie per l'attenzione e la disponibilità.

Cordiali saluti`;
  }

  generatePortfolioSuggestions(
    missingSkills: string[],
    role: string,
    category: CategoryId
  ): string[] {

    const skillSuggestions = missingSkills
      .slice(0, 3)
      .map(skill => {

        const tech = TECH_PROJECT_IDEAS[skill];

        if (tech) {
          return tech;
        }

        return `Acquisisci esperienza pratica in ${skill} e documentala nel tuo portfolio con un progetto reale.`;
      });

    const extras =
      CATEGORY_PORTFOLIO_EXTRAS[category]
      ?? CATEGORY_PORTFOLIO_EXTRAS['general-business'];

    const roleExtra =
      `Aggiungi un case study "${role}" al portfolio: obiettivi, approccio e risultati ottenuti.`;

    return [
      roleExtra,
      ...skillSuggestions,
      ...extras
    ].slice(0, 5);
  }

  getLatestResult(): AnalysisResult | null {

    this.syncAccount();

    if (!this.latestResult) {
      const history = this.getAnalysisHistory();

      if (history.length > 0) {
        this.latestResult = history[0] as AnalysisResult;
      }
    }

    return this.latestResult;
  }

  // ─── CAREER COACH ──────────────────────────────────────────

  async simulateCareerCoach(
    input: CareerCoachInput
  ): Promise<CareerCoachResult> {

    const startedBy = this.requireUserId();

    await new Promise(resolve => setTimeout(resolve, 1800));

    // TARGET: rileva settore OBIETTIVO dal solo campo goal
    const targetCategoryId = detectCategoryFromGoal(
      input.goal
    );

    // SOURCE: rileva settore attuale dal background
    const sourceCategoryId = detectCategory(
      '',
      input.background,
      input.currentSkills
    );

    const targetCategoryLabel = getCategoryLabel(
      targetCategoryId
    );

    const sourceCategoryLabel = getCategoryLabel(
      sourceCategoryId
    );

    const candidateText = [
      input.goal,
      input.background,
      input.currentSkills
    ].join(' ');

    const transferableSkills = extractSkillsForCategory(
      candidateText,
      targetCategoryId
    );

    const allTargetSkills = getAllCategorySkillNames(
      targetCategoryId
    );

    const transferableSet = new Set(
      transferableSkills.map(s => s.toLowerCase())
    );

    const missingSkills = allTargetSkills
      .filter(s => !transferableSet.has(s.toLowerCase()))
      .slice(0, 8);

    const roadmap = COACH_ROADMAPS[targetCategoryId];

    const priorityActions =
      COACH_PRIORITY_ACTIONS[targetCategoryId];

    const motivationalInsight =
      COACH_MOTIVATIONAL[targetCategoryId];

    const portfolioSuggestions =
      this.generatePortfolioSuggestions(
        missingSkills.slice(0, 3),
        input.goal,
        targetCategoryId
      );

    const agentInsights = this.buildCoachAgentInsights(
      input,
      sourceCategoryId,
      sourceCategoryLabel,
      targetCategoryId,
      targetCategoryLabel,
      transferableSkills,
      missingSkills,
      roadmap,
      portfolioSuggestions
    );

    const result: CareerCoachResult = {
      id: Date.now().toString(),
      input,
      sourceCategoryId,
      sourceCategoryLabel,
      targetCategoryId,
      targetCategoryLabel,
      transferableSkills,
      missingSkills,
      roadmap,
      portfolioSuggestions,
      priorityActions,
      motivationalInsight,
      agentInsights,
      analyzedAt: new Date(),
    };

    if (this.authService.getUserId() !== startedBy) {
      throw new Error(
        'Sessione cambiata durante l’analisi: risultato non salvato.'
      );
    }

    this.latestCoachResult = result;

    this.saveToLocalStorage(LS_COACH_KEY, result);

    return result;
  }

  getLatestCoachResult(): CareerCoachResult | null {

    this.syncAccount();

    if (!this.latestCoachResult) {
      const history = this.getCoachHistory();

      if (history.length > 0) {
        this.latestCoachResult = history[0] as CareerCoachResult;
      }
    }

    return this.latestCoachResult;
  }

  getAnalysisHistory(): AnalysisResult[] {
    return this.loadFromLocalStorage<AnalysisResult>(
      LS_ANALYSIS_KEY
    );
  }

  getCoachHistory(): CareerCoachResult[] {
    return this.loadFromLocalStorage<CareerCoachResult>(
      LS_COACH_KEY
    );
  }

  // ─── Archivio ──────────────────────────────────────────────

  setLatestResult(result: AnalysisResult): void {
    this.requireUserId();
    this.latestResult = result;
  }

  setLatestCoachResult(result: CareerCoachResult): void {
    this.requireUserId();
    this.latestCoachResult = result;
  }

  deleteAnalysisFromHistory(id: string): void {

    const key = this.scopedKey(LS_ANALYSIS_KEY);

    if (!key) {
      return;
    }

    const items = this.loadFromLocalStorage<{ id: string }>(
      LS_ANALYSIS_KEY
    );

    try {
      localStorage.setItem(
        key,
        JSON.stringify(
          items.filter(item => item.id !== id)
        )
      );

      if (this.latestResult?.id === id) {
        this.latestResult = null;
      }

    } catch {
      // Storage non disponibile
    }
  }

  deleteCoachFromHistory(id: string): void {

    const key = this.scopedKey(LS_COACH_KEY);

    if (!key) {
      return;
    }

    const items = this.loadFromLocalStorage<{ id: string }>(
      LS_COACH_KEY
    );

    try {
      localStorage.setItem(
        key,
        JSON.stringify(
          items.filter(item => item.id !== id)
        )
      );

      if (this.latestCoachResult?.id === id) {
        this.latestCoachResult = null;
      }

    } catch {
      // Storage non disponibile
    }
  }

  // ─── PRIVATE HELPERS ───────────────────────────────────────

  private saveToLocalStorage<T>(
    key: string,
    item: T
  ): void {

    const scoped = this.scopedKey(key);

    if (!scoped) {
      return;
    }

    try {
      const existing = this.loadFromLocalStorage<T>(key);

      const updated = [
        item,
        ...existing
      ].slice(0, LS_MAX_ITEMS);

      localStorage.setItem(
        scoped,
        JSON.stringify(updated)
      );

    } catch {
      // Storage non disponibile
    }
  }

  private loadFromLocalStorage<T>(key: string): T[] {

    const scoped = this.scopedKey(key);

    if (!scoped) {
      return [];
    }

    try {

      const parsed: unknown = JSON.parse(
        localStorage.getItem(scoped) || '[]'
      );

      return Array.isArray(parsed)
        ? parsed as T[]
        : [];

    } catch {
      return [];
    }
  }

  private computeBonus(
    application: JobApplication,
    jobSkills: string[]
  ): number {

    let bonus = 0;

    if (application.portfolioUrl?.trim()) {
      bonus += 5;
    }

    const roleLower = application.role.toLowerCase();

    if (
      jobSkills.some(s =>
        roleLower.includes(s.toLowerCase())
      )
    ) {
      bonus += 3;
    }

    return bonus;
  }

  private scoreToGrade(score: number): AnalysisGrade {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 55) return 'Fair';
    return 'Poor';
  }

  private buildLetterBody(
    category: CategoryId,
    highlight: string,
    topTwo: string
  ): { para1: string; para2: string } {

    switch (category) {

      case 'content-creator':
        return {
          para1: `Mi occupo di contenuti editoriali e strategie di comunicazione con competenze in ${highlight}, con focus su storytelling, brand voice e performance.`,
          para2: `Ho sviluppato strategie di contenuto e prodotto materiali utilizzando ${topTwo}, curando la coerenza con il brand, il target di riferimento e i risultati misurabili.`,
        };

      case 'marketing':
        return {
          para1: `Lavoro in ${highlight} con un approccio data-driven orientato a risultati concreti e misurabili.`,
          para2: `Ho contribuito a campagne e progetti con ${topTwo}, traducendo strategie in azioni con impatto diretto su conversion rate e brand awareness.`,
        };

      case 'design-ux':
        return {
          para1: `Il mio processo di design parte sempre dall'utente: ricerca, wireframes, prototipazione e test iterativi. Lavoro con ${highlight}.`,
          para2: `Ho sviluppato padronanza approfondita in ${topTwo}, creando esperienze digitali che uniscono estetica, usabilità e coerenza di brand.`,
        };

      case 'travel-hospitality':
        return {
          para1: `La mia esperienza nel settore travel include competenze in ${highlight}, con forte orientamento al cliente e cura dei dettagli in ogni fase del servizio.`,
          para2: `Ho gestito clienti internazionali e coordinato esperienze utilizzando ${topTwo}, lavorando in contesti di alta qualità con standard elevati.`,
        };

      default:
        return {
          para1: `Il mio profilo include competenze solide in ${highlight}, che mi permettono di apportare un contributo concreto fin dai primi giorni.`,
          para2: `Ho sviluppato padronanza approfondita in ${topTwo}, costruendo soluzioni e processi in linea con le best practice del settore.`,
        };
    }
  }

  private buildAgentInsights(
    score: number,
    cvSkills: string[],
    jobSkills: string[],
    missingSkills: string[],
    role: string,
    category: CategoryId
  ): AgentInsight[] {

    const cvSet = new Set(
      cvSkills.map(s => s.toLowerCase())
    );

    const matches = jobSkills.filter(
      s => cvSet.has(s.toLowerCase())
    ).length;

    const topJob = jobSkills.slice(0, 5).join(', ')
      || "nessuna skill rilevata nell'offerta";

    const topCv = cvSkills.slice(0, 4).join(', ')
      || 'nessuna skill trovata nel profilo';

    const topMiss = missingSkills.slice(0, 3).join(', ');

    const catLabel = getCategoryLabel(category);

    return [
      {
        agentId: 'skill-matcher',
        agentName: 'Analista Offerta',
        icon: '🔍',
        summary: jobSkills.length > 0
          ? `Settore rilevato: ${catLabel}. Offerta analizzata: ${jobSkills.length} competenze richieste. Principali: ${topJob}. ${score >= 70 ? 'Allineamento solido con il profilo.' : 'Richiede un allineamento più specifico.'}`
          : `Settore rilevato: ${catLabel}. Nessuna skill specifica individuata nell'offerta. Inserisci una job description più dettagliata per un'analisi accurata.`,
      },
      {
        agentId: 'cv-analyzer',
        agentName: 'Analista CV',
        icon: '◈',
        summary: cvSkills.length > 0
          ? `CV analizzato nel contesto ${catLabel}: ${cvSkills.length} skill rilevate. In evidenza: ${topCv}. Match: ${matches}/${jobSkills.length} requisiti coperti. ${cvSkills.length >= 5 ? 'Profilo articolato e variegato.' : 'Consiglio: aggiungi più skill specifiche al testo del CV.'}`
          : `Nessuna skill ${catLabel} riconosciuta nel CV. Usa termini professionali specifici del settore per ottenere un'analisi precisa.`,
      },
      {
        agentId: 'cover-letter',
        agentName: 'Copywriter Candidatura',
        icon: '✉️',
        summary: cvSkills.length > 0
          ? `Lettera personalizzata per "${role}" (${catLabel}) con focus su ${cvSkills.slice(0, 2).join(' e ')}. Tono adattato al settore, professionale e orientato al valore concreto.`
          : `Lettera generata per "${role}" nel settore ${catLabel}. Aggiungi skill specifiche al CV per rendere la lettera ancora più mirata.`,
      },
      {
        agentId: 'gap-analyst',
        agentName: 'Stratega Portfolio',
        icon: '💼',
        summary: missingSkills.length > 0
          ? `Lacune rilevate in ${catLabel}: ${topMiss}. Suggeriti ${Math.min(missingSkills.length + 1, 5)} progetti e azioni portfolio per colmare il gap e rafforzare la candidatura.`
          : `Nessuna lacuna critica. Il profilo ${catLabel} copre tutti i requisiti del ruolo. Ottimo allineamento con l'offerta.`,
      },
    ];
  }

  private buildCoachAgentInsights(
    input: CareerCoachInput,
    sourceCategoryId: CategoryId,
    sourceCategoryLabel: string,
    targetCategoryId: CategoryId,
    targetCategoryLabel: string,
    transferableSkills: string[],
    missingSkills: string[],
    roadmap: RoadmapItem[],
    portfolioSuggestions: string[]
  ): AgentInsight[] {

    const totalActions = roadmap.reduce(
      (sum, item) => sum + item.actions.length,
      0
    );

    const topTransferable = transferableSkills
      .slice(0, 3)
      .join(', ')
      || 'nessuna skill rilevata nel settore target';

    const topMissing = missingSkills.slice(0, 3).join(', ')
      || 'profilo già ben allineato';

    const isTransition = sourceCategoryId !== targetCategoryId;

    return [
      {
        agentId: 'career-analyst',
        agentName: 'Career Analyst',
        icon: '🧭',
        summary: isTransition
          ? `Transizione rilevata: ${sourceCategoryLabel} → ${targetCategoryLabel}. Obiettivo "${input.goal}" analizzato con ${transferableSkills.length > 0 ? 'skill trasferibili presenti' : 'nuovo punto di partenza'}. Il background in ${sourceCategoryLabel} apporta valore trasversale.`
          : `Approfondimento nel settore ${targetCategoryLabel}. Obiettivo "${input.goal}" coerente con il background. ${transferableSkills.length} skill già rilevanti identificate.`,
      },
      {
        agentId: 'skill-gap',
        agentName: 'Skill Gap Agent',
        icon: '◈',
        summary: `Skill trasferibili al settore ${targetCategoryLabel}: ${transferableSkills.length} (${topTransferable}). ${
          missingSkills.length > 0
            ? `Gap principali da colmare: ${topMissing}. Priorità: prime 3 competenze nei prossimi 30-60 giorni.`
            : 'Profilo già ben allineato al settore target. Focus su approfondimento e visibilità.'
        }`,
      },
      {
        agentId: 'portfolio-strategy',
        agentName: 'Portfolio Strategy',
        icon: '💼',
        summary: `${portfolioSuggestions.length} progetti portfolio suggeriti per ${targetCategoryLabel}. ${portfolioSuggestions[0] ?? ''} Il portfolio è la prova tangibile della transizione: inizia con un progetto piccolo ma completo e ben documentato.`,
      },
      {
        agentId: 'roadmap',
        agentName: 'Roadmap Agent',
        icon: '🗺️',
        summary: `Piano 30/60/90 giorni costruito per ${isTransition ? 'la transizione' : 'l\'approfondimento'} verso ${targetCategoryLabel}. ${totalActions} azioni concrete in 3 fasi: fondamenta (30gg) → portfolio (60gg) → visibilità e candidature (90gg).`,
      },
    ];
  }
}
