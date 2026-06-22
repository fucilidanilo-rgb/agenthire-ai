import { CategoryId } from '../utils/career-categories';
import { AgentInsight } from './agent.model';

export interface CareerCoachInput {
  goal: string;
  background: string;
  currentSkills: string;
  portfolioUrl: string;
  submittedAt: Date;
}

export interface RoadmapItem {
  period: string;
  actions: string[];
}

export interface CareerCoachResult {
  id: string;
  input: CareerCoachInput;
  // Source = settore attuale del candidato (da background + skill)
  sourceCategoryId: CategoryId;
  sourceCategoryLabel: string;
  // Target = settore obiettivo (rilevato dal goal)
  targetCategoryId: CategoryId;
  targetCategoryLabel: string;
  transferableSkills: string[];
  missingSkills: string[];
  roadmap: RoadmapItem[];
  portfolioSuggestions: string[];
  priorityActions: string[];
  motivationalInsight: string;
  agentInsights: AgentInsight[];
  analyzedAt: Date;
}
