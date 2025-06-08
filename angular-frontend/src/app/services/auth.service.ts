import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface Tokens {
  'access-token': string;
  'refresh-token': string;
}

interface User {
  username: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private readonly API_URL = 'http://localhost:8089';

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/auth-service/register`, {
      username,
      password
    }).pipe(
      tap(() => {
        // After successful registration, you might want to automatically log in the user
        // Or just redirect to login page (handled in component)
      })
    );
  }

  login(username: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return this.http.post(`${this.API_URL}/login`, formData).pipe(
      tap((response: any) => {
        if (response['access-token']) {
          this.storeTokens(response);
          const user = this.decodeToken(response['access-token']);
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  public get currentUserValue(): User | null {
  return this.currentUserSubject.value;
}

  refreshToken(): Observable<Tokens> {
    const refreshToken = localStorage.getItem('refresh-token');
    return this.http.get<Tokens>(`${this.API_URL}/auth-service/refreshToken`, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    }).pipe(
      tap(tokens => {
        this.storeTokens(tokens);
        const user = this.decodeToken(tokens['access-token']);
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private decodeToken(token: string): User {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return {
      username: decoded.sub,
      roles: decoded.roles || [] 
    };
  } catch (e) {
    console.error('Error decoding token', e);
    return { username: '', roles: [] };
  }
}

  private storeTokens(tokens: Tokens): void {
    localStorage.setItem('access-token', tokens['access-token']);
    localStorage.setItem('refresh-token', tokens['refresh-token']);
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('access-token');
    if (token) {
      const user = this.decodeToken(token);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access-token');
  }
}