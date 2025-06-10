
import { useMutation } from "@tanstack/react-query"
import {login} from "../../model/API/userData"


export const useLoginMutation = (updateFunction: () => void) => {

    return useMutation({
        mutationFn: login,
        onSuccess: () => {
            console.log("Login successful")
            updateFunction();
        },
        onError: (error) => {
            console.log(error.message);
        }
    });
}
