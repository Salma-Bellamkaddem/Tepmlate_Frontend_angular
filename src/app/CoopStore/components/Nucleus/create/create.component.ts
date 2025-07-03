
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { 
  ActivitySector, 
  NucleusRequest, 
  NucleusResponse, 
  NucleusService,

} from 'src/app/CoopStore/service/nucleus.service';

@Component({
  selector: 'app-nucleus-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    InputNumberModule,
    CheckboxModule,
    DialogModule,
    ToastModule,
    ProgressSpinnerModule
  ],
  template: `
    <p-dialog 
      header="Créer un nouveau Nucleus" 
      [(visible)]="showDialog" 
      [modal]="true" 
      [style]="{width: '700px', maxWidth: '95vw'}" 
      [closable]="!submitting"
      (onHide)="closeDialog()">

      <div *ngIf="loading" class="text-center py-6">
        <p-progressSpinner></p-progressSpinner>
        <p class="text-600 mt-3">Chargement...</p>
      </div>

      <form *ngIf="!loading" [formGroup]="nucleusForm" (ngSubmit)="onSubmit()" class="p-4">
        
        <!-- Nom -->
        <div class="field mb-4">
          <label class="block text-900 font-medium mb-2">Nom du nucleus *</label>
          <input 
            type="text" 
            pInputText 
            formControlName="name"
            placeholder="Ex: Nucleus Agriculture Nord"
            class="w-full"
            [class.ng-invalid]="hasFieldError('name')">
          <small 
            *ngIf="hasFieldError('name')" 
            class="p-error block mt-1">
            {{ getFieldErrorMessage('name') }}
          </small>
        </div>

        <!-- Description -->
        <div class="field mb-4">
          <label class="block text-900 font-medium mb-2">Description</label>
          <textarea 
            pInputTextarea 
            formControlName="description"
            placeholder="Description du nucleus..."
            [rows]="3"
            class="w-full">
          </textarea>
        </div>

        <!-- Secteur d'activité -->
        <div class="field mb-4">
          <label class="block text-900 font-medium mb-2">Secteur d'activité *</label>
          <p-dropdown 
            [options]="sectorOptions" 
            formControlName="activitySector"
            optionLabel="label" 
            optionValue="value"
            placeholder="Sélectionner un secteur"
            class="w-full">
          </p-dropdown>
          <small 
            *ngIf="hasFieldError('activitySector')" 
            class="p-error block mt-1">
            {{ getFieldErrorMessage('activitySector') }}
          </small>
        </div>

        <!-- Facilitateur -->
        <div class="field mb-4">
          <label class="block text-900 font-medium mb-2">Facilitateur *</label>
          <p-dropdown 
            [options]="facilitatorOptions" 
            formControlName="facilitatorId"
            optionLabel="label" 
            optionValue="value"
            placeholder="Sélectionner un facilitateur"
            class="w-full">
          </p-dropdown>
          <small 
            *ngIf="hasFieldError('facilitatorId')" 
            class="p-error block mt-1">
            {{ getFieldErrorMessage('facilitatorId') }}
          </small>
        </div>

        <!-- Capacité maximale -->
        <div class="field mb-4">
          <label class="block text-900 font-medium mb-2">Capacité maximale *</label>
          <p-inputNumber 
            formControlName="maxMembers"
            [min]="1" 
            [max]="100"
            [showButtons]="true"
            class="w-full">
          </p-inputNumber>
          <small 
            *ngIf="hasFieldError('maxMembers')" 
            class="p-error block mt-1">
            {{ getFieldErrorMessage('maxMembers') }}
          </small>
        </div>

        <!-- Statut actif -->
        <div class="field mb-4">
          <div class="flex align-items-center">
            <p-checkbox 
              formControlName="active" 
              [binary]="true" 
              inputId="active">
            </p-checkbox>
            <label for="active" class="ml-2">Activer immédiatement</label>
          </div>
        </div>

      </form>

      <ng-template pTemplate="footer">
        <div class="flex justify-content-end gap-2">
          <p-button 
            label="Annuler" 
            icon="pi pi-times" 
            (onClick)="closeDialog()"
            [disabled]="submitting"
            class="p-button-secondary">
          </p-button>
          
          <p-button 
            label="Créer" 
            icon="pi pi-check" 
            (onClick)="onSubmit()"
            [loading]="submitting"
            [disabled]="!canSubmit()">
          </p-button>
        </div>
      </ng-template>

    </p-dialog>

    <p-toast position="top-right"></p-toast>
  `,
  providers: [MessageService]
})
export class NucleusCreateComponent implements OnInit {
  
