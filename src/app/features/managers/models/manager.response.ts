import { OfferedResponse } from "@app/features/offered-services/models/offeredResponse";

export interface ManagerResponse{
  id: number;
  firstName: string;
  lastname: string;
  email: string;
  role: string;
  offeredServices: OfferedResponse[];
}

export const INITIAL_MANAGERS: ManagerResponse[] = [
  {
    id: 0,
    firstName: '',
    lastname: '',
    role: '',
    email: '',
    offeredServices: []
  }
];

export const INITIAL_MANAGER: ManagerResponse = {
    id: 0,
    firstName: '',
    lastname: '',
    role: '',
    email: '',
    offeredServices: []
}