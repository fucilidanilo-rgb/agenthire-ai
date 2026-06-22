import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { JobAnalysisFormComponent } from '../../components/job-analysis-form/job-analysis-form';
import { CareerCoachFormComponent } from '../../components/career-coach-form/career-coach-form';

export type AnalysisMode = 'analysis' | 'coach';

@Component({
  selector: 'app-new-analysis',
  standalone: true,
  imports: [NgIf, JobAnalysisFormComponent, CareerCoachFormComponent],
  templateUrl: './new-analysis.html',
  styleUrl: './new-analysis.scss',
})
export class NewAnalysisComponent implements OnInit {
  mode: AnalysisMode = 'analysis';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const m = this.route.snapshot.queryParamMap.get('mode');
    if (m === 'coach') this.mode = 'coach';
  }

  setMode(m: AnalysisMode): void {
    this.mode = m;
  }
}
