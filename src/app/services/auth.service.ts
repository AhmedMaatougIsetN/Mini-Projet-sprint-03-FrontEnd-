import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { User } from '../model/user.model';

interface AuthResponse {
  token: string;
  username: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:8081/produits/login';
  private readonly tokenKey = 'jwt';
  loggedUser = '';
  isloggedIn = false;
  roles: string[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  signIn(user: User): Observable<void> {
    return this.http.post<AuthResponse>(this.apiUrl, user, { observe: 'response' }).pipe(
      tap(response => this.acceptLogin(response)),
      map(() => undefined)
    );
  }
  private acceptLogin(response: HttpResponse<AuthResponse>): void {
    const headerToken = response.headers.get('Authorization')?.replace(/^Bearer\s+/, '');
    const token = headerToken || response.body?.token;
    if (!token) throw new Error('Le serveur n’a pas retourné de token JWT.');
    if (isPlatformBrowser(this.platformId)) localStorage.setItem(this.tokenKey, token);
    this.applyToken(token);
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.tokenKey);
  }

  isAdmin(): boolean {
    return this.roles.includes('ADMIN');
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) localStorage.removeItem(this.tokenKey);
    this.loggedUser = '';
    this.isloggedIn = false;
    this.roles = [];
    this.router.navigate(['/login']);
  }

  restoreSession(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (payload.exp * 1000 <= Date.now()) throw new Error('Expired token');
      this.applyToken(token);
      return true;
    } catch {
      if (isPlatformBrowser(this.platformId)) localStorage.removeItem(this.tokenKey);
      this.loggedUser = '';
      this.isloggedIn = false;
      this.roles = [];
      return false;
    }
  }

  private applyToken(token: string): void {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    this.loggedUser = payload.sub ?? '';
    this.roles = payload.roles ?? [];
    this.isloggedIn = true;
  }
}


