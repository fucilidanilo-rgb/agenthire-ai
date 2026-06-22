import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AgentService } from '../../services/agent.service';
import { CareerCoachResult } from '../../models/career-coach.model';

@Component({
  selector: 'app-career-coach',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, RouterLink],
  templateUrl: './career-coach.html',
  styleUrl: './career-coach.scss',
})
export class CareerCoachComponent implements OnInit {
  result: CareerCoachResult | null = null;

  constructor(private agentService: AgentService) {}

  ngOnInit(): void {
    this.result = this.agentService.getLatestCoachResult();
  }
}
