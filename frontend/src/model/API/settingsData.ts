import apiRequest from "./_apiRequest_";
import { settingsSchema } from "../zodSchemas";
import type { SettingsData } from "../types"

export const getSettingsData = async (): Promise<SettingsData[]> => {
        const response = await apiRequest("GET", "/settings/");
        return settingsSchema.array().parseAsync(await response.json());
}

export const putSettingsData = async (data: SettingsData):Promise<Response> => {
    try {
        return apiRequest("PUT", "/settings/", JSON.stringify(data));
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}