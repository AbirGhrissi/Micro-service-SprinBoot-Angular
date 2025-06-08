import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface User {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [];
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  register(email: string, password: string): Observable<boolean> {
    return new Observable(subscriber => {
      setTimeout(() => {
        if (this.users.some(user => user.email === email)) {
          subscriber.next(false);
        } else {
          this.users.push({ email, password });
          subscriber.next(true);
        }
        subscriber.complete();
      }, 1000);
    });
  }

  login(email: string, password: string): Observable<boolean> {
    return new Observable(subscriber => {
      setTimeout(() => {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user || (email === 'user@example.com' && password === 'password')) {
          this.isAuthenticatedSubject.next(true);
          subscriber.next(true);
        } else {
          subscriber.next(false);
        }
        subscriber.complete();
      }, 1000);
    });
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
  }
}