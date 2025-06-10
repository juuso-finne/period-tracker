import type { LoginInfo } from "../../types"
import constructHeaders from "../constructHeaders"

export const login = async (info: LoginInfo): Promise<Response> => {
    const headers = constructHeaders();
    const api_url = "http://localhost:5000/users/login"

    const response = await fetch(api_url, {
        method: "POST",
        headers: headers,
        credentials: "include",
        body: JSON.stringify(info)
    })

    if (!response.ok){
        const errorText = await response.text();
        throw new Error(errorText);
    }

    return response;
}

export const register = async (info: LoginInfo): Promise<Response> => {
    const headers = constructHeaders();
    const api_url = "http://localhost:5000/users/register"

    const response = await fetch(api_url, {
        method: "POST",
        headers: headers,
        credentials: "include",
        body: JSON.stringify(info)
    })

    if (!response.ok){
        const errorText = await response.text();
        throw new Error(errorText);
    }

    return response;
}