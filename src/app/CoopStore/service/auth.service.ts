import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user'; // adapte le chemin si besoin

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_URL = environment.apiBaseUrl;

  // 👤 Stockage de l'utilisateur connecté
 
  public currentUser: Observable<User>;
  private currentUserSubject: BehaviorSubject<User>;


  constructor(private http: HttpClient) {
    let storageUser;
    const storageUserAsStr = localStorage.getItem('currentUser');
    if (storageUserAsStr) {
      storageUser = JSON.parse(storageUserAsStr);
    }
    this.currentUserSubject = new BehaviorSubject<User>(storageUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }


  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  refreshToken(): Observable<any> {
    const token = localStorage.getItem('token'); // ou 'refreshToken' si tu les différencies
  
    if (!token) {
      throw new Error('No token available');
    }
  
    const url = `${this.BASE_URL}/auth/refresh`;
    const body = {
      token: token
    };
  
    return this.http.post<any>(url, body);
  }

  // 🧠 Accès direct au user actuel
  public get userValue(): User | null {
    return this.currentUserSubject.value;
  }

  async login(email: string, password: string): Promise<any> {
    const url = `${this.BASE_URL}/auth/login`;
    try {
      const response = await this.http.post<any>(url, { email, password }).toPromise();
  
      if (response && response.token && response.user) {
        this.setSessionStorage(response.user, response.token, response.refreshToken); // Appel de la méthode propre
      }
  
      return response;
    } catch (error) {
      throw error;
    }
  }

// Register method WITHOUT a token
async register(userData:any, token:string):Promise<any>{
  const url = `${this.BASE_URL}/auth/register`;
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  })
  try{
    const response =  this.http.post<any>(url, userData, {headers}).toPromise()
    return response;
  }catch(error){
    throw error;
  }
}
  setSessionStorage(user: User, accessToken: string, refreshToken: string) {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
  /***AUTHEMNTICATION METHODS */
  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.post(`${this.BASE_URL}/auth/logout`, {}, { headers });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  isAdmin(): boolean {
    const role = localStorage.getItem('role');
    return role === 'ADMIN';
  }

  isUser(): boolean {
    const role = localStorage.getItem('role');
    return role === 'COOPERATIVE';
  }
  getToken(): string {
    return localStorage.getItem('token') || '';
  }
}