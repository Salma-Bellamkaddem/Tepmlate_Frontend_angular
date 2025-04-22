import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { AuthService } from '../service/auth.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const currentUser: User | null = this.authService.currentUserValue;

    if (currentUser) {
      const allowedRoles: string[] = route.data['roles'] || []; // ✅ Pluriel ici
      const userRole = currentUser.role?.toUpperCase().trim();

      if (allowedRoles.length && !allowedRoles.includes(userRole)) {
        return this.router.createUrlTree(['/notfound2']);
      }

      return true;
    }

    // Non connecté → redirection vers login
    return this.router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
  }
}