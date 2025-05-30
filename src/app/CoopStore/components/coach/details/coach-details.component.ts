import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/CoopStore/service/admin.service';
import { UserResponse } from 'src/app/CoopStore/models/UserResponse';
import { Router } from '@angular/router';
@Component({
  selector: 'app-coach-details',
  templateUrl: './coach-details.component.html',
  styleUrls: ['./coach-details.component.scss']  // ✅ attention au "s"
})
export class CoachDetailsComponent implements OnInit {
  user: UserResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token') || '';
    
    console.log('📌 userId récupéré depuis la route :', userId);

    if (userId && token) {
      this.adminService.getUsersById(userId, token)
        .then(user => {
          this.user = user;
          console.log('📋 Utilisateur reçu :', this.user);
        })
        .catch(error => {
          console.error('❌ Erreur lors de la récupération de l\'utilisateur', error);
        });
    }
  }

  getFullLogoUrl(relativePath?: string): string {
    if (!relativePath) {
      return 'assets/default-profile-picture.jpg';
    }
  
    // Supprimer un éventuel slash initial
    const cleanPath = relativePath.startsWith('/')
      ? relativePath.substring(1)
      : relativePath;
  
    return `http://localhost:8080/${cleanPath}`;
  }
  goBackToTable() {
    this.router.navigate(['/coaches/list']); // Remplace '/tableau' par ta route réelle vers le tableau
  }
}