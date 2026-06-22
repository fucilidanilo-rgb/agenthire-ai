import { JobApplication } from './job-application.model';
import { AgentInsight } from './agent.model';
import { CategoryId } from '../utils/career-categories';

export type AnalysisGrade = 'Excellent' | 'Good' | 'Fair' | 'Poor';

export interface AnalysisResult {
  id: string;
  application: JobApplication;
  matchScore: number;
  grade: AnalysisGrade;
  detectedCategory: string;
  detectedCategoryId: CategoryId;
  detectedSkills: string[];
  requiredSkills: string[];
  missingSkills: string[];
  coverLetter: string;
  portfolioSuggestions: string[];
  agentInsights: AgentInsight[];
  analyzedAt: Date;
}
