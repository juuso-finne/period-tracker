import {z} from "zod"
import { CustomDate } from "./types"

export const periodSchema = z.object({
    id: z.number(),
    start: z.string().transform(a => new CustomDate(a)),
    end: z.nullable(z.string().transform(a => new CustomDate(a))),
    notes: z.string()
})

export const settingsSchema = z.object({
    cycleLength: z.number().min(1),
    pulsMinus: z.number().min(0),
    useDefaults: z.boolean(),
    threshold: z.number().min(1)
})