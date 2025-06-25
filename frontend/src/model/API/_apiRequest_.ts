import constructHeaders from "../constructHeaders";
import { AuthError } from "../types";
type Method = "GET" | "POST" | "PUT" | "DELETE"

    const apiRequest = async (method: Method, routeURL: string, body?: string): Promise<Response> => {
    const headers = constructHeaders();
    const baseUrl = "http://localhost:5000"
    const apiUrl = `${baseUrl}${routeURL}`

    const response = await fetch(apiUrl, {
        method: method,
        headers: headers,
        credentials: "include",
        body: body || undefined
    })

    if (!response.ok){
        const errorText = await response.text();
        if(response.status === 401){
            throw new AuthError(errorText);
        }
        throw new Error(errorText);
    }

    return response;
}

export default apiRequest;