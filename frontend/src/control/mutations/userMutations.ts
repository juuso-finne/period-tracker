
import { useMutation } from "@tanstack/react-query"
import {login} from "../../model/API/userData"


export const useLoginMutation = (setErrorText: React.Dispatch<React.SetStateAction<string>>) => {

    return useMutation({
        mutationFn: login,
        onSuccess: () => {
            setErrorText("Login successful")
        },
        onError: (error) => {
            setErrorText(error.message);
        }
    });
}
