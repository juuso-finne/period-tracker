import { useState } from "react"
import { useLoginMutation, useRegisterMutation } from "../../control/mutations/userMutations";
import LoginRegisterForm from "../components/scripts/LoginRegisterForm"
import type { LoginInfo } from "../../model/types";

export default function LoginRegisterPage() {
    const [existingUser, setExistingUser] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const errorHandler = (error: Error) => {
        setErrorMessage(error.message);
    }

    const loginSuccess = () => {
        window.location.href = "/";
    }

    const registerSuccess = () => {
        window.location.href = "/";
    }

    const loginMutation = useLoginMutation(loginSuccess, errorHandler);
    const registerMutation = useRegisterMutation(registerSuccess, errorHandler);

    const loginFunction = (userData: LoginInfo) => {
        loginMutation.mutate(userData);
    }

    const registerFunction = (userData: LoginInfo) => {
        registerMutation.mutate(userData);
    }

    return (
        <>
            <h2 className="font-bold">{existingUser ? "Log in" : "Register"}</h2>
            <LoginRegisterForm
                submitHandler={existingUser ? loginFunction : registerFunction}
                prompt = {existingUser ? "Log in" : "Register"}
            />
            <p className="text-red-400">{errorMessage}</p>
            <p className="text-blue-700 cursor-pointer"  onClick={() => setExistingUser(prev => !prev)}>{
                existingUser ?
                "Don't have an account? Click here to register"
                : "Already have an account? Click here to log in"
            }</p>
        </>
    )
}
