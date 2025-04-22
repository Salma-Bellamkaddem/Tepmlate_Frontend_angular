import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Coach} from "../../../models/coach";
import {CoachService} from "../../../service/coach.service";

@Component({
  selector: 'app-coach-create',
  templateUrl: './coach-create.component.html',
  styleUrl: './coach-create.component.scss'
})
export class CoachCreateComponent {
    coachForm!: FormGroup;
    coach !: Coach;
    addCoach : String= "not added";
    constructor(private fb: FormBuilder,private coachService: CoachService, private router: Router) {
    }
    ngOnInit() {
        this.coachForm= this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            cin: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
        });
    }
    createCoach() {
        if (this.coachForm.valid) {
            const newCoach: Coach = { ...this.coachForm.value };
            this.coachService.addCoach(newCoach).subscribe(
                (response) => {
                    this.coachForm.reset();
                    this.addCoach = "added";
                    this.router.navigate(['coaches/list'], { queryParams: { addCoach: this.addCoach  } })
                    setTimeout(() => {
                        this.router.navigate([], { queryParams: { addCoach: null }, queryParamsHandling: 'merge' });
                    }, 200);

                },
                (error) => {
                    console.error('Error when adding the caach :', error);
                }
            );
        }
    }
}
