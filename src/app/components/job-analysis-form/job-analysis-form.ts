import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { AgentService } from '../../services/agent.service';
import { JobApplication } from '../../models/job-application.model';
import { AgentCardComponent, AgentStatus } from '../agent-card/agent-card';
import { CandidateProfileInputComponent, CandidateProfile } from '../candidate-profile-input/candidate-profile-input';

interface WorkflowAgent {
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-job-analysis-form',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, AgentCardComponent, CandidateProfileInputComponent],
  templateUrl: './job-analysis-form.html',
  styleUrl: './job-analysis-form.scss'
})
export class JobAnalysisFormComponent {
  role = '';
  portfolioUrl = '';
  jobOffer = '';

  candidateProfile: CandidateProfile | null = null;
  profileError = false;

  loading = false;
  showWorkflow = false;

  // Nuovo riferimento ad ogni cambio → Angular rileva sempre il diff
  agentStatuses: AgentStatus[] = ['waiting', 'waiting', 'waiting', 'waiting'];

  readonly agents: WorkflowAgent[] = [
    {
      name: 'Analista Offerta',
      icon: '🔍',
      description: 'Estrae competenze, seniority e keyword dalla job offer.',
    },
    {
      name: 'Analista CV',
      icon: '◈',
      description: 'Confronta profilo candidato e requisiti della posizione.',
    },
    {
      name: 'Stratega Portfolio',
      icon: '💼',
      description: 'Suggerisce progetti e miglioramenti da valorizzare.',
    },
    {
      name: 'Copywriter Candidatura',
      icon: '✉️',
      description: 'Prepara una lettera motivazionale coerente con il ruolo.',
    },
  ];

  constructor(
    private router: Router,
    private agentService: AgentService,
    private cdr: ChangeDetectorRef,
  ) {}

  get completedCount(): number {
    return this.agentStatuses.filter(s => s === 'completed').length;
  }

  onProfileChange(profile: CandidateProfile): void {
    this.candidateProfile = profile;
    if (profile.isReady) this.profileError = false;
  }

  async onSubmit(): Promise<void> {
    if (this.loading) return;
    if (!this.role.trim() || !this.jobOffer.trim()) return;

    if (!this.candidateProfile?.isReady) {
      this.profileError = true;
      return;
    }

    this.profileError = false;
    this.loading = true;
    this.agentStatuses = ['waiting', 'waiting', 'waiting', 'waiting'];
    this.showWorkflow = true;
    this.cdr.detectChanges();

    const application: JobApplication = {
      role: this.role,
      portfolioUrl: this.portfolioUrl,
      jobOffer: this.jobOffer,
      candidateCv: this.candidateProfile.text,
      submittedAt: new Date(),
    };

    // Analisi parte in background; animazione è la bottleneck (~6s)
    const analysisPromise = this.agentService.simulateAnalysis(application);

    await this.runWorkflow();

    await analysisPromise; // già completata (1.8s < 6s), ma aspettiamo per sicurezza

    this.router.navigate(['/dashboard']);
  }

  private async runWorkflow(): Promise<void> {
    // Ogni agente resta "In analisi" abbastanza a lungo da essere visto
    const durations: number[] = [1200, 1300, 1100, 1200]; // ms per ogni agente

    for (let i = 0; i < this.agents.length; i++) {
      if (i > 0) {
        await this.sleep(220); // breve pausa prima che parta il prossimo
      }

      // Crea NUOVO array → Angular rileva certamente il cambio riferimento
      this.agentStatuses = this.agentStatuses.map(
        (s, j): AgentStatus => (j === i ? 'working' : s)
      );
      this.cdr.detectChanges();

      await this.sleep(durations[i]);

      this.agentStatuses = this.agentStatuses.map(
        (s, j): AgentStatus => (j === i ? 'completed' : s)
      );
      this.cdr.detectChanges();
    }

    await this.sleep(500); // pausa finale: tutti completati prima del redirect
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
