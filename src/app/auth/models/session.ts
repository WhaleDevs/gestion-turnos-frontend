export interface UserSessionState {
  role: string;
  email: string;
}

export interface AuthResponse {
  status: number,
  message: string,
  user:{
    role: string,
    email: string
  }
}
