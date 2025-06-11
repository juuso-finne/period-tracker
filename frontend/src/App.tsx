import { useEffect, useState } from "react"
import { useLoginMutation } from "./control/mutations/userMutations";
import LoginRegisterForm from "./view/components/scripts/LoginRegisterForm"
import { getCookie } from "./control/cookies";
import type { LoginInfo } from "./types";
import {z} from "zod"

  const Period = z.object({
    id: z.number(),
    start: z.string(),
    end: z.nullable(z.string()),
    notes: z.string()
  })

function App() {


  const [greeting, setGreeting] = useState<string>("Hello, guest");
  const [username, setUsername] = useState<string>("");

  useEffect(() =>{
    if(username !== ""){
      setGreeting(`Hello, ${username}!`);
    } else{
      setGreeting("Hello, guest")
    }
  },[username])

  const updateUsername = () => {
    const username = getCookie("username")
    setUsername(username || "");
  }


  const loginMutation = useLoginMutation(updateUsername)

  useEffect(() =>{
    const result = Period.array().safeParse([])
    console.log(result)
  }, [])

  const loginFunction = (userData: LoginInfo) => {
    loginMutation.mutate(userData)
  }



  return (
    <>
      <h1 className="text-red-400">Period tracker</h1>
      <p>{greeting}</p>
      <LoginRegisterForm submitHandler={loginFunction} prompt={"Log in"} />
{/*       <button
        className="btn btn-danger"
        onClick={() => {
          loginMutation.mutate(userData)
          console.log(getCookie("username"))
        }}
      >
        Login
      </button> */}
    </>
  )
}

export default App
