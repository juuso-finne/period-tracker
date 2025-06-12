
import { useMutation } from "@tanstack/react-query"
import {login} from "../../model/API/userData"


export const useLoginMutation = (loginSuccess: () => void, loginFail: (error: Error) => void) => {

    return useMutation({
        mutationFn: login,
        onSuccess: () => {
            loginSuccess();
        },
        onError: (error) => {
            loginFail(error);
        }
    });
}
