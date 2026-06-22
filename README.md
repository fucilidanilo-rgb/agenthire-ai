# AgentHire AI

## Overview

AgentHire AI è una web application sviluppata in Angular che simula un workflow di recruiting e career coaching basato su agenti AI.

L'obiettivo del progetto è aiutare candidati, studenti e professionisti a:

- Analizzare il proprio CV
- Confrontarlo con una Job Description
- Identificare skill gap
- Ottenere suggerimenti personalizzati
- Costruire un piano di crescita professionale

Il progetto è stato realizzato come portfolio project per dimostrare competenze Frontend, Angular, TypeScript, UX/UI e progettazione di applicazioni AI-oriented.

---

## Features

### Recruiting AI

Analisi candidatura tramite:

- Upload CV PDF
- LinkedIn URL
- Inserimento manuale del profilo

Output:

- Compatibilità candidatura
- Skill rilevate
- Skill mancanti
- Checklist candidatura
- Insight generati dagli agenti
- Analisi multi-settore

---

### Career Coach AI

Generazione roadmap professionale personalizzata.

Output:

- Skill trasferibili
- Skill da acquisire
- Piano 30 / 60 / 90 giorni
- Azioni prioritarie
- Strategia portfolio
- Piano di crescita professionale

---

### Archivio Analisi

Salvataggio locale delle analisi effettuate tramite:

- LocalStorage
- Cronologia risultati
- Riapertura risultati precedenti
- Eliminazione risultati

---

## Technologies

- Angular
- TypeScript
- HTML5
- SCSS
- Angular Routing
- Standalone Components
- LocalStorage
- Mock AI Logic

---

## Architecture

```text
src/
├── pages/
│   ├── home/
│   ├── dashboard/
│   ├── history/
│   ├── recruiting/
│   └── career-coach/
│
├── services/
│   ├── agent.service.ts
│   ├── analysis.service.ts
│   └── storage.service.ts
│
├── models/
├── utils/
└── shared/
```

---

## Main Workflows

### Recruiting AI

```text
CV / LinkedIn
        ↓
 Skill Analysis
        ↓
 Skill Gap Detection
        ↓
 AI Insights
        ↓
 Candidate Report
```

### Career Coach AI

```text
Current Background
        ↓
 Career Goal
        ↓
 Transferable Skills
        ↓
 Missing Skills
        ↓
 30 / 60 / 90 Day Plan
```

---

## Future Roadmap

### Phase 2

- User Authentication
- Supabase Integration
- Cloud Storage
- User Profiles
- Private Analysis History

### Phase 3

- Real CV Parsing
- PDF Text Extraction
- AI API Integration
- Cover Letter Generator
- Interview Simulator

### Phase 4

- Recruiter Dashboard
- Team Collaboration
- Candidate Tracking
- Analytics

---

## Design System

AgentHire AI follows the Bianca Studio design language:

- Warm beige palette
- Soft ivory backgrounds
- Dusty rose accents
- Elegant typography
- Minimal and premium interface
- Human-centered AI experience

---

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/agenthire-ai.git
```

Install dependencies:

```bash
npm install
```

Run the project:

```bash
npx ng serve
```

Open:

```text
http://localhost:4200
```

---

## Why I Built This Project

I created AgentHire AI as a portfolio project to explore the intersection between:

- Frontend Development
- Artificial Intelligence
- Career Growth
- User Experience Design

The goal was to build a realistic AI-inspired application capable of helping users analyze opportunities and plan professional transitions.

---

## Author

**Roberta Bianca**

Travel Designer • Content Creator • Future Frontend Developer

Rome, Italy

LinkedIn: (aggiungeremo il link)
GitHub: (aggiungeremo il link)

---

## Portfolio Presentation

AgentHire AI demonstrates:

- Angular Development
- TypeScript Logic
- Component Architecture
- Routing
- State Persistence with LocalStorage
- UX/UI Design
- Product Thinking
- AI Workflow Design

This project was built as a real-world portfolio application and is continuously evolving.
