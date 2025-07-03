import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { NucleusCreateComponent } from './create/create.component';
import { NucleusMembersComponent } from 'src/app/CoopStore/components/Nucleus/members/members.component';

const routes: Routes = [
  {
    path: '',
    children: [
      // ✅ ROUTE PRINCIPALE - LISTE DES NUCLEUS
      {
        path: 'list',
        component: ListComponent,
        data: {
          breadcrumb: 'Liste des Nucleus',
          title: 'Gestion des Nucleus'
        }
      },

      // ✅ ROUTE CRÉATION - NOUVEAU NUCLEUS
      {
        path: 'create',
        component: NucleusCreateComponent,
        data: {
          breadcrumb: 'Créer un Nucleus',
          title: 'Nouveau Nucleus'
        }
      },

      // ✅ ROUTE ÉDITION - MODIFIER UN NUCLEUS (optionnel)
      {
        path: 'edit/:id',
        component: NucleusCreateComponent, // Réutilise le même composant
        data: {
          breadcrumb: 'Modifier le Nucleus',
          title: 'Édition Nucleus',
          mode: 'edit' // Pour différencier création/édition
        }
      },

      // ✅ ROUTE DÉTAILS - VOIR UN NUCLEUS (optionnel)
      {
        path: 'details/:id',
        loadComponent: () => import('src/app/CoopStore/components/Nucleus/details/details.component')
          .then(m => m.DetailsComponent),
        data: {
          breadcrumb: 'Détails du Nucleus',
          title: 'Détails Nucleus'
        }
      },
      {
        path: ':id/members',
        component: NucleusMembersComponent,
        
        data: {
          breadcrumb: 'Gestion des membres',
          title: 'Membres du Nucleus'
        }
      },

      // ✅ ROUTE PAR DÉFAUT - REDIRECTION VERS LA LISTE
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },

      // ✅ ROUTE WILDCARD - REDIRECTION EN CAS D'URL INVALIDE
      {
        path: '**',
        redirectTo: 'list'
      }
    ]
  }
];

export const NucleusRoutes = RouterModule.forChild(routes);