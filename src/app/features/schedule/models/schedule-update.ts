
export interface ScheduleDayRestForUpdateDto {
    id?: number;
    startRest: string;
    endRest: string;
}

export interface ScheduleDayConfigForUpdateDto {
    id: number;
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