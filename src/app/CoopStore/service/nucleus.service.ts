// src/app/services/nucleus.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CooperativeProfileLite } from '../models/CooperativeProfileLite';


export interface NucleusRequest {
  name: string;
  description?: string;
  activitySector: ActivitySector;
  facilitatorId: number;
  maxMembers: number;
  active: boolean;
}

export interface NucleusResponse {
  id: number;
  name: string;
  description?: string;
  activitySector: ActivitySector;
  active: boolean;
  maxMembers: number;
  memberCount: number;
  full: boolean;
  facilitatorId: number;
  facilitatorName?: string;
  members?: CooperativeMemberResponse[];
}

export interface CooperativeMemberResponse {
  id: number;
  cooperativeName: string;
  logoUrl?: string;
  activitySector: ActivitySector;
  city?: string;
  active: boolean;
  memberCount?: number;
}

export enum ActivitySector {
  AGRICULTURE = 'AGRICULTURE',
  ARTISANAT = 'ARTISANAT',
  AGROALIMENTAIRE = 'AGROALIMENTAIRE',
  TEXTILE = 'TEXTILE',
  COSMETIQUE = 'COSMETIQUE',
  TOURISME = 'TOURISME',
  PECHE = 'PECHE',
  ELEVAGE = 'ELEVAGE'
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NucleusService {
  private apiUrl = `${environment.apiBaseUrl}/api/nucleus`;

  constructor(private http: HttpClient) { }


  getHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      // Tu peux aussi faire un fallback ou une redirection ici
      throw new Error('Token d’authentification manquant');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  changeFacilitator(nucleusId: number, newFacilitatorId: number): Observable<NucleusResponse> {
    return this.http.patch<NucleusResponse>(
      `${this.apiUrl}/${nucleusId}/facilitator/${newFacilitatorId}`,
      {}, // Body vide car les IDs sont dans l'URL
      { headers: this.getAuthHeaders() }
    );
  }

  // ===============================
  // CRUD OPERATIONS
  // ===============================

  /**
   * ✅ Créer un nouveau nucleus
   */
  createNucleus(nucleus: NucleusRequest): Observable<NucleusResponse> {
    return this.http.post<NucleusResponse>(this.apiUrl, nucleus, {
      headers: this.getAuthHeaders()
    });
  }
  getFacilitators?(): Observable<CooperativeProfileLite[]> {
    return this.http.get<CooperativeProfileLite[]>(`${this.apiUrl}/facilitators`, {
      headers: this.getAuthHeaders()
    });
  }


  getNucleusByFacilitator(facilitatorId: number): Observable<NucleusResponse[]> {
    return this.http.get<NucleusResponse[]>(`${this.apiUrl}/facilitated-by/${facilitatorId}`, {
      headers: this.getAuthHeaders()
    });
  }
  /**
   * ✅ Obtenir tous les nucleus avec pagination
   */
  getAllNucleus(page: number = 0, size: number = 10, sort: string = 'name'): Observable<PageResponse<NucleusResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<PageResponse<NucleusResponse>>(this.apiUrl, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  /**
   * ✅ Obtenir un nucleus par ID
   */
  getNucleusById(id: number): Observable<NucleusResponse> {
    return this.http.get<NucleusResponse>(`${this.apiUrl}/nucleus/${id}`);
  }

  /**
   * ✅ Obtenir un nucleus avec ses membres
   */
  getNucleusWithMembers(id: number): Observable<NucleusResponse> {
    const token = localStorage.getItem('token'); // récupérer le token
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<NucleusResponse>(`${this.apiUrl}/${id}/with-members`, { headers });
  }

  /**
   * ✅ Mettre à jour un nucleus
   */
  updateNucleus(id: number, nucleus: NucleusRequest): Observable<NucleusResponse> {
    return this.http.put<NucleusResponse>(`${this.apiUrl}/${id}`, nucleus, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * ✅ Activer/Désactiver un nucleus
   */
  toggleNucleusStatus(id: number, isActive: boolean): Observable<NucleusResponse> {
    const params = new HttpParams().set('isActive', isActive.toString());
    
    return this.http.patch<NucleusResponse>(`${this.apiUrl}/${id}/status`, null, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  /**
   * ✅ Supprimer un nucleus
   */
  deleteNucleus(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ===============================
  // GESTION DES MEMBRES
  // ===============================

  /**
   * ✅ Ajouter un membre au nucleus
   */
  addMemberToNucleus(nucleusId: number, cooperativeId: number): Observable<NucleusResponse> {
    return this.http.post<NucleusResponse>(`${this.apiUrl}/${nucleusId}/members/${cooperativeId}`, null, {
      headers: this.getAuthHeaders()
    });
  }
 /**
   * ✅ Obtenir les coopératives disponibles pour un nucleus
   */


  /**
   * ✅ Retirer un membre du nucleus
   */
  removeMemberFromNucleus(nucleusId: number, cooperativeId: number): Observable<NucleusResponse> {
    return this.http.delete<NucleusResponse>(`${this.apiUrl}/${nucleusId}/members/${cooperativeId}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * ✅ Changer le facilitateur
   */
 /**
   * ✅ Obtenir les coopératives disponibles pour un nucleus
   */
 getAvailableCooperatives(nucleusId: number): Observable<CooperativeMemberResponse[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token || ''}`
  });
  return this.http.get<CooperativeMemberResponse[]>(`${this.apiUrl}/${nucleusId}/available-cooperatives`, { headers });
}
/**
   * ✅ Obtenir les membres d'un nucleus
   */
getNucleusMembers(nucleusId: number): Observable<CooperativeMemberResponse[]> {
  return this.http.get<CooperativeMemberResponse[]>(
    `${this.apiUrl}/${nucleusId}/members`,
    { headers: this.getAuthHeaders() }
  );
}
  // ===============================
  // RECHERCHE ET FILTRAGE
  // ===============================

  /**
   * ✅ Rechercher par nom
   */
  searchNucleusByName(name: string): Observable<NucleusResponse[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<NucleusResponse[]>(`${this.apiUrl}/search`, { params });
  }

  /**
   * ✅ Obtenir nucleus par secteur
   */
  getNucleusBySector(activitySector: ActivitySector): Observable<NucleusResponse[]> {
    return this.http.get<NucleusResponse[]>(`${this.apiUrl}/by-sector/${activitySector}`);
  }

  /**
   * ✅ Obtenir nucleus disponibles par secteur
   */
  getAvailableNucleusBySector(activitySector: ActivitySector): Observable<NucleusResponse[]> {
    return this.http.get<NucleusResponse[]>(`${this.apiUrl}/available-by-sector/${activitySector}`);
  }

  /**
   * ✅ Obtenir les secteurs d'activité
   */
  getActivitySectors(): Observable<ActivitySector[]> {
    return this.http.get<ActivitySector[]>(`${this.apiUrl}/activity-sectors`);
  }

  /**
   * ✅ Health check
   */
  healthCheck(): Observable<string> {
    return this.http.get(`${this.apiUrl}/health`, { responseType: 'text' });
  }
}