import { Component, OnInit } from '@angular/core';
import { ReqRes } from 'src/app/CoopStore/models/ReqRes';
import { AdminService } from 'src/app/CoopStore/service/admin.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/CoopStore/service/auth.service';

@Component({
  selector: 'app-create-cooperative',
  standalone: true,
  templateUrl: './create-cooperative.component.html',
  styleUrls: ['./create-cooperative.component.css'],
  imports: [FormsModule, CommonModule]
})
export class CreateCooperativeComponent implements OnInit {

  name: string = '';
  city: string = '';
  loading: boolean = false;
  responseMessage: string = '';
  errorMessage: string = '';

  constructor(
    private usersService: AdminService,
    private authService: AuthService,
    private router: Router // ✅ Injection du router
  ) {}

  ngOnInit(): void {}

  async onSubmit() {
    this.responseMessage = '';
    this.errorMessage = '';

    if (!this.name.trim() || !this.city.trim()) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    this.loading = true;

    const userData = {
      name: this.name,
      city: this.city
    };

    const token = localStorage.getItem('token'); // ✅ Utilisation directe si `getToken()` n'existe pas

    if (!token) {
      this.errorMessage = 'Token non trouvé. Veuillez vous reconnecter.';
      this.loading = false;
      return;
    }

    try {
      const res: ReqRes = await this.usersService.createCooperativeByAdmin(userData, token);
      this.loading = false;

      if (res.statusCode === 200) {
        this.responseMessage = res.message || 'Coopérative créée avec succès !';
        this.name = '';
        this.city = '';
      } else {
        this.errorMessage = res.error || 'Erreur inconnue';
      }
    } catch (error: any) {
      this.loading = false;
      this.errorMessage = error.message || 'Erreur lors de la création';
    }
  }

  // ✅ Bouton de retour
  goBackToTable() {
    this.router.navigate(['/coaches/list']); // 🛠️ À adapter selon ta vraie route
  }
}