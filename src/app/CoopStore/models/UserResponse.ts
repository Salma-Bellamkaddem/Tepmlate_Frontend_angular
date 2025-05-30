import {  CooperativeProfileLite } from './CooperativeProfileLite';

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  city: string;
  role: string;
  profileCompleted: boolean;
  cooperativeProfile?: CooperativeProfileLite;
}