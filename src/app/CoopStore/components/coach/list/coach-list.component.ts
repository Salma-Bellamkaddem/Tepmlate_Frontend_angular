import { Component } from '@angular/core';
import { AdminService } from 'src/app/CoopStore/service/admin.service';
import { User } from 'src/app/CoopStore/models/user';
import { MessageService, Message } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import { TagModule } from 'primeng/tag';
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
import { AuthService } from 'src/app/CoopStore/service/auth.service';
@Component({
  selector: 'app-coach-list',
  standalone: true,
  providers: [MessageService],
  imports: [
    TagModule,
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
rows = 10;
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
     private router: Router ,
  
  private authService: AuthService 
    
  ) {
    this.users.forEach(user => {
      this.displayDialog[user.name] = false;
  });
  }


  ngOnInit(): void {
 
    this.searchForm = this.fb.group({ userName: [''] });
    this.loadUsersLazy({ first: 0, rows: this.rows });

    this.searchForm = this.fb.group({
      userName: ['']
    });

    this.loadUsers(0, 5); // Charger les utilisateurs initiaux avec pagination
  }

  loadUsersLazy(event: any) {
    this.loading = true;
    const page = (event.first / event.rows) + 1;
    const size = event.rows;
    const keyword = this.searchForm.get('userName')?.value || '';
    const token = localStorage.getItem('token') || '';

    this.userService.getAllUsers(token, keyword, page, size)
      .then(response => {
        this.users = response.userList;
        this.totalElements = response.totalElements;

        // Init displayDialog
        this.users.forEach(user => {
          this.displayDialog[user.name] = false;
        });

        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        this.showErrorMessage('Erreur lors du chargement des utilisateurs.');
        console.error(error);
      });
  }


  noResults = false; // Ajoute cette propriété dans ton component


  showErrorMessage(message: string) {
    this.showError(message);
    this.showErrorViaToast();
  }

  async loadUsers(page: number, size: number, keyword: string = ''): Promise<void> {
    this.loading = true;
    this.noResults = false; // reset
    
    try {
      const token = localStorage.getItem('token') || '';
      const response = await this.userService.getAllUsers(token, keyword, page, size);
  
      if (response?.statusCode === 200 && Array.isArray(response.userList)) {
        this.users = response.userList;
        this.totalElements = response.totalElements ?? this.users.length;
        this.noResults = this.users.length === 0;
      } else {
        this.users = [];
        this.totalElements = 0;
        this.noResults = true;
        this.showError('No users found.');
        this.showErrorViaToast();
      }
    } catch (error: any) {
      this.users = [];
      this.totalElements = 0;
      this.noResults = true;
      this.showError(error?.message || 'An error occurred while fetching users.');
      this.showErrorViaToast();
    } finally {
      this.loading = false;
    }
  }
  
  

  async searchUserByName(): Promise<void> {
    const keyword = this.searchForm.get('userName')?.value?.trim() || '';
  
    // Appel de l'API avec mot-clé
    await this.loadUsers(0, 5, keyword);
  
    // Vérifie si aucun utilisateur n’est trouvé
    this.noResults = this.users?.length === 0;
  }

   
  
  
  onPageChange(event: any): void {
    const page = event.page;
    const size = event.rows;
    const keyword = this.searchForm.get('userName')?.value?.trim() || '';
    this.loadUsers(page, size, keyword);
  }

  navigateToDetails(userId: number): void {
    this.router.navigate(['coaches/details', userId]);
  }

  async deleteUser(userId: number): Promise<void> {
    const token = this.authService.getToken();
        if (!userId || isNaN(userId)) {
      this.showError('User ID is invalid');
      this.showErrorViaToast();
      return;
    }
  
    console.log('🗑️ Tentative de suppression de l’utilisateur avec ID:', userId);
  
    try {
      await this.userService.deleteUser(userId.toString(), token)
        .then(response => {
          console.log('✅ Utilisateur supprimé avec succès :', response);
          this.showSuccessViaToast();
          this.users = this.users.filter(user => user.id !== userId);
        })
        .catch(error => {
          console.error('❌ Erreur lors de la suppression (catch interne) :', error);
          this.showError(error.message || 'User not deleted');
          this.showErrorViaToast();
        });
  
    } catch (error: any) {
      console.error('❌ Erreur suppression :', error);
      this.showError(error?.message || 'User not detected');
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
  goToCreateCooperative(): void {
    this.router.navigate(['coaches/create-cooperative']);
  }

updateCooperative(userId: number): void {
  this.router.navigate(['coaches/update-cooperative', userId]);
}
goToNucleus(): void {
  console.log('Navigation vers /nucleus/list...');
  this.router.navigate(['/nucleus/list'])
    .then(success => {
      if (success) {
        console.log('✅ Navigation réussie !');
      } else {
        console.log('❌ Navigation échouée');
      }
    })
    .catch(error => {
      console.error('❌ Erreur:', error);
    });
}
  goToRegister() {
    this.router.navigate(['auth/register'], {
      queryParams: { role: 'ADMIN' }
    });
}}