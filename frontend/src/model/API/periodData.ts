import apiRequest from "./_apiRequest_";
import { periodSchema } from "../zodSchemas";
import type { PeriodData } from "../types"

export const getPeriodData = async (): Promise<PeriodData[]> => {
    try {
        const response = await apiRequest("GET", "/data");
        return periodSchema.array().parseAsync(await response.json());
    } catch (error) {
         throw new Error(error instanceof Error ? error.message : String(error));
    }
}