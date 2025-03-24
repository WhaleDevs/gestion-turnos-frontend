
export interface ScheduleDayRestForUpdateDto {
    id?: number;
    startRest: string;
    endRest: string;
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

export interface ScheduleForUpdateDto {
    id: number;
    scheduleDays: ScheduleDayConfigForUpdateDto[];
}

export const INITAL_SCHEDULE_UPDATE: ScheduleForUpdateDto = {
    id: 0,
    scheduleDays: []
}