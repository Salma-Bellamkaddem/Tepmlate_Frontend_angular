import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SportField } from 'src/app/amaClub/models/sportField';
import { SportInstallationsStatus } from 'src/app/amaClub/models/SportInstallationsStatus ';
import { SportFieldService } from 'src/app/amaClub/service/sportField.service';

@Component({
  selector: 'app-update',
  templateUrl: './sportField-update.component.html',
  styleUrls: ['./sportField-update.component.css']
})
export class SportFieldUpdateComponent {

  sportFieldCode: any;
  sportFieldForm!: FormGroup;
  sportField : SportField[]= [];
  sportFieldUpdated : String= "not updated";
  statusOptions = Object.values(SportInstallationsStatus );

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private sportFieldService: SportFieldService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.sportFieldForm= this.fb.group({
      status: ['', Validators.required],
      areaSize: ['', Validators.required],
      description: ['', Validators.required],
 
    });
    this.route.queryParams.subscribe(params => {
      this.sportFieldCode = params['code'];
    });


    this.loadSportFieldDetails();
  }

  loadSportFieldDetails() {
    this.sportFieldService.getSportFieldByCode(this.sportFieldCode).subscribe(content => {
      this.sportFieldForm = this.fb.group({
        sportFieldCode: [content.sportFields[0].code, Validators.required],
        status: [content.sportFields[0].status, Validators.required],
        description: [content.sportFields[0].description, Validators.required],
        areaSize: [content.sportFields[0].areaSize, Validators.required],
       
      });
      this.cdr.detectChanges();
    });

  }
  updateSportField() {
    if (this.sportFieldForm.valid) {
      const updatedSportFieldData = {
        code: this.sportFieldForm.get('sportFieldCode')?.value,
        status: this.sportFieldForm.get('status')?.value,
        description: this.sportFieldForm.get('description')?.value,
        areaSize: this.sportFieldForm.get('areaSize')?.value,
       
      };

      this.sportFieldService.updateSportField(updatedSportFieldData).subscribe(
          () => {
            this.sportFieldUpdated = "updated";
            this.router.navigate(['sportField/list'], { queryParams: {sportFieldUpdated: this.sportFieldUpdated  } })
            setTimeout(() => {
              this.router.navigate([], { queryParams: {sportFieldUpdated: null }, queryParamsHandling: 'merge' });
            }, 200);
          },
          (error) => {
            console.error(`Error during sportField update with code ${this.sportFieldCode}`, error);
          }
      );
    } else {
      this.sportFieldForm.markAllAsTouched();
    }

  }


  

}
