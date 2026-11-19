
import {
  Component,
  inject,
  signal,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnDestroy {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';

  loading = signal(false);
  errorMessage = signal('');

  showWelcome = signal(false);
  isDemo = signal(false);

  private welcomeTimer?: ReturnType<typeof setTimeout>;

  onLogin(): void {

    if (!this.email.trim() || !this.password) {
      this.errorMessage.set('Inserisci email e password.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login(
      this.email.trim(),
      this.password
    ).subscribe({

      next: (response) => {
        this.loading.set(false);
        this.password = '';

        this.isDemo.set(
          response.role === 'DEMO'
        );

        this.showWelcome.set(true);

        this.welcomeTimer = setTimeout(() => {
          this.showWelcome.set(false);
          this.router.navigate(['/dashboard']);
        }, 2000);
      },

      error: (error: unknown) => {
        this.loading.set(false);

        // Mostra anche gli errori dei controlli JWT
        if (error instanceof Error) {
          this.errorMessage.set(error.message);
          return;
        }

        this.errorMessage.set(
          'Accesso non riuscito. Riprova.'
        );
      }
    });
  }

  ngOnDestroy(): void {
    if (this.welcomeTimer) {
      clearTimeout(this.welcomeTimer);
    }
  }
}
