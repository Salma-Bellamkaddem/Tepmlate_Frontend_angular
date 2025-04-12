import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Message, MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {Coach} from "../../../models/coach";
import {CoachService} from "../../../service/coach.service";

@Component({
  selector: 'app-coach-list',
    providers: [MessageService],
  templateUrl: './coach-list.component.html',
  styleUrl: './coach-list.component.scss'
})
export class CoachListComponent {
    coaches : Coach[]= [];
    searchForm !: FormGroup;
    totalElements : number = 0;
    display: boolean = false;
    addCoach !: string;
    coachUpdated !: string;
    msgs: Message[] = [];
    displayDialog: { [key: string]: boolean } = {};

    constructor(private route: ActivatedRoute,private coachService: CoachService,private messageService : MessageService,private fb: FormBuilder, private router: Router) {
        this.coaches.forEach(coach => {
            this.displayDialog[coach.coachCode] = false;
        });
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.addCoach= params['addCoach'];
        });
        this.route.queryParams.subscribe(params => {
            this.coachUpdated= params['coachUpdated'];

        });

        if (this.addCoach === 'added') {
            this.showSuccessViaMessages('add')
        }
        if (this.coachUpdated === 'updated') {
            this.showSuccessViaMessages('update')
        }
        this.loadCoaches(0,10);
        this.searchForm = this.fb.group({
            coachCode: [''],
        });
    }
    showSuccessViaToast() {
        this.messageService.add({ key: 'tst2', severity: 'success', summary: 'Success', detail: 'Coach successfully deleted' });


    }
    showErrorViaToast() {
        this.messageService.add({ key: 'tst3', severity: 'error', summary: 'Error', detail: 'Coach not deleted' });
    }
    showSuccessViaMessages(action : string) {
        if (action === 'add'){
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Success Message', detail: 'Coach successfully added' });
        }
        if (action === 'update'){
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Success Message', detail: 'Coach successfully updated' });
        }



    }

    loadCoaches(page : number , rows : number): void {
        this.coachService.getAllCoaches(page,rows).subscribe(data => {
            this.coaches = data.coaches;
            this.totalElements = data.totalElements;
            console.log(this.totalElements)
            console.log(this.coaches);
        });
    }
    navigateToCreateCoach(){
        this.router.navigate(['coaches/create'])
    }
    navigateToUpdateCoach(coachCode: any){
        this.router.navigate(['coaches/update'], { queryParams: { code: coachCode} })
    }
    navigateToDetails(coachCode: any){
        this.router.navigate(['coaches/details'], { queryParams: { code: coachCode} })
    }
    onPageChange(event: any): void {
        const page = event.page ;
        const size = event.rows;
        this.loadCoaches(page, size);
    }
    deleteCoach(coachCode: any): void {
        this.displayDialog[coachCode] = false;
        this.coachService.deleteCoach(coachCode).subscribe(
            () => {
                const index = this.coaches.findIndex(coach => coach.coachCode === coachCode);
                if (index !== -1) {
                    this.coaches.splice(index, 1);
                    this.loadCoaches(0,10);
                    this.showSuccessViaToast();
                }
            },
            (error) => {
                console.error(`Error when deleting coach with code ${coachCode}`, error);
            }
        );
    }

    searchCoachByCode(): void {
        this.coaches = [];
        this.coachService.getCoachByCode(this.searchForm.get('coachCode')?.value).subscribe(content => {
            this.coaches = content.coaches;
            this.totalElements = content.totalElements;
        });
    }
}
