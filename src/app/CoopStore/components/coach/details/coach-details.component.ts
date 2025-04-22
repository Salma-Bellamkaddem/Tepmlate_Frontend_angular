import {ChangeDetectorRef, Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Coach} from "../../../models/coach";
import {CoachService} from "../../../service/coach.service";

@Component({
  selector: 'app-coach-details',
  templateUrl: './coach-details.component.html',
  styleUrl: './coach-details.component.scss'
})
export class CoachDetailsComponent {
  coachCode: any;
  coach !: Coach;
  totalElements !: number;
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.coachCode= params['code'];
    });
      this.loadCoachDetails();

  }
  constructor(private route: ActivatedRoute,  private coachService: CoachService, private router: Router, private cdr: ChangeDetectorRef) { }

  loadCoachDetails() {
      console.log(this.coachCode)
    this.coachService.getCoachByCode(this.coachCode).subscribe(data => {
      this.coach= data.coaches[0];
        console.log(this.coach)
    });
  }
}
