import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Coach} from "../models/coach";

@Injectable({
  providedIn: 'root'
})
export class CoachService {

    private apiUrl = `${environment.apiBaseUrl}Coach`;
    constructor(private http: HttpClient) {
    }

    getAllCoaches(page: number,size:number): Observable<any> {
        let params : any = new HttpParams();
        params = params.append('page', page.toString());
        params = params.append('size', size.toString());

        return this.http.get<any>(`${this.apiUrl}`,{params}).pipe(
            map(response => {
                const coaches: Coach[] = response.content;
                const totalElements: number = response.totalElements;
                const totalPages : number = response.totalPages;
                return { coaches, totalElements,totalPages };
            })
        );
    }

    getCoachByCode(coachCode: string) {
        let params : any = new HttpParams();
        if( coachCode !== undefined && coachCode !== null && coachCode !== '') {
            params = params.append("coachCode",coachCode);
            console.log(params)
        }

        return this.http.get<any>(`${this.apiUrl}`,{params}).pipe(
            map(response => {
                const coaches: Coach[] = response.content;
                const totalElements: number = response.totalElements;
                return { coaches, totalElements };
            })
        );
    }

    addCoach(coach: Coach): Observable<Coach> {
        return this.http.post<Coach>(this.apiUrl, coach);

    }
    updateCoach(coach: Coach): Observable<Coach> {
        return this.http.put<Coach>(this.apiUrl, coach);

    }
    deleteCoach(code:any) {
        return this.http.delete<void>(this.apiUrl+"?coachCode="+code);
    }
}
