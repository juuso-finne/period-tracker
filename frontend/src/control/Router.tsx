import { createBrowserRouter } from "react-router-dom"

import HomePage from "../view/pages/HomePage"
import LoginRegisterPage from "../view/pages/LoginRegisterPage"
import RedirectPage from "../view/pages/RedirectPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>
  },

  {
    path: "login",
    element: <LoginRegisterPage/>
  },

  {
    path: "redirect",
    element: <RedirectPage/>
  }
])

export default router;