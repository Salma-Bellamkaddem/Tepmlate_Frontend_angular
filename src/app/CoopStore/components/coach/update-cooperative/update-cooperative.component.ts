import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; // ✅ Ajouté
import { AdminService } from 'src/app/CoopStore/service/admin.service';

@Component({
  selector: 'app-update-cooperative',
  standalone: true,
  templateUrl: './update-cooperative.component.html',
  styleUrls: ['./update-cooperative.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class UpdateCooperativeComponent implements OnInit {
  isSubmitting: boolean = false;
  updateForm!: FormGroup;
  userId!: string;
  token = localStorage.getItem('token') || '';

  constructor(
    private fb: FormBuilder,
    private userService: AdminService,
    private route: ActivatedRoute,
    private router: Router// ✅ Injecter ActivatedRoute
  ) {}

  ngOnInit(): void {
    // ✅ Récupérer l'ID depuis l'URL
    this.userId = this.route.snapshot.paramMap.get('userId') || '';

    this.updateForm = this.fb.group({
      name: [''],
      email: [''],
      city: [''],
      role: [''],
      profileCompleted: [false],
    });
    this.loadUserData(); 
  }

  async loadUserData(): Promise<void> {
    try {
      const userData = await this.userService.getUsersById(this.userId, this.token);
      // ✅ Remplir le formulaire avec les données
      this.updateForm.patchValue({
        name: userData.name,
        email: userData.email,
        city: userData.city,
        role: userData.role,
        profileCompleted: userData.profileCompleted,
      });
      console.log('User data:', userData);
    } catch (error) {
      console.error('Erreur lors du chargement des données de l’utilisateur', error);
    }
  }
  goBack(): void {
    window.history.back();
  }
  
  async onSubmit(): Promise<void> {
    if (this.updateForm.valid) {
      const userData = this.updateForm.value;
  
      try {
        const response = await this.userService.updateUser(this.userId, userData, this.token);
        alert('Utilisateur mis à jour avec succès');
        console.log(response);
  
        // ✅ Rediriger vers la liste (ou toute autre page souhaitée)
        this.router.navigate(['/coaches/list']); // 🔁 à adapter selon ta route exacte
      } catch (error) {
        alert('Erreur lors de la mise à jour de l’utilisateur');
        console.error(error);
      }
    }
  }
}