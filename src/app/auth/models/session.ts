export interface UserSessionState {
  id: number;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthResponse {
  status: number,
  message: string,
  user:{
    id: number,
    role: string,
    firstName: string,
    lastName: string,
    email: string
  }
}
