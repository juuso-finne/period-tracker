import * as schemas from './zodSchemas'
import {z} from "zod"

export type CalendarDayProps = {
    period: number | null,
    day: CustomDate,
    isSelected: boolean
}

export type LoginInfo = {
    username: string;
    password: string
}

export type PeriodData = z.infer<typeof schemas.periodSchema>
export type Settings = z.infer<typeof schemas.settingsSchema>
export class CustomDate extends Date{

    isBetween(start: Date, end: Date): boolean{
        return this >= start && this <= end;
    }

    differenceInDays(other: Date): number{
        const millisecondsInDay = 24 * 60 * 60 * 1000;
        return Math.floor((this.getTime() - other.getTime()) / millisecondsInDay)
    }

    isoStringDateOnly(): string {
        return this.toISOString().split("T")[0];
    }

    static UTCFromValues(year: number, month: number, day:number): CustomDate{
        return new CustomDate((Date.UTC(year, month, day)))
    }

    static todayAsUTC(): CustomDate{
        const today = new Date();
        return this.UTCFromValues(today.getFullYear(), today.getMonth(), today.getDate());
    }
}

export class AuthError extends Error {
    constructor(message: string){
        super(message);
        this.name = "authError";
    }
}