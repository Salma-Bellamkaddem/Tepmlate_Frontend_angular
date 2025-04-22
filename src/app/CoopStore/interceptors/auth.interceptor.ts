import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user';

const HEADER_AUTHORIZATION = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');

    // Vérifie s'il y a un token
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const nowInSecs = Math.floor(Date.now() / 1000); // en secondes
        const exp = decodedToken.exp || 0;

        // Token encore valide
        if (exp > nowInSecs) {
          const cloned = request.clone({
            headers: request.headers.set(HEADER_AUTHORIZATION, 'Bearer ' + token)
          });
          return next.handle(cloned);
        } else {
          // Token expiré → tentative de refresh
          return this.authenticationService.refreshToken().pipe(
            switchMap((response: any) => {
              const user = response.user;
              const accessToken = response.accessToken;
              const refreshToken = response.refreshToken;

              this.authenticationService.setSessionStorage(user, accessToken, refreshToken);

              const cloned = request.clone({
                headers: request.headers.set(HEADER_AUTHORIZATION, 'Bearer ' + accessToken)
              });

              return next.handle(cloned);
            }),
            catchError(err => {
              // Rediriger vers login si le refresh échoue
              this.authenticationService.logout();
              this.router.navigate(['/auth/logout']);
              return throwError(() => err);
            })
          );
        }
      } catch (error) {
        // Token invalide ou erreur lors du décodage
        this.authenticationService.logout();
        this.router.navigate(['/auth/logout']);
        return throwError(() => error);
      }
    }

    // Pas de token : passer la requête telle quelle
    return next.handle(request);
  }
}

// Fournisseur de l’intercepteur
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];