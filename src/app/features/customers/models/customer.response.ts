export interface CustomerResponse{
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
}

export const INITIAL_CUSTOMERS: CustomerResponse[] = [
  {
    id: 0,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  }
];
