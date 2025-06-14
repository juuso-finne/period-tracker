import * as schemas from './zodSchemas'
import {z} from "zod"

export type Method = "GET" | "POST" | "PUT" | "DELETE"

export type LoginInfo = {
    username: string;
    password: string
}

export type PeriodData = z.infer<typeof schemas.periodSchema>
export type Settings = z.infer<typeof schemas.settingsSchema>