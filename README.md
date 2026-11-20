
# 🤖 AgentHire AI — Recruiting & Career Coach

**AgentHire AI** è una web application Full Stack dedicata all'analisi delle candidature, alla valutazione delle competenze professionali e all'orientamento lavorativo.

Il progetto è stato sviluppato utilizzando **Angular, TypeScript, Java, Spring Boot e PostgreSQL**.

AgentHire integra un sistema multi-agente simulato che analizza le informazioni professionali, confronta le competenze con i requisiti delle offerte di lavoro e produce risultati strutturati, suggerimenti e contenuti utili alla candidatura.

L'obiettivo del progetto è dimostrare competenze nello sviluppo Full Stack, nella progettazione di workflow intelligenti, nella sicurezza delle applicazioni web e nell'integrazione frontend-backend.

---

## 🌐 Live Demo

### Applicazione online

**AgentHire AI — Danilo**

https://agenthire-danilo.vercel.app/home

**Backend Spring Boot**

https://agenthire-backend-hxpv.onrender.com

### 🔐 Credenziali DEMO

**Email:** `demo@agenthire.example`

**Password:** `AgentHire-Demo-2026!`

L'account DEMO consente di esplorare l'applicazione senza utilizzare un account personale.

Il backend è ospitato su Render Free. Dopo un periodo di inattività, il primo accesso potrebbe richiedere più tempo.

---

## ✨ Funzionalità principali

### 1. Analisi delle candidature

AgentHire permette di analizzare un profilo professionale rispetto ai requisiti di una posizione lavorativa.

Il sistema elabora:

- Informazioni del candidato
- Competenze tecniche e professionali
- Requisiti della Job Description
- Corrispondenza tra profilo e posizione
- Competenze mancanti
- Suggerimenti di miglioramento
- Punteggio indicativo di compatibilità
- Risultati strutturati dell'analisi

L'utente può utilizzare queste informazioni per comprendere meglio la compatibilità del proprio profilo con un'opportunità lavorativa.

### 2. Sistema multi-agente simulato

Il progetto utilizza quattro agenti logici che collaborano all'elaborazione dei dati.

**Job Description Agent**

Analizza i requisiti professionali della posizione lavorativa.

**Candidate Analysis Agent**

Esamina le informazioni e le competenze indicate nel profilo del candidato.

**Skill Gap Agent**

Confronta le competenze disponibili con quelle richieste e individua eventuali lacune.

**Recommendation Agent**

Produce suggerimenti e indicazioni per migliorare la candidatura.

Gli agenti sono implementati tramite logiche applicative sviluppate in TypeScript.

**Nota tecnica:** il sistema multi-agente è attualmente simulato e non utilizza modelli LLM esterni. Le analisi sono prodotte attraverso regole e algoritmi deterministici.

### 3. Lettere di presentazione

AgentHire include funzionalità dedicate alla preparazione delle candidature e alla produzione di testi di accompagnamento.

Le funzionalità comprendono:

- Elaborazione di informazioni professionali
- Utilizzo dei dati del candidato
- Collegamento tra profilo e posizione lavorativa
- Produzione di testi per la candidatura
- Suggerimenti per valorizzare competenze ed esperienze

Le lettere e i testi sono elaborati attraverso la logica applicativa del frontend, senza ricorrere a un servizio LLM esterno.

### 4. Career Coach

AgentHire comprende una sezione dedicata all'orientamento e alla crescita professionale.

Il Career Coach permette di:

- Definire un obiettivo professionale
- Esaminare le competenze già disponibili
- Individuare competenze da approfondire
- Identificare possibili percorsi di crescita
- Ricevere suggerimenti formativi
- Ottenere una roadmap professionale di 30, 60 e 90 giorni
- Ricevere idee per progetti da inserire nel portfolio

Il modulo utilizza una logica strutturata per generare suggerimenti in base alle informazioni fornite dall'utente.

