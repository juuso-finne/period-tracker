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
export type SettingsData = z.infer<typeof schemas.settingsSchema>
export class CustomDate extends Date{

    isBetween(a: Date, b: Date): boolean{
        return +this >= Math.min(+a, +b) && +this <= Math.max(+a, +b);
    }

    differenceInDays(other: Date): number{
        const millisecondsInDay = 24 * 60 * 60 * 1000;
        return Math.floor(Math.abs(this.getTime() - other.getTime()) / millisecondsInDay)
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

    daysBeforeOrAfter(offset: number) : CustomDate{
        const date = this.getUTCDate();
        return CustomDate.UTCFromValues(this.getUTCFullYear(), this.getUTCMonth(), date + offset);
    }
}

export class AuthError extends Error {
    constructor(message: string){
        super(message);
        this.name = "authError";
    }
}