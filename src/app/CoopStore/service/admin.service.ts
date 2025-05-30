import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { UserResponse } from '../models/UserResponse';
import { ReqRes } from '../models/ReqRes';

 // 🟢 ajuste le chemin si besoin
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private BASE_URL = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }


  async searchUsersByName(name: string, token: string, page = 0, size = 10): Promise<any> {
    const url = `${this.BASE_URL}/admin/search?name=${name}&page=${page}&size=${size}`;
    const headers = this.getHeaders(token);
    const response = await lastValueFrom(this.http.get(url, { headers, responseType: 'text' }));
  
    console.log("🔎 Résultat search :", response);
  
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error("❌ Erreur JSON (searchUsersByName)", error);
      throw new Error("Erreur de parsing JSON");
    }
  }


  async getAllUsers(token: string, keyword: string, page: number, size: number): Promise<any> {
    const params = new HttpParams()
      .set('page', (page + 1).toString())   // si backend commence à 1
      .set('size', size.toString())
      .set('nameFilter', keyword);
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return lastValueFrom(
      this.http.get<any>(`${this.BASE_URL}/admin/all`, { headers, params })
    );
  }


  

  async getUsersById(userId: string, token: string): Promise<UserResponse> {
    const url = `${this.BASE_URL}/admin/get-user/${userId}`;
    const headers = this.getHeaders(token);
    try {
      const response = await lastValueFrom(this.http.get<UserResponse>(url, { headers }));
      return response;
    } catch (error) {
      console.error('❌ Erreur lors du chargement de l’utilisateur :', error);
      throw error;
    }
  }

  async deleteUser(userId: string, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/delete-user/${userId}`;    const headers = this.getHeaders(token);
    return await lastValueFrom(this.http.delete<any>(url, { headers }));
  }

  async updateUser(userId: string, userData: any, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/update-user/${userId}`;
    const headers = this.getHeaders(token);
    return await lastValueFrom(this.http.put<any>(url, userData, { headers }));
  }

  async createCooperativeByAdmin(userData: any, token: string): Promise<ReqRes> {
    const url = `${this.BASE_URL}/admin/create-cooperative`;
    const headers = this.getHeaders(token);
    return await lastValueFrom(this.http.post<ReqRes>(url, userData, { headers }));
  }
}