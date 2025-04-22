import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private BASE_URL = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
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
  async getAllUsers(token: string, nameFilter = '', page = 0, size = 10): Promise<any> {
    let url = `${this.BASE_URL}/admin/get-all-users?page=${page}&size=${size}`;
    if (nameFilter) {
      url += `&nameFilter=${nameFilter}`;
    }
  
    const headers = this.getHeaders(token);
    const response = await lastValueFrom(this.http.get(url, { headers, responseType: 'text' }));
  
    console.log("📋 Résultat getAllUsersWithFilter:", response);
  
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error("❌ JSON parsing failed (getAllUsersWithFilter)", error);
      throw new Error("Erreur JSON");
    }
  }

  async getUsersById(userId: string, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/get-users/${userId}`;
    const headers = this.getHeaders(token);
    return await lastValueFrom(this.http.get<any>(url, { headers }));
  }

  async deleteUser(userId: string, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/delete/${userId}`;
    const headers = this.getHeaders(token);
    return await lastValueFrom(this.http.delete<any>(url, { headers }));
  }

  async updateUser(userId: string, userData: any, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/update/${userId}`;
    const headers = this.getHeaders(token);
    return await lastValueFrom(this.http.put<any>(url, userData, { headers }));
  }

  async createCooperativeByAdmin(userData: any, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/create`;
    const headers = this.getHeaders(token);
    return await lastValueFrom(this.http.post<any>(url, userData, { headers }));
  }
}