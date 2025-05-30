
import {  CooperativeProfileLite } from './CooperativeProfileLite';
export interface User {
    id?: number;
    email: string;
    name: string;
    password?: string;
    city?: string;
    role: string;
    isProfileCompleted?: boolean;
  
    // Optionnel uniquement pour les utilisateurs mobile
  
  cooperativeProfile?: CooperativeProfileLite; // Tu peux aussi importer le modèle exact si besoin
  }