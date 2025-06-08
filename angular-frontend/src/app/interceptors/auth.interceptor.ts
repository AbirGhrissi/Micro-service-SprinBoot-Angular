import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Skip for login and refresh token requests
  if (req.url.includes('/login') || req.url.includes('/refreshToken')) {
    return next(req);
  }

  const accessToken = authService.getAccessToken();
  if (accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('/refreshToken')) {
        return handle401Error(req, next, authService, router);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
): Observable<HttpEvent<unknown>> {
  return authService.refreshToken().pipe(
    switchMap((tokens: any) => {
      const newReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${tokens['access-token']}`
        }
      });
      return next(newReq);
    }),
    catchError((error) => {
      authService.logout();
      router.navigate(['/login']);
      return throwError(() => error);
    })
  );
}