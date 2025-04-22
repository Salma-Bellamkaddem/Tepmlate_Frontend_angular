import { Component, OnInit } from '@angular/core';
import { MenuService } from './app.menu.service';
import { AuthService } from '../CoopStore/service/auth.service';
 // ajuste selon ton chemin

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

  model: any[] = [];

  constructor(
    private menuService: MenuService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const isAuthenticated = this.authService.isAuthenticated();
    const isAdmin = this.authService.isAdmin();
    const isUser = this.authService.isUser();

    if (!isAuthenticated) {
      this.model = [];
      return;
    }

    if (isAdmin) {
      this.model = [
        {
          label: 'Dashboards',
          icon: 'pi pi-home',
          items: [
            { label: 'Sales Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
          //  { label: 'Analytics Dashboard', icon: 'pi pi-fw pi-chart-pie', routerLink: ['/dashboard-analytics'] },
            //{ label: 'SaaS Dashboard', icon: 'pi pi-fw pi-bolt', routerLink: ['/dashboard-saas'] }
          ]
        },
        {
          label: 'Coaches',
          icon: 'pi pi-fw pi-users',
          items: [
            //{ label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['coaches/list'] },
          //  { label: 'Create', icon: 'pi pi-fw pi-plus', routerLink: ['coaches/create'] }
          ]
        },
        {
          label: 'Sport Field',
          icon: 'pi pi-fw pi-map-marker',
          items: [
            { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['sportField/list'] },
            { label: 'Create', icon: 'pi pi-fw pi-plus', routerLink: ['sportField/create'] }
          ]
        }
      ];
    } else if (isUser) {
      this.model = [
        {
          label: 'Mon espace',
          icon: 'pi pi-fw pi-user',
          items: [
            { label: 'Mes réservations', icon: 'pi pi-fw pi-calendar', routerLink: ['/user/reservations'] },
            { label: 'Profil', icon: 'pi pi-fw pi-id-card', routerLink: ['/user/profile'] }
          ]
        }
      ];
    }
  }
}