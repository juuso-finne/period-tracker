import constructHeaders from "../constructHeaders";
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
        throw new Error(errorText);
    }

    return response;
}

export default apiRequest;