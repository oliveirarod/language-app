import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { StateService } from './state.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private authState!: BehaviorSubject<boolean>;

  public isAuthenticated$!: Observable<boolean>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private stateService: StateService
  ) {
    // --- CORREÇÃO AQUI: Verifique se estamos no navegador antes de acessar o localStorage ---
    const initialAuthState = isPlatformBrowser(this.platformId) ? this.hasToken() : false;
    this.authState = new BehaviorSubject<boolean>(initialAuthState);
    this.isAuthenticated$ = this.authState.asObservable();

    if (isPlatformBrowser(this.platformId) && this.hasToken()) {
      this.stateService.loadInitialStats();
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        this.authState.next(true);
        this.stateService.loadInitialStats();
      }),
    );
  }

  logout(): void {
    const router = Inject(Router);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }

    this.authState.next(false);
    this.stateService.clearStats();

    router.navigate(['/login']);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }

    return null;
  }

  private hasToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }

    return false;
  }
}
