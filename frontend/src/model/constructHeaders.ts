import {getCookie} from "../control/cookies"

const constructHeaders = (): Headers =>{
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const token = getCookie("csrf_token");
    headers.append("X-CSRF-Token", token);

    return headers
}

export default constructHeaders;