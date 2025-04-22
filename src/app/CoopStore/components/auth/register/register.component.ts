import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/CoopStore/service/auth.service';
import { User } from 'src/app/CoopStore/models/user'; // Importation de l'interface User
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'; // si séparé
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    InputGroupModule,
    InputGroupAddonModule,
    DropdownModule,
    ButtonModule,
    RippleModule,
    
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  formData: User = {
    name: '',
    email: '',
    password: '',
    role: 'USER', // Valeur par défaut pour le rôle
    city: '',
  };

  roles: any[] = [
    { label: 'User', value: 'USER' },
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Cooperative', value: 'COOPERATIVE' },
  ];

  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private readonly router: Router
  ) {}

  // register method to handle form submission
  async register() {
    // Vérifie que tous les champs sont remplis
    if (
      !this.formData.name ||
      !this.formData.email ||
      !this.formData.password ||
      !this.formData.role ||
      !this.formData.city
    ) {
      this.showError('Please fill in all fields.');
      return;
    }
  
    // Confirmation de l'utilisateur
    const confirmRegistration = confirm('Are you sure you want to register this user?');
    if (!confirmRegistration) {
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await this.authService.register(this.formData, token);
      if (response.statusCode === 200) {
        this.router.navigate(['/users']);
      } else {
        this.showError(response.message);
      }
    } catch (error: any) {
      this.showError(error.message);
    }
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = ''; // Clear the error message after the specified duration
    }, 3000);
  } 
  

  // Method to navigate to the login page
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}