import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AgentService } from '../../services/agent.service';
import { AnalysisResult } from '../../models/analysis-result.model';
import { CategoryId } from '../../utils/career-categories';

export interface ChecklistItem {
  text: string;
  priority: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  result: AnalysisResult | null = null;
  copied = false;

  constructor(private agentService: AgentService) {}

  ngOnInit(): void {
    this.result = this.agentService.getLatestResult();
  }

  get gradeColor(): string {
    switch (this.result?.grade) {
      case 'Excellent': return '#3D8B5A';
      case 'Good':      return '#A07848';
      case 'Fair':      return '#C4956A';
      case 'Poor':      return '#C05A3A';
      default:          return '#A07848';
    }
  }

  get gradeCssClass(): string {
    return this.result?.grade?.toLowerCase() ?? '';
  }

  get gradeLabel(): string {
    switch (this.result?.grade) {
      case 'Excellent': return 'Eccellente';
      case 'Good':      return 'Buono';
      case 'Fair':      return 'Nella media';
      case 'Poor':      return 'Da migliorare';
      default:          return '—';
    }
  }

  /** Competenze richieste dal ruolo che non sono nel CV del candidato */
  get keywordConsigliate(): string[] {
    if (!this.result) return [];
    const detected = new Set(this.result.detectedSkills.map(s => s.toLowerCase()));
    return this.result.requiredSkills.filter(s => !detected.has(s.toLowerCase()));
  }

  /** Checklist azioni consigliate basata sull'analisi e sul settore rilevato */
  get checklistCandidatura(): ChecklistItem[] {
    if (!this.result) return [];
    const items: ChecklistItem[] = [];
    const { missingSkills, matchScore, application, detectedCategoryId } = this.result;

    if (missingSkills.length > 0) {
      const profileLabel = this.getProfileLabel(detectedCategoryId);
      items.push({
        text: `Aggiungi ${profileLabel} le competenze mancanti: ${missingSkills.slice(0, 3).join(', ')}`,
        priority: 'high',
      });
    }

    items.push({
      text: `Personalizza la lettera di presentazione per il ruolo "${application.role}"`,
      priority: 'high',
    });

    if (matchScore < 70) {
      items.push({
        text: 'Integra le keyword del settore richieste prima di inviare la candidatura',
        priority: 'high',
      });
    }

    items.push({
      text: 'Aggiorna il portfolio con i progetti suggeriti dall\'agente AI',
      priority: 'medium',
    });

    items.push({
      text: 'Verifica che il profilo LinkedIn sia aggiornato e coerente con il profilo candidato',
      priority: 'medium',
    });

    if (matchScore >= 70) {
      items.push({
        text: this.getInterviewTip(detectedCategoryId),
        priority: 'low',
      });
    }

    items.push({
      text: "Inserisci nell'oggetto della mail il nome esatto del ruolo e il riferimento annuncio",
      priority: 'low',
    });

    return items;
  }

  private getProfileLabel(categoryId: CategoryId): string {
    switch (categoryId) {
      case 'content-creator': return 'al profilo';
      default: return 'al CV';
    }
  }

  private getInterviewTip(categoryId: CategoryId): string {
    switch (categoryId) {
      case 'tech':
        return 'Prepara 3 esempi concreti di progetti tecnici rilevanti per il colloquio';
      case 'content-creator':
        return 'Prepara 2-3 case study di contenuti con metriche di engagement per il colloquio';
      case 'marketing':
        return 'Prepara dati e risultati di campagne o progetti marketing per il colloquio';
      case 'design-ux':
        return 'Prepara un portfolio walk-through di 2-3 case study UX per il colloquio';
      case 'travel-hospitality':
        return 'Prepara 2-3 esempi di gestione clienti o itinerari realizzati per il colloquio';
      default:
        return 'Prepara 3 esempi concreti di progetti o risultati rilevanti per il colloquio';
    }
  }

  async copyLetter(): Promise<void> {
    if (!this.result) return;
    await navigator.clipboard.writeText(this.result.coverLetter);
    this.copied = true;
    setTimeout(() => (this.copied = false), 2500);
  }
}
