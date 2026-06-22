import { Routes } from '@angular/router';
import { HomeComponent }         from './pages/home/home';
import { NewAnalysisComponent }  from './pages/new-analysis/new-analysis';
import { DashboardComponent }    from './pages/dashboard/dashboard';
import { HistoryComponent }      from './pages/history/history';
import { CareerCoachComponent }  from './pages/career-coach/career-coach';

export const routes: Routes = [
  { path: '',              redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',          component: HomeComponent },
  { path: 'new-analysis',  component: NewAnalysisComponent },
  { path: 'dashboard',     component: DashboardComponent },
  { path: 'career-coach',  component: CareerCoachComponent },
  { path: 'history',       component: HistoryComponent },
];