### 5. Dashboard

La Dashboard offre una panoramica delle attività svolte nell'applicazione.

Permette di consultare i dati delle analisi e accedere alle principali funzionalità di AgentHire.

### 6. Archivio delle analisi

L'applicazione include un archivio dedicato ai risultati elaborati.

L'utente può consultare le analisi effettuate e recuperare i risultati delle attività precedenti.

La cronologia delle analisi e delle attività Career Coach viene salvata nel **localStorage del browser**.

I dati sono organizzati mediante chiavi distinte per identificativo utente.

**Nota:** la cronologia locale non è sincronizzata tra dispositivi e non viene attualmente salvata nel database PostgreSQL.

### 7. Autenticazione e gestione account

AgentHire utilizza un backend Spring Boot per autenticare gli utenti.

Sono presenti due ruoli applicativi:

**USER**

Account personale per l'utilizzo dell'applicazione.

**DEMO**

Account dimostrativo dedicato alla presentazione del progetto.

Le funzionalità di autenticazione includono:

- Login tramite email e password
- Generazione e utilizzo di token JWT
- Gestione della sessione
- Angular Auth Guard
- Protezione delle rotte riservate
- Controllo della scadenza del token
- Logout
- Identificazione dell'account nella Navbar

La registrazione pubblica è disabilitata.

---

## 🛠️ Stack tecnologico

### Frontend

- Angular 21
- TypeScript
- HTML5
- SCSS
- Angular Router
- Standalone Components
- Angular Signals
- RxJS
- Angular HttpClient
- LocalStorage
- SessionStorage

### Backend

- Java 21
- Spring Boot 4.1.1
- Spring Security
- Spring Data JPA
- Hibernate
- REST API
- JWT Authentication
- BCrypt Password Hashing

### Database

- PostgreSQL
- Neon Cloud Database

### Deployment

| Componente | Piattaforma |
|---|---|
| Frontend Angular | Vercel |
| Backend Spring Boot | Render |
| Database PostgreSQL | Neon |
| Containerizzazione backend | Docker |
| Versionamento | Git e GitHub |

---

## 🏗️ Architettura Full Stack

```text
                  UTENTE
                     |
                     v
              ANGULAR 21
               TypeScript
                 Vercel
                     |
         +-----------+-----------+
         |                       |
         v                       v
   ANALISI LOCALI         AUTENTICAZIONE
   MULTI-AGENTE           E API REST
         |                       |
         v                       v
   Career Coach             SPRING BOOT
   Lettere                 Java 21
   Dashboard                Render
   Archivio                    |
         |                     v
         v              Spring Security
   LocalStorage             JWT / BCrypt
                               |
                               v
                         Service Layer
                               |
                               v
                         Repository JPA
                               |
                               v
                          PostgreSQL
                             Neon
```

### Frontend Angular

Il frontend gestisce l'interfaccia utente e le funzionalità di analisi.

Le principali responsabilità includono:

- Navigazione
- Gestione dei componenti
- Analisi delle candidature
- Workflow multi-agente simulato
- Career Coach
- Produzione di contenuti per le candidature
- Dashboard
- Archivio locale
- Gestione della sessione

### Backend Spring Boot

Il backend gestisce:

- Login
- Autenticazione JWT
- Verifica delle credenziali
- Ruoli USER e DEMO
- Autorizzazioni
- API REST
- Gestione dei candidati
- Persistenza dei dati applicativi

### Database PostgreSQL

Il database PostgreSQL ospitato su Neon conserva i dati degli utenti e dei candidati gestiti dal backend.

Le analisi elaborate dal frontend restano invece nel browser.

---

## 🔐 Sicurezza

AgentHire implementa un sistema di autenticazione basato su **Spring Security e JWT**.

### Protezione delle password

Le password degli account sono protette utilizzando BCrypt.

### Autenticazione JWT

Dopo il login, il backend genera un token JWT.

