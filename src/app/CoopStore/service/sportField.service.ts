import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SportField } from '../models/sportField';

@Injectable({
  providedIn: 'root'
})


export class SportFieldService {
  private apiUrl = `${environment.apiBaseUrl}sportField`;
  constructor(private http: HttpClient) {
  }


  getAllSportField(page: number,size:number): Observable<any> {
    let params : any = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());

    return this.http.get<any>(`${this.apiUrl}`,{params}).pipe(
        map(response => {
            const sportFields: SportField[] = response.content;
            const totalElements: number = response.totalElements;
            const totalPages : number = response.totalPages;
            return { sportFields, totalElements,totalPages };
        })
    );
}


getSportFieldByCode(code: string) {
  let params : any = new HttpParams();
  if( code !== undefined && code !== null && code !== '') {
      params = params.append("code",code);
      console.log(params)
  }

  return this.http.get<any>(`${this.apiUrl}`,{params}).pipe(
      map(response => {
          const sportFields: SportField[] = response.content;
          const totalElements: number = response.totalElements;
          return { sportFields, totalElements };
      })
  );
}


addSportField(sportField: SportField): Observable<SportField> {
  return this.http.post<SportField>(this.apiUrl, sportField);

}

updateSportField(sportField: SportField): Observable<SportField> {
  return this.http.put<SportField>(this.apiUrl, sportField);

}
deleteSportField(code:any) {
  return this.http.delete<void>(this.apiUrl+"?code="+code);
}



}
