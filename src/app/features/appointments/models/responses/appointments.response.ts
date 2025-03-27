export interface AppointmentResponse {
    id: number;
    startTime: String;
    endTime: String;
    date: String;
    status: AppointmentStatus;
    description?: string;
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
    description: '',
    customer: { 
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: ''
    }
};