import { CustomerForCreationDto } from "@app/features/customers/models/customerForCreationDto.dto";

export interface AppointmentForCreationDto {
    startTime: string;
    endTime: string;
    date: string;
    description?: string;
    scheduleId: number;
    customer: CustomerForCreationDto;
  }

  
  export const INIT_APPOINTMENT_FOR_CREATE_DTO: AppointmentForCreationDto = {
    startTime: '',
    endTime: '',
    date: '',
    description: '',
    scheduleId: 0,
    customer: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: ''
    }
  }