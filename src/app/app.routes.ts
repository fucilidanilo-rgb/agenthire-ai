
import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { NewAnalysisComponent } from './pages/new-analysis/new-analysis';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { HistoryComponent } from './pages/history/history';
import { CareerCoachComponent } from './pages/career-coach/career-coach';
import { Login } from './pages/login/login';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  // Home pubblica
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: 'home',
    component: HomeComponent
  },

  // Login pubblico
  {
    path: 'login',
    component: Login
  },

  // Pagine accessibili dopo il login
  {
    path: 'new-analysis',
    component: NewAnalysisComponent,
    canActivate: [authGuard]
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  {
    path: 'career-coach',
    component: CareerCoachComponent,
    canActivate: [authGuard]
  },

  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [authGuard]
  },

  // Indirizzi non riconosciuti
  {
    path: '**',
    redirectTo: 'home'
  }

];
