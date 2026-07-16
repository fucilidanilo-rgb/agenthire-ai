import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  menuOpen = false;

  constructor(readonly router: Router) {
    // Chiude il menu mobile automaticamente dopo ogni navigazione
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => { this.menuOpen = false; });
  }

  get isAnalysisActive(): boolean {
    const url = this.router.url.split('?')[0];
    return url === '/new-analysis' || url === '/career-coach';
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
