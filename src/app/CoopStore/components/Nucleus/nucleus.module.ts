// src/app/CoopStore/components/nucleus/nucleus.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ✅ ANGULAR MATERIAL IMPORTS
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatOptionModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// ✅ COMPOSANTS NUCLEUS
import { ListComponent } from './list/list.component';
// Futurs composants à créer
// import { NucleusCreateComponent } from './create/nucleus-create.component';
// import { NucleusDetailComponent } from './detail/nucleus-detail.component';
// import { NucleusEditComponent } from './edit/nucleus-edit.component';
// import { NucleusMembersComponent } from './members/nucleus-members.component';

// ✅ SERVICES
import { NucleusService } from '../../service/nucleus.service';
import { NucleusCreateComponent } from './create/create.component';
import { NucleusMembersComponent } from './members/members.component';

// ✅ ROUTES NUCLEUS
const nucleusRoutes: Routes = [
  // Redirection par défaut vers la liste
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  // ✅ ROUTE PRINCIPALE - LISTE DES NUCLEUS
  {
    path: 'list',
    component: ListComponent,
    data: { 
      breadcrumb: 'Liste des Nucleus',
      title: 'Gestion des Nucleus'
    }
  }
  // ✅ ROUTES FUTURES (décommentez quand vous créez les composants)
   ,{
   path: 'create',
   component: NucleusCreateComponent,
   data: { breadcrumb: 'Créer un Nucleus' }
 },
  // {
  //   path: ':id',
  //   component: NucleusDetailComponent,
  //   data: { breadcrumb: 'Détails du Nucleus' }
  // },
  // {
  //   path: ':id/edit',
  //   component: NucleusEditComponent,
  //   data: { breadcrumb: 'Modifier le Nucleus' }
  // },
{
   path: ':id/members',
  component: NucleusMembersComponent,
   data: { breadcrumb: 'Membres du Nucleus' }
 }
];

@NgModule({
  declarations: [
  
    // Ajoutez ici vos futurs composants Nucleus
    // NucleusCreateComponent,
    // NucleusDetailComponent,
    // NucleusEditComponent,
    // NucleusMembersComponent
  ],
  imports: [
    // ✅ MODULES ANGULAR DE BASE
    CommonModule,
    ListComponent,
    NucleusCreateComponent,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterModule.forChild(nucleusRoutes),
    
    // ✅ MODULES ANGULAR MATERIAL
    
  ],
  providers: [
    NucleusService
  ]
})
export class NucleusModule { }