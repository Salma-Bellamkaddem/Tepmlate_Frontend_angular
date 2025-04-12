import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SportField } from 'src/app/amaClub/models/sportField';
import { SportFieldService } from 'src/app/amaClub/service/sportField.service';

@Component({
  selector: 'app-details',
  templateUrl: './details-sportField.component.html',
  styleUrls: ['./details-sportField.component.css']
})

export class DetailsSportFieldComponent{

  sportFieldCode: any;
  sportField !: SportField;
  totalElements !: number;

  
  ngOnInit() : void{

    this.route.queryParams.subscribe(params => {
      this.sportFieldCode= params['code'];
    });
      this.loadCoachDetails();
  }


  constructor(private route: ActivatedRoute,  private sportFieldService: SportFieldService, private router: Router, private cdr: ChangeDetectorRef) { }

  loadCoachDetails() {
    console.log(this.sportFieldCode)
  this.sportFieldService.getSportFieldByCode(this.sportFieldCode).subscribe(data => {
    this.sportField= data.sportFields[0];
      console.log(this.sportField)
  });
}


}
