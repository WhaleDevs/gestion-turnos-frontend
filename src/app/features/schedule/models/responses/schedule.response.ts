import { AppointmentResponse } from "@app/features/appointments/models/responses/appointments.response";
import { EDayOfWeek } from "@app/utils/dayEnum";

export interface ScheduleResponse {
    id: number;
    daysConfig: ScheduleDayConfigResponse[];
    appointments: AppointmentResponse[];
}

export interface ScheduleDayConfigResponse {
    id: number;
    day: string;
    startTime: string;
    endTime: string;
    slotInterval: number;
    status: boolean;
    rests: ScheduleDayRestConfigResponse[];
}

export interface ScheduleDayRestConfigResponse {
    id: number;
    startTime: string;
    endTime: string;
}

export interface ScheduleConfigResponse {
    id: number;
    daysConfig: ScheduleDayConfigResponse[];
}

export interface ScheduleConfigResponse {
    id: number;
    daysConfig: ScheduleDayConfigResponse[];
}

export const INITAL_SCHEDULE_CONFIG_RESPONSE: ScheduleConfigResponse = {
    id: 0,
    daysConfig: []
}