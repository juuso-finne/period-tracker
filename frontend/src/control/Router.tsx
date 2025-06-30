import { createBrowserRouter } from "react-router-dom"

import HomePage from "../view/pages/HomePage"
import LoginRegisterPage from "../view/pages/LoginRegisterPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>
  },

  {
    path: "login",
    element: <LoginRegisterPage/>
  }
])

export default router;