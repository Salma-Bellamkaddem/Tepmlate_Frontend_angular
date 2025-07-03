// src/app/CoopStore/components/Nucleus/members/nucleus-members.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
// Ajoutez cet import dans nucleus-members.component.ts
import { ChangeDetectorRef } from '@angular/core';
// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';

import { 
  CooperativeMemberResponse, 
  NucleusResponse, 
  NucleusService, 
  ActivitySector 
} from 'src/app/CoopStore/service/nucleus.service';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-nucleus-members',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    InputTextModule
  ],
  templateUrl: './members.component.html',
  providers: [MessageService, ConfirmationService]
})
export class NucleusMembersComponent implements OnInit {
  
  // ✅ Propriétés d'entrée/sortie corrigées
  @Input() nucleus: NucleusResponse | null = null;
  @Input() showDialog = false;
  @Input() pageMode = false; // true = mode page, false = mode dialog
  @Output() dialogClosed = new EventEmitter<void>();
  @Output() nucleusUpdated = new EventEmitter<NucleusResponse>();

  // ID du nucleus (récupéré depuis l'URL ou Input)
  nucleusId!: number;

  // Données
  currentMembers: CooperativeMemberResponse[] = [];
  availableCooperatives: CooperativeMemberResponse[] = [];
  facilitators: CooperativeMemberResponse[] = [];
  
  // Options pour les dropdowns
  availableCooperativesOptions: any[] = [];
  facilitatorOptions: any[] = [];
  
  // État
  loading = false;
  loadingCooperatives = false;
  addingMember = false;
  removingMemberId: number | null = null;
  changingFacilitator = false;
  
  // Sélections
  selectedCooperativeId: number | null = null;
  selectedFacilitatorId: number | null = null;

  constructor(
    private nucleusService: NucleusService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef // ✅ Ajout
  ) {}




