import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private BASE_URL = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  async getYourProfile(token: string): Promise<any> {
    const url = `${this.BASE_URL}/adminuser/get-profile`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return await this.http.get<any>(url, { headers }).toPromise();
  }
}