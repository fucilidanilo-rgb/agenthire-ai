
import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // Controlla se è presente una sessione di accesso
  if (authService.isLoggedIn()) {
    return true;
  }

  // Se non autenticato, reindirizza al login
  return router.createUrlTree(['/login']);
};
