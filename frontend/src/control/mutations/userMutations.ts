
import { useMutation } from "@tanstack/react-query"
import {login, register, deleteUser, logout} from "../../model/API/userData"


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

export const useLogoutMutation = (logoutSuccess: () => void, logoutFail: (error: Error) => void) => {

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            logoutSuccess();
        },
        onError: (error) => {
            logoutFail(error);
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

export const useDeleteUserMutation = (deleteSuccess: () => void, deleteFail: (error: Error) => void) => {
    return useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            deleteSuccess();
        },
        onError: (error) => {
            deleteFail(error);
        }
    });
}
