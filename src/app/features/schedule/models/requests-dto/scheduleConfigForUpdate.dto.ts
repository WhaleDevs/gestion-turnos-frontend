export interface ScheduleConfigForUpdateDto {
    id: number;
    scheduleDays: ScheduleDayConfigForUpdateDto[];
}

export interface ScheduleDayConfigForUpdateDto {
    id: number;
    day: string;    
    startTime?: string;
    endTime?: string;
    slotInterval?: number;
    status?: boolean;
    rests: ScheduleDayRestForUpdateDto[];
}

export interface ScheduleDayRestForUpdateDto {
    id?: number;
    startRest: string;
    endRest: string;
}

export const INITAL_SCHEDULE_CONFIG_FOR_UPDATE: ScheduleConfigForUpdateDto = {
    id: 0,
    scheduleDays: []
}