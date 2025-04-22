// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { User } from 'src/app/CoopStore/models/user'; // Importation de l'interface User
import { AuthService } from 'src/app/CoopStore/service/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppConfigComponent } from 'src/app/layout/config/app.config.component';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    standalone: false,
})
export class LoginComponent {
    rememberMe: boolean = false;
    user: User = { email: '', password: '', role: '', name: '' };  // Utilisation de l'interface User

    constructor(
        private readonly authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {}

    async handleSubmit(): Promise<void> {
        if (!this.user.email || !this.user.password) {
            this.showError("Email et mot de passe sont requis.");
            return;
        }

        try {
            const response = await this.authService.login(this.user.email, this.user.password);

            if (response && response.statusCode === 200) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('role', response.role);

                this.redirectUserByRole(response.role);
            } else {
                this.showError(response?.message || "Échec de la connexion.");
            }
        } catch (error: any) {
            this.showError(error?.error?.message || error?.message || 'Erreur inattendue lors de la connexion.');
        }
    }
    ngOnInit(): void {
        if (this.authService.currentUserValue?.id) {
          this.router.navigate(['/dashboards']);
        }
      }

    private redirectUserByRole(role: string): void {
        switch (role?.toUpperCase()) {
            case 'ADMIN':
                this.router.navigate(['/coaches']);
                break;
            case 'USER':
                this.router.navigate(['/dashboards']);
                break;
            case 'COOPERATIVE':
                this.router.navigate(['/coop']);
                break;
            default:
                this.router.navigate(['/']);
        }
    }

    private showError(message: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: message,
            life: 3000
        });
    }
}