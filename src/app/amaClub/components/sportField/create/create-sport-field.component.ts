import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SportField } from 'src/app/amaClub/models/sportField';
import { SportInstallationsStatus  } from 'src/app/amaClub/models/SportInstallationsStatus ';
import { SportFieldService } from 'src/app/amaClub/service/sportField.service';

@Component({
  selector: 'app-create-sport-field',
  templateUrl: './create-sport-field.component.html',
  styleUrl: './create-sport-field.component.scss'
})




export class CreateSportFieldComponent {
  sportFieldForm!: FormGroup;
  sportField !: SportField;
  addSportField : String= "not added";
  statusOptions = Object.values(SportInstallationsStatus );
  constructor(private fb: FormBuilder,private sportfieldService: SportFieldService, private router: Router) {
  }

  ngOnInit() {
    this.sportFieldForm= this.fb.group({
      status: ['', Validators.required],
      description: ['', Validators.required],
      areaSize: ['', Validators.required],
      
    });
}

createSportField() {
  if (this.sportFieldForm.valid) {
      const newSportField: SportField = { ...this.sportFieldForm.value };

      console.log(newSportField);
      

      this.sportfieldService.addSportField(newSportField).subscribe(
          (response) => {
              this.sportFieldForm.reset();
              this.addSportField = "added";
              this.router.navigate(['sportField/list'], { queryParams: { addSportField: this.addSportField  } })
              setTimeout(() => {
                  this.router.navigate([], { queryParams: { addCoach: null }, queryParamsHandling: 'merge' });
              }, 200);

          },
          (error) => {
              console.error('Error when adding the sport Field :', error);
          }
      );
  }
}

}
