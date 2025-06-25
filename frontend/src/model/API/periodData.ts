import apiRequest from "./_apiRequest_";
import { periodSchema } from "../zodSchemas";
import type { PeriodData } from "../types"

export const getPeriodData = async (): Promise<PeriodData[]> => {
        const response = await apiRequest("GET", "/data");
        return periodSchema.array().parseAsync(await response.json());
}

export const postPeriodData = async (data: PeriodData):Promise<Response> => {
    try {
        const formatteData = formatData(data);
        return apiRequest("POST", "/data/", JSON.stringify(formatteData));
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}

export const putPeriodData = async (data: PeriodData):Promise<Response> => {
    try {
        const formatteData = formatData(data);
        return apiRequest("PUT", "/data/mutate/", JSON.stringify(formatteData));
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}

export const deletePeriodData = async (id: number):Promise<Response> => {
    try {
        return apiRequest("DELETE", "/data/mutate/", JSON.stringify({id}));
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}

function formatData (data: PeriodData): {id: number | null, start: string, end:string | null, notes:string}{
    return {...data, start: data.start.isoStringDateOnly(), end:data.end ? data.end.isoStringDateOnly() : null};
}