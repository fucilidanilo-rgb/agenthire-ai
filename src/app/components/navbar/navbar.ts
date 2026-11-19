
import { Component, inject } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  Router,
  NavigationEnd
} from '@angular/router';
import { filter } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {

  menuOpen = false;

  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  constructor() {
    // Chiude il menu mobile dopo ogni navigazione
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd =>
          event instanceof NavigationEnd
        )
      )
      .subscribe(() => {
        this.menuOpen = false;
      });
  }

  get isAnalysisActive(): boolean {
    const url = this.router.url.split('?')[0];

    return (
      url === '/new-analysis' ||
      url === '/career-coach'
    );
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.menuOpen = false;
    this.router.navigate(['/home']);
  }
}