  ngOnInit(): void {
    console.log('🔄 NucleusMembersComponent ngOnInit');
    console.log('📊 Input nucleus:', this.nucleus);
    console.log('🔧 Mode page:', this.pageMode);
    console.log('💬 Show dialog:', this.showDialog);

    // ✅ Priorité 1: Input nucleus (mode dialog depuis liste)
    if (this.nucleus) {
      this.nucleusId = this.nucleus.id;
      this.selectedFacilitatorId = this.nucleus.facilitatorId ?? null;
      console.log('✅ Nucleus fourni en input, ID:', this.nucleusId);
      this.initializeWithNucleus();
    }
    // ✅ Priorité 2: URL parameter (mode page)
    else {
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        this.nucleusId = +idParam;
        console.log('✅ ID nucleus capturé depuis l\'URL:', this.nucleusId);
        this.loadNucleusFromAPI();
      } else {
        console.error('❌ Aucun nucleus fourni ni ID dans l\'URL:');
      }
    }
  }

  /**
   * ✅ Initialiser avec le nucleus fourni en input
   */
  private initializeWithNucleus(): void {
  if (!this.nucleus) return;

  console.log('🔄 Initialisation avec nucleus:', this.nucleus);

  // Utiliser les membres déjà présents
  if (this.nucleus.members && this.nucleus.members.length > 0) {
    this.currentMembers = [...this.nucleus.members]; // ✅ Créer une nouvelle référence
    console.log('✅ Membres chargés depuis l\'input:', this.currentMembers);
  } else {
    console.warn('⚠️ Aucun membre dans le nucleus fourni');
    this.currentMembers = [];
  }

  // ✅ Forcer la détection de changements
  this.cdr.detectChanges();

  // Charger les données supplémentaires
  this.loadAvailableCooperatives();
  this.loadFacilitators();
}

  /**
   * ✅ Charger le nucleus depuis l'API (mode page)
   */
  private loadNucleusFromAPI(): void {
    this.loading = true;
  
    this.nucleusService.getNucleusWithMembers(this.nucleusId).subscribe({
      next: (data) => {
        this.nucleus = data;
        this.selectedFacilitatorId = this.nucleus.facilitatorId ?? null;
  
        if (this.nucleus.members && this.nucleus.members.length > 0) {
          this.currentMembers = [...this.nucleus.members]; // ✅ Créer une nouvelle référence
          console.log('✅ Membres chargés depuis l\'API:', this.currentMembers);
        } else {
          console.warn('⚠️ Aucun membre trouvé dans l\'API');
          this.currentMembers = [];
        }
  
        this.loadAvailableCooperatives();
        this.loadFacilitators();
        this.loading = false;
        
        // ✅ Forcer la détection de changements
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement du nucleus:', error);
        this.showMessage("Impossible de charger le nucleus avec ses membres", "error");
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  

  /**
   * ✅ Recharger toutes les données
   */
  loadData(): void {
    if (!this.nucleus?.id) {
      console.error('❌ Pas de nucleus à recharger');
      return;
    }

    this.loading = true;
    console.log('🔄 Rechargement des données pour nucleus ID:', this.nucleus.id);

    // Recharger le nucleus avec ses membres
    this.nucleusService.getNucleusWithMembers(this.nucleus.id).subscribe({
      next: (updatedNucleus) => {
        this.nucleus = updatedNucleus;
        
        if (this.nucleus.members) {
          this.currentMembers = this.nucleus.members;
          console.log('✅ Membres rechargés:', this.currentMembers);
        } else {
          this.currentMembers = [];
        }

        this.nucleusUpdated.emit(this.nucleus);
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors du rechargement:', error);
        this.loading = false;
      }
    });

    // Recharger les coopératives disponibles
    this.loadAvailableCooperatives();
  }

  /**
   * ✅ Charger les coopératives disponibles
   */
  private loadAvailableCooperatives(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.nucleus?.id) {
        resolve();
        return;
      }

      this.loadingCooperatives = true;

      this.nucleusService.getAvailableCooperatives(this.nucleus.id).subscribe({
        next: (cooperatives) => {
          this.availableCooperatives = cooperatives;
          this.updateAvailableCooperativesOptions();
          this.loadingCooperatives = false;
          console.log('✅ Coopératives disponibles chargées:', cooperatives);
          resolve();
        },
        error: (error) => {
          console.error('⚠️ Erreur coopératives disponibles:', error);
          this.availableCooperatives = [];
          this.updateAvailableCooperativesOptions();
          this.loadingCooperatives = false;
          resolve();
        }
      });
    });
  }

  /**
   * ✅ Charger les facilitateurs
   */
  private loadFacilitators(): void {
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.showMessage('Token manquant', 'error');
      this.router.navigate(['/login']);
      return;
    }

    // Utiliser des données par défaut si l'API n'est pas disponible
    if (this.nucleusService.getFacilitators) {
      this.nucleusService.getFacilitators().subscribe({
        next: (facilitators) => {
          this.facilitatorOptions = facilitators.map(f => ({
            label: `${f.cooperativeName} (${f.city})`,
            value: f.id 
          }));
          console.log('✅ Facilitateurs chargés:', this.facilitatorOptions);
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
      { label: 'Facilitateur Test 1 (test@example.com)', value: 1 },
      { label: 'Facilitateur Test 2 (test2@example.com)', value: 2 }
    ];
    console.log('✅ Facilitateurs par défaut définis');
  }

  /**
   * ✅ Mettre à jour les options des coopératives
   */
  private updateAvailableCooperativesOptions(): void {
    this.availableCooperativesOptions = this.availableCooperatives.map(coop => ({
      label: coop.cooperativeName,
      value: coop.id,
      name: coop.cooperativeName,
      sector: this.formatActivitySector(coop.activitySector),
      memberCount: coop.memberCount || 0
    }));
    console.log('✅ Options coopératives mises à jour:', this.availableCooperativesOptions);
  }

  /**
   * ✅ Ajouter un membre
   */
  addMember(): void {
    if (!this.selectedCooperativeId || !this.nucleus) {
      console.error('❌ Pas de coopérative sélectionnée ou pas de nucleus');
      return;
    }

    this.addingMember = true;
    console.log('🔄 Ajout membre:', this.selectedCooperativeId, 'au nucleus:', this.nucleus.id);

    this.nucleusService.addMemberToNucleus(this.nucleus.id, this.selectedCooperativeId).subscribe({
      next: (updatedNucleus) => {
        console.log('✅ Membre ajouté, nucleus mis à jour:', updatedNucleus);
        this.nucleus = updatedNucleus;
        
        // Mettre à jour la liste des membres
        if (updatedNucleus.members) {
          this.currentMembers = updatedNucleus.members;
        }
        
        this.nucleusUpdated.emit(updatedNucleus);
        this.selectedCooperativeId = null;
        this.showMessage('Membre ajouté avec succès', 'success');
        
        // Recharger les coopératives disponibles
        this.loadAvailableCooperatives();
        this.addingMember = false;
         // ✅ Forcer la détection de changements
      this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Erreur lors de l\'ajout:', error);
        let errorMessage = 'Erreur lors de l\'ajout du membre';
        if (error.error?.message) {
          errorMessage = error.error.message;
        }
        this.showMessage(errorMessage, 'error');
        this.addingMember = false;
      }
    });
  }
  trackByMemberId(index: number, member: CooperativeMemberResponse): number {
    return member.id;
  }
  /**
   * ✅ Retirer un membre
   */
  removeMember(cooperative: CooperativeMemberResponse): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir retirer "${cooperative.cooperativeName}" de ce nucleus ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.removingMemberId = cooperative.id;
        console.log('🔄 Suppression membre:', cooperative.id, 'du nucleus:', this.nucleus?.id);

        this.nucleusService.removeMemberFromNucleus(this.nucleus!.id, cooperative.id).subscribe({
          next: (updatedNucleus) => {
            console.log('✅ Membre retiré, nucleus mis à jour:', updatedNucleus);
            this.nucleus = updatedNucleus;
            
            // Mettre à jour la liste des membres
            if (updatedNucleus.members) {
              this.currentMembers = updatedNucleus.members;
            }
            
            this.nucleusUpdated.emit(updatedNucleus);
            this.showMessage('Membre retiré avec succès', 'success');
            
            // Recharger les coopératives disponibles
            this.loadAvailableCooperatives();
            this.removingMemberId = null;
          },
          error: (error) => {
            console.error('❌ Erreur lors de la suppression:', error);
            this.showMessage('Erreur lors de la suppression du membre', 'error');
            this.removingMemberId = null;
          }
        });
      }
    });
  }

  /**
   * ✅ Changer le facilitateur
   */
  onFacilitatorChange(): void {
    if (!this.selectedFacilitatorId || !this.nucleus) return;
    
    if (this.selectedFacilitatorId === this.nucleus.facilitatorId) return;

    this.changingFacilitator = true;
    console.log('🔄 Changement facilitateur:', this.selectedFacilitatorId);

    this.nucleusService.changeFacilitator(this.nucleus.id, this.selectedFacilitatorId).subscribe({
      next: (updatedNucleus) => {
        console.log('✅ Facilitateur changé:', updatedNucleus);
        this.nucleus = updatedNucleus;
        this.nucleusUpdated.emit(updatedNucleus);
        this.showMessage('Facilitateur changé avec succès', 'success');
        this.changingFacilitator = false;
      },
      error: (error) => {
        console.error('❌ Erreur changement facilitateur:', error);
        this.showMessage('Erreur lors du changement de facilitateur', 'error');
        this.selectedFacilitatorId = this.nucleus?.facilitatorId ?? null;
        this.changingFacilitator = false;
      }
    });
  }

  /**
   * ✅ Fermer le dialog
   */
  closeDialog(): void {
    this.showDialog = false;
    this.dialogClosed.emit();
  }

  /**
   * ✅ Formater le secteur d'activité
   */
  formatActivitySector(sector: any): string {
    if (!sector) return 'Non défini';
    return sector.toString().replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * ✅ Afficher un message
   */
  private showMessage(message: string, severity: 'success' | 'error'): void {
    this.messageService.add({
      severity,
      summary: severity === 'error' ? 'Erreur' : 'Succès',
      detail: message,
      life: 5000
    });
  }

  /**
   * ✅ Debug - Vérifier les données
   */
  debugData(): void {
    console.log('🔍 DEBUG - État actuel:');
    console.log('  - Nucleus:', this.nucleus);
    console.log('  - Current members:', this.currentMembers);
    console.log('  - Available cooperatives:', this.availableCooperatives);
    console.log('  - Loading:', this.loading);
    console.log('  - Show dialog:', this.showDialog);
  }
}