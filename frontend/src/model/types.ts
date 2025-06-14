import * as schemas from './zodSchemas'
import {z} from "zod"

export type LoginInfo = {
    username: string;
    password: string
}

export type Period = z.infer<typeof schemas.periodSchema>
export type Settings = z.infer<typeof schemas.settingsSchema>