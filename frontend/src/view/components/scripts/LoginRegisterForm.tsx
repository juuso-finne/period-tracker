type Props= {
    submitHandler: () => void,
    prompt: string
}

const LoginRegisterForm = ({props}:{props: Props}) => {

    const {submitHandler, prompt} = props;

    return (
        <div>
            <form>
                <label htmlFor="usernameInput">Username:</label>
                <input type="text" id="usernameInput"></input>
                <label htmlFor="passwordInput">Password:</label>
                <input type="password" id="passwordInput"></input>
                <button className="btn btn-primary" onClick={submitHandler}>{prompt}</button>
            </form>
        </div>
    )
}

export default LoginRegisterForm

