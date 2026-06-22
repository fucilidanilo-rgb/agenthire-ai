import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AgentService } from '../../services/agent.service';
import { AnalysisResult } from '../../models/analysis-result.model';
import { CareerCoachResult } from '../../models/career-coach.model';

// Slim local types — date è stringa dopo JSON.parse
export interface AnalysisHistoryItem {
  id: string;
  analyzedAt: string;
  application: { role: string; portfolioUrl?: string; };
  matchScore: number;
  grade: string;
  detectedCategory: string;
  detectedSkills: string[];
  missingSkills: string[];
}

export interface CoachHistoryItem {
  id: string;
  analyzedAt: string;
  input: { goal: string; background: string; };
  sourceCategoryLabel?: string;
  targetCategoryLabel: string;
  sourceCategoryId?: string;
  targetCategoryId?: string;
  transferableSkills: string[];
  missingSkills: string[];
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, RouterLink],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class HistoryComponent implements OnInit {
  activeTab: 'analysis' | 'coach' = 'analysis';
  analysisHistory: AnalysisHistoryItem[] = [];
  coachHistory: CoachHistoryItem[] = [];

  constructor(
    private agentService: AgentService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  setTab(tab: 'analysis' | 'coach'): void {
    this.activeTab = tab;
  }

  get analysisCount(): number { return this.analysisHistory.length; }
  get coachCount(): number    { return this.coachHistory.length; }

  gradeLabel(grade: string): string {
    switch (grade) {
      case 'Excellent': return 'Eccellente';
      case 'Good':      return 'Buono';
      case 'Fair':      return 'Nella media';
      case 'Poor':      return 'Da migliorare';
      default:          return grade ?? '—';
    }
  }

  gradeColor(grade: string): string {
    switch (grade) {
      case 'Excellent': return '#3D8B5A';
      case 'Good':      return '#A07848';
      case 'Fair':      return '#C4956A';
      case 'Poor':      return '#C05A3A';
      default:          return '#A07848';
    }
  }

  isTransition(item: CoachHistoryItem): boolean {
    return !!item.sourceCategoryId &&
           !!item.targetCategoryId &&
           item.sourceCategoryId !== item.targetCategoryId;
  }

  // ── Riapri ────────────────────────────────────────────────────

  reopenAnalysis(item: AnalysisHistoryItem): void {
    this.agentService.setLatestResult(item as unknown as AnalysisResult);
    this.router.navigate(['/dashboard']);
  }

  reopenCoach(item: CoachHistoryItem): void {
    this.agentService.setLatestCoachResult(item as unknown as CareerCoachResult);
    this.router.navigate(['/career-coach']);
  }

  // ── Elimina ───────────────────────────────────────────────────

  deleteAnalysis(id: string, event: Event): void {
    event.stopPropagation();
    this.agentService.deleteAnalysisFromHistory(id);
    this.loadHistory();
  }

  deleteCoach(id: string, event: Event): void {
    event.stopPropagation();
    this.agentService.deleteCoachFromHistory(id);
    this.loadHistory();
  }

  // ── Privati ───────────────────────────────────────────────────

  private loadHistory(): void {
    this.analysisHistory = this.agentService.getAnalysisHistory() as unknown as AnalysisHistoryItem[];
    this.coachHistory    = this.agentService.getCoachHistory()    as unknown as CoachHistoryItem[];
  }
}
