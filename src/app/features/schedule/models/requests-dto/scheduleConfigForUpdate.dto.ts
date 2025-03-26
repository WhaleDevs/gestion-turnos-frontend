import { EDayOfWeek } from "@app/utils/dayEnum";

export interface ScheduleConfigForUpdateDto {
    id: number;
    daysConfig: ScheduleDayConfigForUpdateDto[];
}

export interface ScheduleDayConfigForUpdateDto {
    id: number;
    day: EDayOfWeek;    
    startTime?: string;
    endTime?: string;
    slotInterval?: number;
    status?: boolean;
    rests: ScheduleDayRestForUpdateDto[];
}

export interface ScheduleDayRestForUpdateDto {
    id?: number;
    startTime: string;
    endTime: string;
}

export const INITAL_SCHEDULE_CONFIG_FOR_UPDATE: ScheduleConfigForUpdateDto = {
    id: 0,
    daysConfig: []
}