Il frontend utilizza il token per autenticare le richieste verso gli endpoint protetti.

### Protezione delle rotte

Angular Auth Guard limita l'accesso alle sezioni riservate agli utenti autenticati.

### Autorizzazioni lato backend

Spring Security verifica le autorizzazioni prima di permettere operazioni protette.

### Ruoli

- USER: accesso personale
- DEMO: accesso dimostrativo con operazioni limitate sulle API dei candidati

### CORS

Il backend è configurato per accettare le richieste provenienti dai frontend autorizzati.

---

## 💻 Installazione in locale

### Requisiti

- Node.js compatibile con Angular 21
- npm
- Git
- Visual Studio Code o un editor equivalente

### 1. Clonare il repository

```bash
git clone https://github.com/fucilidanilo-rgb/agenthire-ai.git
```

### 2. Entrare nella cartella

```bash
cd agenthire-ai
```

### 3. Installare le dipendenze

```bash
npm install
```

### 4. Avviare l'applicazione

```bash
npm start
```

### 5. Aprire il browser

http://localhost:4200

Per utilizzare le funzionalità di autenticazione è necessario che il backend Spring Boot sia raggiungibile.

---

## 🔗 Repository GitHub

### Frontend Angular

https://github.com/fucilidanilo-rgb/agenthire-ai

### Backend Spring Boot

https://github.com/fucilidanilo-rgb/agenthire-backend

---

## 📁 Organizzazione del progetto

Il frontend Angular è organizzato attraverso componenti, pagine, servizi e guardie di navigazione.

Le principali responsabilità sono suddivise in:

**Components**

Componenti riutilizzabili dell'interfaccia, inclusa la Navbar.

**Pages**

Pagine dell'applicazione dedicate alle analisi, alla Dashboard, al Career Coach, all'archivio e al Login.

**Services**

Servizi Angular per l'elaborazione delle analisi, la gestione dello stato e l'integrazione con il backend.

**Guards**

Controllo dell'accesso alle rotte protette.

---

## 🎯 Competenze dimostrate

### Frontend Development

- Angular e TypeScript
- Componenti standalone
- HTML e SCSS
- Routing
- Angular Signals
- RxJS
- Integrazione API REST
- Gestione dello stato
- Interfacce responsive

### Backend Development

- Java
- Spring Boot
- Spring Security
- JWT
- BCrypt
- Controller / Service / Repository
- JPA e Hibernate
- PostgreSQL
- API REST

### Software Engineering

- Separazione delle responsabilità
- Architettura Full Stack
- Progettazione di workflow multi-agente
- Gestione dell'autenticazione
- Versionamento Git
- Deployment cloud
- Debugging e integrazione frontend-backend

---

## 👥 Collaborazione al progetto

AgentHire AI è stato sviluppato attraverso una collaborazione tra **Danilo Fucile** e **Roberta Bianca**.

I due sviluppatori mantengono frontend Angular pubblicati separatamente e utilizzano un backend Spring Boot condiviso.

### Danilo Fucile

Full Stack Development

GitHub: https://github.com/fucilidanilo-rgb

Applicazione: https://agenthire-danilo.vercel.app/home

### Roberta Bianca

Collaborazione allo sviluppo frontend e alla progettazione dell'interfaccia.

GitHub: https://github.com/robertabianca92

Applicazione: https://agenthire-ai.vercel.app/home

---

## 📌 Note sul progetto

AgentHire AI è un'applicazione dimostrativa sviluppata a scopo formativo e di portfolio.

Le analisi e i suggerimenti professionali vengono elaborati attraverso logiche deterministiche.

I punteggi di compatibilità sono indicativi e non rappresentano valutazioni automatizzate reali per decisioni di assunzione.

---

## 👨‍💻 Autore

**Danilo Fucili**

Junior Full Stack Developer

GitHub: https://github.com/fucilidanilo-rgb
