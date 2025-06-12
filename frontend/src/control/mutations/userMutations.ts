
import { useMutation } from "@tanstack/react-query"
import {login, register} from "../../model/API/userData"


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

export const useRegisterMutation = (registerSuccess: () => void, registerFail: (error: Error) => void) => {

    return useMutation({
        mutationFn: register,
        onSuccess: () => {
            registerSuccess();
        },
        onError: (error) => {
            registerFail(error);
        }
    });
}
