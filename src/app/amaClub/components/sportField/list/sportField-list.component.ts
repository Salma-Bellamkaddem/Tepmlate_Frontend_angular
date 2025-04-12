import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { SportField } from 'src/app/amaClub/models/sportField';
import { SportFieldService } from 'src/app/amaClub/service/sportField.service';

@Component({
  selector: 'app-list',
  providers: [MessageService],
  templateUrl: './sportField-list.component.html',
  styleUrls: ['./sportField-list.component.scss']
})
export class SportFieldListComponent {
  sportField: SportField[] = [];
  searchForm !: FormGroup;
  totalElements: number = 0;
  display: boolean = false;
  addSportField !: string;
  sportFieldUpdated !: string;
  msgs: Message[] = [];
  displayDialog: { [key: string]: boolean } = {};

  constructor(private route: ActivatedRoute, private SportFieldService: SportFieldService, private messageService: MessageService, private fb: FormBuilder, private router: Router) {
    this.sportField.forEach(sportField => {
      this.displayDialog[sportField.code] = false;
    });
  }

  ngOnInit(): void {

    this.loadSportField(0, 10);

    this.searchForm = this.fb.group({
      code: [''],
    })
    this.route.queryParams.subscribe(params => {
      this.addSportField = params['addSportField'];
    });
    this.route.queryParams.subscribe(params => {
      this.sportFieldUpdated = params['sportFieldUpdated'];

    });

    if (this.addSportField === 'added') {
      this.showSuccessViaMessages('add')
    }
    if (this.sportFieldUpdated === 'updated') {

      this.loadSportField(0, 10);
      this.showSuccessViaMessages('update')
    }
  }

  showSuccessViaToast() {
    this.messageService.add({ key: 'tst2', severity: 'success', summary: 'Success', detail: 'Sport Field successfully deleted' });


  }

  showSuccessViaMessages(action: string) {
    if (action === 'add') {
      this.msgs = [];
      this.msgs.push({ severity: 'success', summary: 'Success Message', detail: 'Sport Field successfully added' });
    }
    if (action === 'update') {
      this.msgs = [];
      this.msgs.push({ severity: 'success', summary: 'Success Message', detail: 'Sport Field successfully updated' });
    }



  }

  loadSportField(page: number, rows: number): void {
    this.SportFieldService.getAllSportField(page, rows).subscribe(data => {
      console.log('Données SportField:', data); // Vérifiez ce qui est retourné
      this.sportField = data.sportFields;
      this.totalElements = data.totalElements;
      console.log(this.totalElements)
      console.log(this.sportField);
    });
  }

  navigateToCreateSportField() {
    this.router.navigate(['sportField/create'])
  }
  navigateToUpdateSportField(sportFieldCode: any) {
    this.router.navigate(['sportField/update'], { queryParams: { code: sportFieldCode } })
  }
  navigateToDetails(sportFieldCode: any) {
    this.router.navigate(['sportField/details'], { queryParams: { code: sportFieldCode } })
  }

  onPageChange(event: any): void {
    const page = event.page;
    const size = event.rows;
    this.loadSportField(page, size);
  }

  deleteSportField(sportFieldCode: any): void {
    this.displayDialog[sportFieldCode] = false;
    this.SportFieldService.deleteSportField(sportFieldCode).subscribe(
      () => {
        const index = this.sportField.findIndex(sportField => sportField.code === sportFieldCode);
        if (index !== -1) {
          this.sportField.splice(index, 1);
          this.loadSportField(0, 10);
          this.showSuccessViaToast();
        }
      },
      (error) => {
        console.error(`Error when deleting sport Field with code ${sportFieldCode}`, error);
      }
    );
  }

  searchSportFieldByCode(): void {
    this.sportField = [];
    this.SportFieldService.getSportFieldByCode(this.searchForm.get('code')?.value).subscribe(content => {
      this.sportField = content.sportFields;
      this.totalElements = content.totalElements;
    });
  }
}
