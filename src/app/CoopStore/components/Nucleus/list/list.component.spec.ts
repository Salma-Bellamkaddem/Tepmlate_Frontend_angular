// src/app/components/admin/list/list.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

// ✅ IMPORTS PRIMENG
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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { ListComponent } from './list.component';
import { ActivitySector, NucleusResponse, NucleusService, PageResponse } from 'src/app/CoopStore/service/nucleus.service';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let nucleusService: jasmine.SpyObj<NucleusService>;
  let router: jasmine.SpyObj<Router>;
  let messageService: jasmine.SpyObj<MessageService>;

  // ✅ MOCK DATA
  const mockNucleusResponse: NucleusResponse = {
    id: 1,
    name: 'Nucleus Test Agriculture',
    description: 'Description test du nucleus agriculture',
    activitySector: ActivitySector.AGRICULTURE,
    active: true,
    maxMembers: 20,
    memberCount: 5,
    full: false,
    facilitatorId: 1,
    facilitatorName: 'Facilitateur Test',
    members: []
  };

  const mockInactiveNucleus: NucleusResponse = {
    id: 2,
    name: 'Nucleus Inactif',
    description: 'Nucleus désactivé',
    activitySector: ActivitySector.ARTISANAT,
    active: false,
    maxMembers: 15,
    memberCount: 3,
    full: false,
    facilitatorId: 2,
    facilitatorName: 'Facilitateur Inactif',
    members: []
  };

  const mockFullNucleus: NucleusResponse = {
    id: 3,
    name: 'Nucleus Complet',
    description: 'Nucleus au maximum de sa capacité',
    activitySector: ActivitySector.AGROALIMENTAIRE,
    active: true,
    maxMembers: 10,
    memberCount: 10,
    full: true,
    facilitatorId: 3,
    facilitatorName: 'Facilitateur Complet',
    members: []
  };

  const mockPageResponse: PageResponse<NucleusResponse> = {
    content: [mockNucleusResponse, mockInactiveNucleus, mockFullNucleus],
    totalElements: 3,
    totalPages: 1,
    size: 10,
    number: 0,
    first: true,
    last: true
  };

  beforeEach(async () => {
    // ✅ CRÉATION DES SPIES POUR PRIMENG
    const nucleusServiceSpy = jasmine.createSpyObj('NucleusService', [
      'getAllNucleus',
      'deleteNucleus',
      'toggleNucleusStatus'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [
        ListComponent, // Standalone component
        BrowserAnimationsModule,
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
      providers: [
        { provide: NucleusService, useValue: nucleusServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    nucleusService = TestBed.inject(NucleusService) as jasmine.SpyObj<NucleusService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;

    // ✅ Setup localStorage mock
    spyOn(localStorage, 'getItem').and.returnValue('mock-token');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.totalElements).toBe(0);
      expect(component.pageSize).toBe(10);
      expect(component.currentPage).toBe(0);
      expect(component.searchTerm).toBe('');
      expect(component.selectedSector).toBe('ALL');
      expect(component.selectedStatus).toBe('ALL');
      expect(component.loading).toBe(false);
      expect(component.showCreateDialog).toBe(false);
    });

    it('should initialize dropdown options correctly', () => {
      component.ngOnInit();
      
      expect(component.sectorOptions.length).toBeGreaterThan(1);
      expect(component.statusOptions.length).toBe(3);
      expect(component.sectorOptions[0].value).toBe('ALL');
      expect(component.statusOptions[0].value).toBe('ALL');
    });

    it('should load nucleus list on init', () => {
      nucleusService.getAllNucleus.and.returnValue(of(mockPageResponse));
      
      component.ngOnInit();
      
      expect(nucleusService.getAllNucleus).toHaveBeenCalledWith(0, 10, 'name');
      expect(component.nucleusList.length).toBe(3);
      expect(component.totalElements).toBe(3);
    });
  });

  describe('Data Loading', () => {
    it('should handle successful data loading', () => {
      nucleusService.getAllNucleus.and.returnValue(of(mockPageResponse));
      
      component.loadNucleusList();
      
      expect(component.loading).toBe(false);
      expect(component.nucleusList).toEqual(mockPageResponse.content);
      expect(component.totalElements).toBe(3);
      expect(component.filteredNucleus.length).toBe(3);
    });

    it('should handle error during data loading', () => {
      const error = new Error('Network error');
      nucleusService.getAllNucleus.and.returnValue(throwError(() => error));
      
      component.loadNucleusList();
      
      expect(component.loading).toBe(false);
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Erreur lors du chargement des nucleus',
        life: 5000
      });
    });

    it('should handle missing token', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);
      
      component.loadNucleusList();
      
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Token d\'authentification manquant',
        life: 5000
      });
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should refresh data correctly', () => {
      nucleusService.getAllNucleus.and.returnValue(of(mockPageResponse));
      spyOn(component, 'clearFilters');
      
      component.refresh();
      
      expect(component.currentPage).toBe(0);
      expect(component.clearFilters).toHaveBeenCalled();
      expect(nucleusService.getAllNucleus).toHaveBeenCalled();
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Succès',
        detail: 'Données actualisées',
        life: 5000
      });
    });
  });

  describe('Search and Filtering', () => {
    beforeEach(() => {
      component.nucleusList = mockPageResponse.content;
      component.applyFilters();
    });

    it('should perform search correctly', () => {
      const mockEvent = { target: { value: 'Agriculture' } };
      
      component.onSearchChange(mockEvent);
      
      expect(component.searchTerm).toBe('Agriculture');
      expect(component.filteredNucleus.length).toBe(1);
      expect(component.filteredNucleus[0].name).toContain('Agriculture');
    });

    it('should filter by sector correctly', () => {
      component.selectedSector = ActivitySector.AGRICULTURE;
      component.onSectorChange();
      
      expect(component.filteredNucleus.length).toBe(1);
      expect(component.filteredNucleus[0].activitySector).toBe(ActivitySector.AGRICULTURE);
    });

    it('should filter by status correctly', () => {
      component.selectedStatus = 'ACTIVE';
      component.onStatusChange();
      
      const activeNucleus = component.filteredNucleus;
      expect(activeNucleus.every(n => n.active)).toBe(true);
      
      component.selectedStatus = 'INACTIVE';
      component.onStatusChange();
      
      const inactiveNucleus = component.filteredNucleus;
      expect(inactiveNucleus.every(n => !n.active)).toBe(true);
    });

    it('should clear all filters', () => {
      component.searchTerm = 'test';
      component.selectedSector = ActivitySector.AGRICULTURE;
      component.selectedStatus = 'ACTIVE';
      
      component.clearFilters();
      
      expect(component.searchTerm).toBe('');
      expect(component.selectedSector).toBe('ALL');
      expect(component.selectedStatus).toBe('ALL');
      expect(component.filteredNucleus.length).toBe(3);
    });

    it('should detect active filters correctly', () => {
      expect(component.hasActiveFilters()).toBe(false);
      
      component.searchTerm = 'test';
      expect(component.hasActiveFilters()).toBe(true);
      
      component.searchTerm = '';
      component.selectedSector = ActivitySector.AGRICULTURE;
      expect(component.hasActiveFilters()).toBe(true);
      
      component.selectedSector = 'ALL';
      component.selectedStatus = 'ACTIVE';
      expect(component.hasActiveFilters()).toBe(true);
    });
  });

  describe('Nucleus Operations', () => {
    it('should toggle nucleus status successfully', () => {
      nucleusService.toggleNucleusStatus.and.returnValue(of(mockNucleusResponse));
      nucleusService.getAllNucleus.and.returnValue(of(mockPageResponse));
      spyOn(window, 'confirm').and.returnValue(true);
      
      component.toggleNucleusStatus(mockNucleusResponse);
      
      expect(nucleusService.toggleNucleusStatus).toHaveBeenCalledWith(1, false);
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Succès',
        detail: 'Nucleus désactiver avec succès',
        life: 5000
      });
    });

    it('should not toggle status when user cancels', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      
      component.toggleNucleusStatus(mockNucleusResponse);
      
      expect(nucleusService.toggleNucleusStatus).not.toHaveBeenCalled();
    });

    it('should delete nucleus when confirmed and no members', () => {
      const nucleusWithoutMembers = { ...mockNucleusResponse, memberCount: 0 };
      nucleusService.deleteNucleus.and.returnValue(of(undefined));
      nucleusService.getAllNucleus.and.returnValue(of(mockPageResponse));
      spyOn(window, 'confirm').and.returnValue(true);
      
      component.deleteNucleus(nucleusWithoutMembers);
      
      expect(nucleusService.deleteNucleus).toHaveBeenCalledWith(1);
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Succès',
        detail: 'Nucleus supprimé avec succès',
        life: 5000
      });
    });

    it('should not delete nucleus with members', () => {
      component.deleteNucleus(mockNucleusResponse);
      
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de supprimer un nucleus qui contient des membres',
        life: 5000
      });
      expect(nucleusService.deleteNucleus).not.toHaveBeenCalled();
    });

    it('should navigate to nucleus details', () => {
      component.viewNucleusDetails(1);
      
      expect(router.navigate).toHaveBeenCalledWith(['/admin/nucleus', 1]);
    });

    it('should navigate to manage members', () => {
      component.manageMembers(1);
      
      expect(router.navigate).toHaveBeenCalledWith(['/admin/nucleus', 1, 'members']);
    });
  });

  describe('Dialog Operations', () => {
    it('should open create dialog', () => {
      component.openCreateDialog();
      
      expect(component.showCreateDialog).toBe(true);
    });

    it('should close create dialog', () => {
      component.showCreateDialog = true;
      
      component.closeCreateDialog();
      
      expect(component.showCreateDialog).toBe(false);
    });

    it('should show info message when editing nucleus', () => {
      component.editNucleus(mockNucleusResponse);
      
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'info',
        summary: 'Information',
        detail: 'Édition de "Nucleus Test Agriculture" en cours de développement',
        life: 5000
      });
    });

    it('should show info message when exporting data', () => {
      component.exportData();
      
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'info',
        summary: 'Information',
        detail: 'Fonctionnalité d\'export en cours de développement',
        life: 5000
      });
    });
  });

  describe('Utility Methods', () => {
    it('should get correct status severity', () => {
      expect(component.getStatusSeverity(mockNucleusResponse)).toBe('success');
      expect(component.getStatusSeverity(mockInactiveNucleus)).toBe('danger');
      expect(component.getStatusSeverity(mockFullNucleus)).toBe('warning');
    });

    it('should get correct status text', () => {
      expect(component.getStatusText(mockNucleusResponse)).toBe('Actif');
      expect(component.getStatusText(mockInactiveNucleus)).toBe('Inactif');
      expect(component.getStatusText(mockFullNucleus)).toBe('Complet');
    });

    it('should get correct status icon', () => {
      expect(component.getStatusIcon(mockNucleusResponse)).toBe('pi pi-check-circle');
      expect(component.getStatusIcon(mockInactiveNucleus)).toBe('pi pi-times-circle');
      expect(component.getStatusIcon(mockFullNucleus)).toBe('pi pi-exclamation-triangle');
    });

    it('should calculate occupancy percentage correctly', () => {
      expect(component.getOccupancyPercentage(mockNucleusResponse)).toBe(25); // 5/20 * 100
      expect(component.getOccupancyPercentage(mockFullNucleus)).toBe(100); // 10/10 * 100
      
      const emptyNucleus = { ...mockNucleusResponse, memberCount: 0, maxMembers: 0 };
      expect(component.getOccupancyPercentage(emptyNucleus)).toBe(0);
    });

    it('should format activity sector correctly', () => {
      expect(component.formatActivitySector(ActivitySector.AGROALIMENTAIRE))
        .toBe('Agro Alimentaire');
      expect(component.formatActivitySector(ActivitySector.AGRICULTURE))
        .toBe('Agriculture');
    });

    it('should get correct row class', () => {
      expect(component.getRowClass(mockNucleusResponse)).toBe('');
      expect(component.getRowClass(mockInactiveNucleus)).toBe('text-400');
    });

    it('should generate menu items correctly', () => {
      const menuItems = component.getMenuItems(mockNucleusResponse);
      
      expect(menuItems.length).toBe(4); // Modifier, Activer/Désactiver, Separator, Supprimer
      expect(menuItems[0].label).toBe('Modifier');
      expect(menuItems[1].label).toBe('Désactiver'); // mockNucleusResponse is active
      expect(menuItems[3].label).toBe('Supprimer');
      expect(menuItems[3].disabled).toBe(true); // has members
    });
  });

  describe('Pagination', () => {
    it('should handle page change correctly', () => {
      nucleusService.getAllNucleus.and.returnValue(of(mockPageResponse));
      const pageEvent = { first: 20, rows: 20 }; // PrimeNG page event format
      
      component.onPageChange(pageEvent);
      
      expect(component.currentPage).toBe(1); // 20 / 20 = 1
      expect(component.pageSize).toBe(20);
      expect(nucleusService.getAllNucleus).toHaveBeenCalledWith(1, 20, 'name');
    });
  });

  describe('Error Handling', () => {
    it('should handle toggle status error', () => {
      nucleusService.toggleNucleusStatus.and.returnValue(
        throwError(() => new Error('Network error'))
      );
      spyOn(window, 'confirm').and.returnValue(true);
      
      component.toggleNucleusStatus(mockNucleusResponse);
      
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Erreur lors de l\'désactiveion du nucleus',
        life: 5000
      });
    });

    it('should handle delete error', () => {
      const nucleusWithoutMembers = { ...mockNucleusResponse, memberCount: 0 };
      nucleusService.deleteNucleus.and.returnValue(
        throwError(() => ({ error: { message: 'Server error' } }))
      );
      spyOn(window, 'confirm').and.returnValue(true);
      
      component.deleteNucleus(nucleusWithoutMembers);
      
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Server error',
        life: 5000
      });
    });
  });

  describe('Component DOM', () => {
    beforeEach(() => {
      nucleusService.getAllNucleus.and.returnValue(of(mockPageResponse));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should render search input', () => {
      const searchInput = fixture.debugElement.query(By.css('input[pInputText]'));
      expect(searchInput).toBeTruthy();
    });

    it('should render sector dropdown', () => {
      const sectorDropdown = fixture.debugElement.query(By.css('p-dropdown'));
      expect(sectorDropdown).toBeTruthy();
    });

    it('should render nucleus table', () => {
      const table = fixture.debugElement.query(By.css('p-table'));
      expect(table).toBeTruthy();
    });

    it('should render action buttons', () => {
      const actionButtons = fixture.debugElement.queryAll(By.css('p-button'));
      expect(actionButtons.length).toBeGreaterThan(0);
    });

    it('should render status tags', () => {
      const statusTags = fixture.debugElement.queryAll(By.css('p-tag'));
      expect(statusTags.length).toBeGreaterThan(0);
    });

    it('should render progress bars for capacity', () => {
      const progressBars = fixture.debugElement.queryAll(By.css('p-progressBar'));
      expect(progressBars.length).toBeGreaterThan(0);
    });

    it('should show loading spinner when loading', () => {
      component.loading = true;
      fixture.detectChanges();
      
      const spinner = fixture.debugElement.query(By.css('p-progressSpinner'));
      expect(spinner).toBeTruthy();
    });

    it('should show no data message when no nucleus found', () => {
      component.filteredNucleus = [];
      component.loading = false;
      fixture.detectChanges();
      
      const noDataMessage = fixture.debugElement.query(By.css('.text-center'));
      expect(noDataMessage).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    beforeEach(() => {
      nucleusService.getAllNucleus.and.returnValue(of(mockPageResponse));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should trigger search when typing in search input', () => {
      spyOn(component, 'onSearchChange').and.callThrough();
      const searchInput = fixture.debugElement.query(By.css('input[pInputText]'));
      
      searchInput.nativeElement.value = 'Agriculture';
      searchInput.nativeElement.dispatchEvent(new Event('input'));
      
      expect(component.onSearchChange).toHaveBeenCalled();
    });

    it('should call refresh when clicking refresh button', () => {
      spyOn(component, 'refresh').and.callThrough();
      const refreshButtons = fixture.debugElement.queryAll(By.css('p-button'));
      const refreshButton = refreshButtons.find(btn => 
        btn.nativeElement.querySelector('.pi-refresh')
      );
      
      if (refreshButton) {
        refreshButton.nativeElement.click();
        expect(component.refresh).toHaveBeenCalled();
      }
    });

    it('should call openCreateDialog when clicking create button', () => {
      spyOn(component, 'openCreateDialog').and.callThrough();
      const createButtons = fixture.debugElement.queryAll(By.css('p-button'));
      const createButton = createButtons.find(btn => 
        btn.nativeElement.textContent?.includes('Nouveau Nucleus')
      );
      
      if (createButton) {
        createButton.nativeElement.click();
        expect(component.openCreateDialog).toHaveBeenCalled();
      }
    });
  });

  describe('Filter Combinations', () => {
    beforeEach(() => {
      component.nucleusList = mockPageResponse.content;
    });

    it('should show all nucleus when filters are reset', () => {
      component.selectedSector = 'ALL';
      component.selectedStatus = 'ALL';
      component.searchTerm = '';
      component.applyFilters();
      
      expect(component.filteredNucleus.length).toBe(3);
    });

    it('should combine multiple filters', () => {
      component.selectedSector = ActivitySector.AGRICULTURE;
      component.selectedStatus = 'ACTIVE';
      component.searchTerm = 'Agriculture';
      component.applyFilters();
      
      const results = component.filteredNucleus;
      expect(results.length).toBe(1);
      expect(results[0].activitySector).toBe(ActivitySector.AGRICULTURE);
      expect(results[0].active).toBe(true);
      expect(results[0].name).toContain('Agriculture');
    });

    it('should return empty results when no matches', () => {
      component.searchTerm = 'NonExistentNucleus';
      component.applyFilters();
      
      expect(component.filteredNucleus.length).toBe(0);
    });
  });
});