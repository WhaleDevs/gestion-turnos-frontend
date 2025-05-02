export interface UserSessionState {
  name: string;
  email: string;
}

export interface AuthResponse {
  status: number,
  message: string,
  user:{
    name: string,
    email: string
  }
}