  @Output() nucleusCreated = new EventEmitter<NucleusResponse>();
  @Output() dialogClosed = new EventEmitter<void>();

  nucleusForm!: FormGroup;
  showDialog = true;
  loading = false;
  submitting = false;
  
  sectorOptions: any[] = [];
  facilitatorOptions: any[] = [];
  activitySectors = Object.values(ActivitySector);

  constructor(
    private fb: FormBuilder,
    private nucleusService: NucleusService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.initializeSectorOptions();
    this.loadFacilitators();
  }

  private initializeForm(): void {
    this.nucleusForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      activitySector: [null, [Validators.required]],
      facilitatorId: [null, [Validators.required]],
      maxMembers: [10, [Validators.required, Validators.min(1)]],
      active: [true]
    });
  }

  private initializeSectorOptions(): void {
    this.sectorOptions = this.activitySectors.map(sector => ({
      label: this.formatActivitySector(sector),
      value: sector
    }));
  }

  private loadFacilitators(): void {
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.showMessage('Token manquant', 'error');
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;

    // Si la méthode getFacilitators n'existe pas, utilisez des données de test
    if (this.nucleusService.getFacilitators) {
      this.nucleusService.getFacilitators().subscribe({
        next: (facilitators) => {
          this.facilitatorOptions = facilitators.map(f => ({
            label: `${f.cooperativeName} (${f.city})`,
            value: f.id 
          }));
          this.loading = false;
        },
        error: () => {
          this.setDefaultFacilitators();
        }
      });
    } else {
      this.setDefaultFacilitators();
    }
  }

  private setDefaultFacilitators(): void {
    this.facilitatorOptions = [
      
    ];
    this.loading = false;
  }

  onSubmit(): void {
    if (this.nucleusForm.invalid) {
      this.markAllFieldsAsTouched();
      this.showMessage('Veuillez corriger les erreurs', 'error');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.showMessage('Session expirée', 'error');
      this.router.navigate(['/login']);
      return;
    }

    this.submitting = true;
    
    const nucleusRequest: NucleusRequest = {
      name: this.nucleusForm.value.name,
      description: this.nucleusForm.value.description || '',
      activitySector: this.nucleusForm.value.activitySector,
      facilitatorId: this.nucleusForm.value.facilitatorId,
      maxMembers: this.nucleusForm.value.maxMembers,
      active: this.nucleusForm.value.active
    };

    this.nucleusService.createNucleus(nucleusRequest).subscribe({
      next: (response) => {
        this.showMessage('Nucleus créé avec succès !', 'success');
        this.nucleusCreated.emit(response);
        this.closeDialog();
        this.submitting = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        
        let errorMessage = 'Erreur lors de la création';
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.status === 401) {
          errorMessage = 'Non autorisé';
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          errorMessage = 'Permissions insuffisantes';
        }
        
        this.showMessage(errorMessage, 'error');
        this.submitting = false;
      }
    });
  }

  closeDialog(): void {
    this.showDialog = false;
    this.dialogClosed.emit();
  
    // 👇 Rediriger vers la liste des Nucleus
    this.router.navigate(['/nucleus/list']);
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.nucleusForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldErrorMessage(fieldName: string): string {
    const field = this.nucleusForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return `${fieldName} est requis`;
    if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
    return 'Champ invalide';
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.nucleusForm.controls).forEach(key => {
      this.nucleusForm.get(key)?.markAsTouched();
    });
  }

  formatActivitySector(sector: ActivitySector): string {
    return sector.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  canSubmit(): boolean {
    return this.nucleusForm.valid && !this.submitting;
  }

  private showMessage(message: string, severity: 'success' | 'error'): void {
    this.messageService.add({
      severity,
      summary: severity === 'error' ? 'Erreur' : 'Succès',
      detail: message,
      life: 5000
    });
  }
}