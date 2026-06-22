import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { AgentService } from '../../services/agent.service';
import { CareerCoachInput } from '../../models/career-coach.model';
import { AgentCardComponent, AgentStatus } from '../agent-card/agent-card';

interface WorkflowAgent {
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-career-coach-form',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, AgentCardComponent],
  templateUrl: './career-coach-form.html',
  styleUrl: './career-coach-form.scss',
})
export class CareerCoachFormComponent {
  goal         = '';
  background   = '';
  currentSkills = '';
  portfolioUrl  = '';

  loading      = false;
  showWorkflow = false;

  agentStatuses: AgentStatus[] = ['waiting', 'waiting', 'waiting', 'waiting'];

  readonly agents: WorkflowAgent[] = [
    {
      name: 'Career Analyst',
      icon: '🧭',
      description: 'Analizza obiettivo professionale e background attuale.',
    },
    {
      name: 'Skill Gap Agent',
      icon: '◈',
      description: 'Identifica skill trasferibili e lacune da colmare.',
    },
    {
      name: 'Portfolio Strategy',
      icon: '💼',
      description: 'Progetta strategia portfolio e progetti dimostrativi.',
    },
    {
      name: 'Roadmap Agent',
      icon: '🗺️',
      description: "Costruisce il piano d'azione 30/60/90 giorni.",
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

  get isFormValid(): boolean {
    return !!this.goal.trim() && !!this.background.trim() && !!this.currentSkills.trim();
  }

  async onSubmit(): Promise<void> {
    if (this.loading || !this.isFormValid) return;

    this.loading      = true;
    this.agentStatuses = ['waiting', 'waiting', 'waiting', 'waiting'];
    this.showWorkflow  = true;
    this.cdr.detectChanges();

    const input: CareerCoachInput = {
      goal:          this.goal,
      background:    this.background,
      currentSkills: this.currentSkills,
      portfolioUrl:  this.portfolioUrl,
      submittedAt:   new Date(),
    };

    const analysisPromise = this.agentService.simulateCareerCoach(input);
    await this.runWorkflow();
    await analysisPromise;

    this.router.navigate(['/career-coach']);
  }

  private async runWorkflow(): Promise<void> {
    const durations = [1300, 1400, 1200, 1300];

    for (let i = 0; i < this.agents.length; i++) {
      if (i > 0) await this.sleep(220);

      this.agentStatuses = this.agentStatuses.map(
        (s, j): AgentStatus => (j === i ? 'working' : s),
      );
      this.cdr.detectChanges();

      await this.sleep(durations[i]);

      this.agentStatuses = this.agentStatuses.map(
        (s, j): AgentStatus => (j === i ? 'completed' : s),
      );
      this.cdr.detectChanges();
    }

    await this.sleep(500);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
