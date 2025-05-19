export interface UserSessionState {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthResponse {
  status: number,
  message: string,
  user:{
    role: string,
    firstName: string,
    lastName: string,
    email: string
  }
}
