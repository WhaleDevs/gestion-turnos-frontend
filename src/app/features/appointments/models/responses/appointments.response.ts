export interface AppointmentResponse {
    id: number;
    startTime: string;
    endTime: string;
    date: string;
    status: AppointmentStatus;
    servicePrice: number;
    serviceTitle: string;
    serviceDescription: string;
    customer?: CustomerResponse;
}

export enum AppointmentStatus {
    DISPONIBLE = 'DISPONIBLE',
    RESERVADO = 'RESERVADO',
    ESPERANDO = 'ESPERANDO',
    TERMINADO = 'TERMINADO',
    AUSENTE = 'AUSENTE'
}

export interface CustomerResponse {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
}

export const INIT_APPOINTMENT_RESPONSE: AppointmentResponse = {
    id: 0,
    startTime: '',
    endTime: '',
    date: '',
    status: AppointmentStatus.DISPONIBLE,
    servicePrice: 0,
    serviceTitle: '',
    serviceDescription: '',
    customer: { 
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: ''
    }
};