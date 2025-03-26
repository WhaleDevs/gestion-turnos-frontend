import { AppointmentResponse } from "@app/features/appointments/models/responses/appointments.response";
import { EDayOfWeek } from "@app/utils/dayEnum";

export interface ScheduleResponse {
    id: number;
    daysConfig: ScheduleDayConfigResponse[];
    appointments: AppointmentResponse[];
}

export interface ScheduleDayConfigResponse {
    id: number;
    day: EDayOfWeek;
    startTime: string;
    endTime: string;
    slotInterval: number;
    status: Boolean;
    rests: ScheduleDayRestConfigResponse[];
}

export interface ScheduleDayRestConfigResponse {
    id: number;
    startTime: String;
    endTime: String;
}