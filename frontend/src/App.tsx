
import LoginRegisterPage from "./view/pages/LoginRegisterPage"

import {z} from "zod"

  const Period = z.object({
    id: z.number(),
    start: z.string(),
    end: z.nullable(z.string()),
    notes: z.string()
  })

function App() {





  return (
    <>
      <h1 className="text-red-400">Period tracker</h1>
      <LoginRegisterPage />
    </>
  )
}

export default App
