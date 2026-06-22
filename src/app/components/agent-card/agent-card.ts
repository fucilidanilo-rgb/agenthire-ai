import { Component, Input } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';

export type AgentStatus = 'waiting' | 'working' | 'completed';

@Component({
  selector: 'app-agent-card',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './agent-card.html',
  styleUrl: './agent-card.scss'
})
export class AgentCardComponent {
  @Input() name = '';
  @Input() icon = '';
  @Input() description = '';
  @Input() status: AgentStatus = 'waiting';
}
