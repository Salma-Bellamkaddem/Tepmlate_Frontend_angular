import { UserResponse } from './UserResponse';



export interface ReqRes {
  statusCode: number;
  message?: string;
  error?: string;
  ourUsers?: UserResponse; // conforme à ta réponse backend
}