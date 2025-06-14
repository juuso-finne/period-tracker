import {z} from "zod"

export const periodSchema = z.object({
    id: z.number(),
    start: z.string().transform(a => new Date(a)),
    end: z.nullable(z.string().transform(a => new Date(a))),
    notes: z.string()
})

export const settingsSchema = z.object({
    cycleLength: z.number().min(1),
    pulsMinus: z.number().min(0),
    useDefaults: z.boolean(),
    threshold: z.number().min(1)
})