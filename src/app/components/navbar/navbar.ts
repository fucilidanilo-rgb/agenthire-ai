import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  constructor(readonly router: Router) {}

  get isAnalysisActive(): boolean {
    const url = this.router.url.split('?')[0];
    return url === '/new-analysis' || url === '/career-coach';
  }
}
