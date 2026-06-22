export type AgentId =
  | 'skill-matcher' | 'cv-analyzer' | 'cover-letter' | 'gap-analyst'
  | 'career-analyst' | 'skill-gap' | 'portfolio-strategy' | 'roadmap';

export interface Agent {
  id: AgentId;
  name: string;
  icon: string;
  description: string;
}

export interface AgentInsight {
  agentId: AgentId;
  agentName: string;
  icon: string;
  summary: string;
}
