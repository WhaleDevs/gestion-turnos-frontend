export interface ManagerResponse{
  id: number;
  firstName: string;
  lastname: string;
  email: string;
  role: string;
}

export const INITIAL_MANAGERS: ManagerResponse[] = [
  {
    id: 0,
    firstName: '',
    lastname: '',
    role: '',
    email: ''
  }
];

export const INITIAL_MANAGER_FOR_UPDATE: ManagerResponse = {
    id: 0,
    firstName: '',
    lastname: '',
    role: '',
    email: ''
}