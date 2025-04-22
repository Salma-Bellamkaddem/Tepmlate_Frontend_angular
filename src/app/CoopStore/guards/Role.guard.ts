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
export class RoleGuard  {

  constructor(private authService: AuthService, private router: Router) {}
  private isAuthorized(route: ActivatedRouteSnapshot, stateUrl?: string): boolean | UrlTree {
    // ✅ Autoriser explicitement l'accès à la page de login
    const currentUrl = stateUrl || '';
    if (currentUrl === '/auth/login') {
      return true;
    }
  
    const currentUser: User | null = this.authService.currentUserValue;
    const allowedRoles: string[] = route.data['roles'] || [];
  
    if (currentUser) {
      const userRole = currentUser.role?.toUpperCase();
  
      if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
        return true;
      } else {
        return this.router.parseUrl('/notfound');
      }
    }
  
    return this.router.parseUrl('/auth/login');
  }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    return this.isAuthorized(route, state.url);
  }
  
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    return this.isAuthorized(childRoute, state.url);
  }
}