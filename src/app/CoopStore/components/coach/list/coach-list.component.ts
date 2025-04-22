import { Component } from '@angular/core';
import { AdminService } from 'src/app/CoopStore/service/admin.service';
import { User } from 'src/app/CoopStore/models/user';
import { MessageService, Message } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";

import { CommonModule } from '@angular/common'; 
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import {TableModule} from "primeng/table";
import {DialogModule} from "primeng/dialog";
import {PaginatorModule} from "primeng/paginator";
import {ToastModule} from "primeng/toast";
@Component({
  selector: 'app-coach-list',
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule, 
    ButtonModule,
    RippleModule,
    InputTextModule,
    DropdownModule,
    FileUploadModule,
    InputTextareaModule,
    FileUploadModule,
    InputGroupAddonModule,
    TableModule,
    ReactiveFormsModule,
    DialogModule,
        InputTextareaModule,
        InputGroupModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    PaginatorModule,
    ToastModule,
    // Ajoutez-le ici
    // Autres modules que vous utilisez
  ],
  templateUrl: './coach-list.component.html',
  styleUrl: './coach-list.component.scss'
})
export class CoachListComponent    {
// Add this property to manage dialog visibility for each coach
displayDialog: { [key: string]: boolean } = {};

  users: User[] = [];
  totalElements: number = 0;
  loading = false;
  msgs: Message[] = [];
  errorMessage = '';
  display: boolean = false;
  searchForm!: FormGroup;

  constructor(
    private userService: AdminService,
    private  route: ActivatedRoute,
    private  messageService: MessageService,
    private  fb: FormBuilder,
     private router: Router
    
  ) {
    this.users.forEach(user => {
      this.displayDialog[user.name] = false;
  });
  }


  ngOnInit(): void {
 
 

    this.searchForm = this.fb.group({
      userName: ['']
    });

    this.loadUsers(0, 5); // Charger les utilisateurs initiaux avec pagination
  }

  async loadUsers(page: number, size: number): Promise<void> {
    this.loading = true;
    try {
        const token = localStorage.getItem('token') || ''; // Ajoute cette méthode ou récupère ton token comme tu le fais d’habitude
      const response = await this.userService.getAllUsers(token, '', page, size);
  
      if (response?.statusCode === 200 && Array.isArray(response.ourUsersList)) {
        this.users = response.ourUsersList;
        this.totalElements = response.totalElements ?? this.users.length;
      } else {
        this.users = [];
        this.totalElements = 0;
        this.showError('No users found.');
        this.showErrorViaToast();
      }
    } catch (error: any) {
      this.showError(error?.message || 'An error occurred while fetching users.');
      this.showErrorViaToast();
    } finally {
      this.loading = false;
    }
  }

  
  async searchUserByName(): Promise<void> {
    const name = this.searchForm.get('userName')?.value?.trim();
  
    if (!name) {
      // Si le champ est vide, on recharge tous les utilisateurs (page 0, taille 5)
      this.loadUsers(0, 5);
      return;
    }
  
    const token = localStorage.getItem('token') || ''; // Assure-toi que cette méthode existe, ou remplace par localStorage.getItem('token') || ''
  
    try {
      const data = await this.userService.searchUsersByName(name, token); // 'await' doit être utilisé dans une fonction async
  
      if (data?.ourUsersList?.length > 0) {
        this.users = data.ourUsersList;
        this.totalElements = data.totalElements ?? this.users.length;
      } else {
        this.showError('Aucun utilisateur trouvé avec ce nom.');
        this.users = [];
        this.totalElements = 0;
      }
    } catch (err: any) {
      console.error('Erreur lors de la recherche :', err);
      this.showError('Erreur lors de la recherche de l’utilisateur.');
      this.showErrorViaToast();
      this.users = [];
      this.totalElements = 0;
    }
  }

   
  
  
  onPageChange(event: any): void {
    const page = event.page;
    const size = event.rows;
    this.loadUsers(page, size); // Assure-toi que loadUsers(page, size) utilise bien le token
  }

  navigateToDetails(userId: number): void {
    this.router.navigate(['users/details'], { queryParams: { id: userId } });
  }

  async deleteUser(userId: number): Promise<void> {
    const confirmDelete = confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        this.showError('Authentication token missing.');
        this.showErrorViaToast();
        return;
      }

      await this.userService.deleteUser(userId.toString(), token);
      this.showSuccessViaToast();
      this.loadUsers(0, 5); // refresh list
    } catch (error: any) {
      this.showError(error.message || 'Error deleting user.');
      this.showErrorViaToast();
    }
  }

  showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  showSuccessViaToast(): void {
    this.messageService.add({
      key: 'tst2',
      severity: 'success',
      summary: 'Success',
      detail: 'User successfully deleted'
    });
  }

  showErrorViaToast(): void {
    this.messageService.add({
      key: 'tst3',
      severity: 'error',
      summary: 'Error',
      detail: 'User not deleted'
    });
  }

  showSuccessViaMessages(action: string): void {
    this.msgs = [];
    if (action === 'add') {
      this.msgs.push({ severity: 'success', summary: 'Success Message', detail: 'User successfully added' });
    } else if (action === 'update') {
      this.msgs.push({ severity: 'success', summary: 'Success Message', detail: 'User successfully updated' });
    }
  }

  goToRegister() {
    this.router.navigate(['auth/register'], {
      queryParams: { role: 'ADMIN' }
    });
}}