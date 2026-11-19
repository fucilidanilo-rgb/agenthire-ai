
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  id: number;
  email: string;
  token: string;
  role: 'USER' | 'DEMO';
}

type UserRole = 'USER' | 'DEMO';

interface JwtPayload {
  exp?: number;
  sub?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl =
    'https://agenthire-backend-hxpv.onrender.com/api/auth';

  private readonly tokenKey = 'agenthire_token';
  private readonly roleKey = 'agenthire_role';
  private readonly userIdKey = 'agenthire_user_id';

  // Stato reattivo dell'account
  readonly currentRole = signal<UserRole | null>(null);
  readonly currentUserId = signal<number | null>(null);

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  // LOGIN

  login(
    email: string,
    password: string
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(
      tap(response => {

        // Verifica che la risposta contenga
        // un token con scadenza valida
        if (!this.isTokenValid(response.token)) {
          throw new Error(
            'Il server ha restituito un token non valido.'
          );
        }

        if (
          response.role !== 'USER' &&
          response.role !== 'DEMO'
        ) {
          throw new Error(
            'Ruolo utente non riconosciuto.'
          );
        }

        if (
          !Number.isSafeInteger(response.id) ||
          response.id <= 0
        ) {
          throw new Error(
            'Identificativo utente non valido.'
          );
        }

        // Pulisce l'eventuale sessione precedente
        this.logout();

        // Salva la nuova sessione
        sessionStorage.setItem(
          this.tokenKey,
          response.token
        );

        sessionStorage.setItem(
          this.roleKey,
          response.role
        );

        sessionStorage.setItem(
          this.userIdKey,
          String(response.id)
        );

        this.currentRole.set(response.role);
        this.currentUserId.set(response.id);

      })
    );
  }

  // TOKEN JWT

  getToken(): string | null {

    const token = sessionStorage.getItem(
      this.tokenKey
    );

    if (!token) {
      return null;
    }

    // Se il token è scaduto, termina la sessione
    if (!this.isTokenValid(token)) {
      this.logout();
      return null;
    }

    return token;
  }

  // CONTROLLO SESSIONE

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  getUserId(): number | null {

    if (!this.isLoggedIn()) {
      return null;
    }

    return this.currentUserId();
  }

  isDemo(): boolean {
    return this.isLoggedIn() &&
      this.currentRole() === 'DEMO';
  }

  // LOGOUT

  logout(): void {

    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.roleKey);
    sessionStorage.removeItem(this.userIdKey);

    this.currentRole.set(null);
    this.currentUserId.set(null);
  }

  // RIPRISTINO SESSIONE

  private restoreSession(): void {

    const token = sessionStorage.getItem(
      this.tokenKey
    );

    const role = sessionStorage.getItem(
      this.roleKey
    );

    const storedId = sessionStorage.getItem(
      this.userIdKey
    );

    const userId = Number(storedId);

    if (
      !token ||
      !this.isTokenValid(token) ||
      (role !== 'USER' && role !== 'DEMO') ||
      !storedId ||
      !Number.isSafeInteger(userId) ||
      userId <= 0
    ) {
      this.logout();
      return;
    }

    this.currentRole.set(role);
    this.currentUserId.set(userId);
  }

  // VERIFICA SCADENZA JWT

  private isTokenValid(token: string): boolean {

    try {

      const parts = token.split('.');

      if (parts.length !== 3) {
        return false;
      }

      const payloadPart = parts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const paddedPayload = payloadPart.padEnd(
        Math.ceil(payloadPart.length / 4) * 4,
        '='
      );

      const payload = JSON.parse(
        atob(paddedPayload)
      ) as JwtPayload;

      if (
        typeof payload.exp !== 'number' ||
        !Number.isFinite(payload.exp)
      ) {
        return false;
      }

      // JWT usa i secondi, Date.now() i millisecondi
      const expirationTime = payload.exp * 1000;

      // Piccolo margine di sicurezza: 5 secondi
      return expirationTime > Date.now() + 5000;

    } catch {
      return false;
    }
  }
}
