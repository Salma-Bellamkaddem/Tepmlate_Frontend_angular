import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

// Vos services (ajustez les imports selon votre structure)
import { ActivitySector, NucleusResponse, NucleusService } from 'src/app/CoopStore/service/nucleus.service';

interface DropdownOption {
  label: string;
  value: string | ActivitySector;
  icon?: string;
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    TooltipModule,
    MenuModule,
    ToastModule
  ],
  templateUrl: './list.component.html',
  providers: [MessageService]
})
export class ListComponent implements OnInit {
// ✅ Nouvelles propriétés
lastViewedNucleusId: number | null = null;
  // Données
  nucleusList: NucleusResponse[] = [];
  filteredNucleus: NucleusResponse[] = [];
  
  // Pagination
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions = [5, 10, 25, 50];
  
  // Filtres
  searchTerm = '';
  selectedSector: ActivitySector | 'ALL' = 'ALL';
  selectedStatus: 'ALL' | 'ACTIVE' | 'INACTIVE' = 'ALL';
  
  // Options pour les dropdowns
  sectorOptions: DropdownOption[] = [];
  statusOptions: DropdownOption[] = [];
  
  // État
  loading = false;
  showCreateDialog = false;
  
  // Secteurs d'activité
  activitySectors = Object.values(ActivitySector);

  constructor(
    private nucleusService: NucleusService,
    private router: Router,
    private messageService: MessageService
  ) {
    const lastId = localStorage.getItem('lastViewedNucleusId');
    if (lastId) {
      this.lastViewedNucleusId = +lastId;
    }
    this.initializeDropdownOptions();
  }

  ngOnInit(): void {
    this.loadNucleusList();
  }

  /**
   * Initialiser les options des dropdowns
   */
  private initializeDropdownOptions(): void {
    // Options secteur
    this.sectorOptions = [
      { label: 'Tous les secteurs', value: 'ALL', icon: 'pi pi-list' },
      ...this.activitySectors.map(sector => ({
        label: this.formatActivitySector(sector),
        value: sector
      }))
    ];

    // Options statut
    this.statusOptions = [
      { label: 'Tous les statuts', value: 'ALL', icon: 'pi pi-list' },
      { label: 'Actifs seulement', value: 'ACTIVE', icon: 'pi pi-check-circle' },
      { label: 'Inactifs seulement', value: 'INACTIVE', icon: 'pi pi-times-circle' }
    ];
  }

  /**
   * Charger la liste des nucleus
   */
  loadNucleusList(): void {
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.showMessage('Token d\'authentification manquant', 'error');
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;

    this.nucleusService.getAllNucleus(this.currentPage, this.pageSize, 'name')
      .subscribe({
        next: (response) => {
          this.nucleusList = response.content;
          this.totalElements = response.totalElements;
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement:', error);
          this.showMessage('Erreur lors du chargement des nucleus', 'error');
          this.loading = false;
        }
      });
  }

  /**
   * Gestion de la pagination
   */
  onPageChange(event: any): void {
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    this.loadNucleusList();
  }


  /**
   * Recherche
   */
  onSearchChange(event: any): void {
    this.searchTerm = event.target?.value || '';
    this.applyFilters();
  }

  /**
   * Changement de secteur
   */
  onSectorChange(): void {
    this.applyFilters();
  }

  /**
   * Changement de statut
   */
  onStatusChange(): void {
    this.applyFilters();
  }

  navigateToMembers(nucleusId: number): void {
    // Sauvegarder l'ID pour l'accès rapide
    this.lastViewedNucleusId = nucleusId;
    localStorage.setItem('lastViewedNucleusId', nucleusId.toString());
    
    // Naviguer vers la page de gestion des membres
    this.router.navigate(['/nucleus', nucleusId, 'members']);
  }
 /**
   * ✅ Navigation vers les membres du dernier nucleus consulté
   */
 navigateToLastMembers(): void {
  if (this.lastViewedNucleusId) {
    this.navigateToMembers(this.lastViewedNucleusId);
  }
}
  /**
   * Appliquer tous les filtres
   */
  applyFilters(): void {
    this.filteredNucleus = this.nucleusList.filter(nucleus => {
      // Recherche textuelle
      const matchesSearch = !this.searchTerm || 
        nucleus.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (nucleus.facilitatorName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false) ||
        (nucleus.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false);
      
      // Filtre par secteur
      const matchesSector = this.selectedSector === 'ALL' || 
        nucleus.activitySector === this.selectedSector;
      
      // Filtre par statut
      const matchesStatus = this.selectedStatus === 'ALL' ||
        (this.selectedStatus === 'ACTIVE' && nucleus.active) ||
        (this.selectedStatus === 'INACTIVE' && !nucleus.active);
      
      return matchesSearch && matchesSector && matchesStatus;
    });
  }

