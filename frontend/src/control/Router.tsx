import { createBrowserRouter } from "react-router-dom"

import HomePage from "../view/pages/HomePage"
import LoginRegisterPage from "../view/pages/LoginRegisterPage"
import RedirectPage from "../view/pages/RedirectPage"
import NotFoundPage from "../view/pages/NotFoundPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
    errorElement: <NotFoundPage/>
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