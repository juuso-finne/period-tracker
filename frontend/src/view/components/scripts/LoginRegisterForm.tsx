import { useRef } from "react";
import type { LoginInfo } from "../../../types";

type Props= {
    submitHandler: (userData: LoginInfo) => void,
    prompt: string
}

const LoginRegisterForm = (props: Props) => {

    const {submitHandler, prompt} = props;

    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (usernameRef.current && passwordRef.current) {
            const userData: LoginInfo = {
                username: usernameRef.current.value,
                password: passwordRef.current.value
            };
            submitHandler(userData);
        }
    }


    return (
        <div>
            <form>
                <label htmlFor="usernameInput">Username:</label>
                <input ref={usernameRef} type="text" id="usernameInput"></input>
                <label htmlFor="passwordInput">Password:</label>
                <input ref={passwordRef} type="password" id="passwordInput"></input>
                <button className="btn-primary" onClick={handleSubmit}>{prompt}</button>
            </form>
        </div>
    )
}

export default LoginRegisterForm

