import type { LoginInfo } from "../types"
import apiRequest  from "./_apiRequest_";

export const login = async (info: LoginInfo): Promise<Response> => {
    try{
        return await apiRequest("POST", "/users/login", JSON.stringify(info))
    } catch (error){
        throw new Error(error instanceof Error ? error.message : String(error))
    }
}

export const register = async (info: LoginInfo): Promise<Response> => {
    try{
        return await apiRequest("POST", "/users/register", JSON.stringify(info))
    } catch (error){
        throw new Error(error instanceof Error ? error.message : String(error))
    }
}