  /**
   * Réinitialiser les filtres
   */
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedSector = 'ALL';
    this.selectedStatus = 'ALL';
    this.applyFilters();
  }

  /**
   * Vérifier si des filtres sont actifs
   */
  hasActiveFilters(): boolean {
    return this.searchTerm !== '' || 
           this.selectedSector !== 'ALL' || 
           this.selectedStatus !== 'ALL';
  }
  onNucleusCreated(nucleus: NucleusResponse): void {
    // Recharger la liste pour inclure le nouveau nucleus
    this.loadNucleusList();
    
    // Afficher un message de succès
    this.showMessage(`Nucleus "${nucleus.name}" créé avec succès !`, 'success');
    
    // Fermer le dialog
    this.showCreateDialog = false;
  }



  /**
   * Ouvrir le dialog de création
   */
  openCreateDialog(): void {
    this.router.navigate(['/nucleus/create']);
  }

  /**
   * Fermer le dialog de création
   */
  closeCreateDialog(): void {
    this.showCreateDialog = false;
  }

  /**
   * Voir les détails du nucleus
   */
  viewNucleusDetails(nucleusId: number): void {
    this.router.navigate(['/nucleus', nucleusId]);
  }

  /**
   * Gérer les membres
   */
  manageMembers(nucleusId: number): void {
    this.router.navigate(['/nucleus', nucleusId, 'members']);
  }

  /**
   * Rafraîchir
   */
  refresh(): void {
    this.currentPage = 0;
    this.clearFilters();
    this.loadNucleusList();
    this.showMessage('Données actualisées', 'success');
  }

  /**
   * Exporter les données
   */
  exportData(): void {
    this.showMessage('Fonctionnalité d\'export en cours de développement', 'info');
  }

  /**
   * Obtenir les items du menu contextuel
   */
  getMenuItems(nucleus: NucleusResponse): any[] {
    return [
      {
        label: 'Modifier',
        icon: 'pi pi-pencil',
        command: () => this.editNucleus(nucleus)
      },
      {
        label: nucleus.active ? 'Désactiver' : 'Activer',
        icon: nucleus.active ? 'pi pi-eye-slash' : 'pi pi-eye',
        command: () => this.toggleNucleusStatus(nucleus)
      },
      {
        separator: true
      },
      {
        label: 'Supprimer',
        icon: 'pi pi-trash',
        command: () => this.deleteNucleus(nucleus),
        disabled: nucleus.memberCount > 0,
        styleClass: 'text-red-500'
      }
    ];
  }

  /**
   * Éditer un nucleus
   */
  editNucleus(nucleus: NucleusResponse): void {
    this.showMessage(`Édition de "${nucleus.name}" en cours de développement`, 'info');
  }

  /**
   * Activer/Désactiver un nucleus
   */
  toggleNucleusStatus(nucleus: NucleusResponse): void {
    const action = nucleus.active ? 'désactiver' : 'activer';
    
    if (confirm(`Êtes-vous sûr de vouloir ${action} le nucleus "${nucleus.name}" ?`)) {
      this.nucleusService.toggleNucleusStatus(nucleus.id, !nucleus.active)
        .subscribe({
          next: () => {
            this.loadNucleusList();
            this.showMessage(`Nucleus ${action} avec succès`, 'success');
          },
          error: (error) => {
            console.error(`Erreur lors de l'${action}ion:`, error);
            this.showMessage(`Erreur lors de l'${action}ion du nucleus`, 'error');
          }
        });
    }
  }

  /**
   * Supprimer un nucleus
   */
  deleteNucleus(nucleus: NucleusResponse): void {
    if (nucleus.memberCount > 0) {
      this.showMessage('Impossible de supprimer un nucleus qui contient des membres', 'error');
      return;
    }

    if (confirm(`Êtes-vous sûr de vouloir supprimer le nucleus "${nucleus.name}" ? Cette action est irréversible.`)) {
      this.nucleusService.deleteNucleus(nucleus.id)
        .subscribe({
          next: () => {
            this.loadNucleusList();
            this.showMessage('Nucleus supprimé avec succès', 'success');
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            const errorMessage = error.error?.message || 'Erreur lors de la suppression du nucleus';
            this.showMessage(errorMessage, 'error');
          }
        });
    }
  }

  /**
   * Utilitaires pour l'affichage
   */
  formatActivitySector(sector: ActivitySector): string {
    return sector.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getOccupancyPercentage(nucleus: NucleusResponse): number {
    return nucleus.maxMembers > 0 ? (nucleus.memberCount / nucleus.maxMembers) * 100 : 0;
  }

  getStatusText(nucleus: NucleusResponse): string {
    if (!nucleus.active) return 'Inactif';
    if (nucleus.full) return 'Complet';
    return 'Actif';
  }

  getStatusSeverity(nucleus: NucleusResponse): 'success' | 'warning' | 'danger' {
    if (!nucleus.active) return 'danger';
    if (nucleus.full) return 'warning';
    return 'success';
  }

  getStatusIcon(nucleus: NucleusResponse): string {
    if (!nucleus.active) return 'pi pi-times-circle';
    if (nucleus.full) return 'pi pi-exclamation-triangle';
    return 'pi pi-check-circle';
  }

  getRowClass(nucleus: NucleusResponse): string {
    if (!nucleus.active) return 'text-400';
    return '';
  }
  navigateToCreate(): void {
    this.router.navigate(['/nucleus/create']);
  }

  /**
   * Afficher un message toast
   */
  private showMessage(message: string, severity: 'success' | 'error' | 'info'): void {
    this.messageService.add({
      severity: severity,
      summary: severity === 'error' ? 'Erreur' : severity === 'success' ? 'Succès' : 'Information',
      detail: message,
      life: 5000
    });
  }
}