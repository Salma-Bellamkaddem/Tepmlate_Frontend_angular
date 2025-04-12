import {ChangeDetectorRef, Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Coach} from "../../../models/coach";
import {CoachService} from "../../../service/coach.service";

@Component({
  selector: 'app-coach-update',
  templateUrl: './coach-update.component.html',
  styleUrl: './coach-update.component.scss'
})
export class CoachUpdateComponent {
  coachCode: any;
  coachForm!: FormGroup;
  coaches : Coach[]= [];
  coachUpdated : String= "not updated";
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private coachService: CoachService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.coachForm= this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      cin: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
    this.route.queryParams.subscribe(params => {
      this.coachCode = params['code'];
    });


    this.loadCoachDetails();
  }
  loadCoachDetails() {
    this.coachService.getCoachByCode(this.coachCode).subscribe(content => {
      this.coachForm = this.fb.group({
        coachCode: [content.coaches[0].coachCode, Validators.required],
        firstName: [content.coaches[0].firstName, Validators.required],
        lastName: [content.coaches[0].lastName, Validators.required],
        cin: [content.coaches[0].cin, Validators.required],
        email: [content.coaches[0].email, [Validators.required, Validators.email]],
      });
      this.cdr.detectChanges();
    });

  }
  updateCoach() {
    if (this.coachForm.valid) {
      const updatedCoachData = {
        coachCode: this.coachForm.get('coachCode')?.value,
        firstName: this.coachForm.get('firstName')?.value,
        lastName: this.coachForm.get('lastName')?.value,
        cin: this.coachForm.get('cin')?.value,
        email: this.coachForm.get('email')?.value,
        avatar : ''
      };

      this.coachService.updateCoach(updatedCoachData).subscribe(
          () => {
            this.coachUpdated = "updated";
            this.router.navigate(['coaches/list'], { queryParams: {coachUpdated: this.coachUpdated  } })
            setTimeout(() => {
              this.router.navigate([], { queryParams: {coachUpdated: null }, queryParamsHandling: 'merge' });
            }, 200);
          },
          (error) => {
            console.error(`Error during coach update with code ${this.coachCode}`, error);
          }
      );
    } else {
      this.coachForm.markAllAsTouched();
    }

  }
}
