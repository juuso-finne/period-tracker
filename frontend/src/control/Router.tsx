import { createBrowserRouter } from "react-router-dom"

import HomePage from "../view/pages/HomePage"
import LoginRegisterPage from "../view/pages/LoginRegisterPage"
import RedirectPage from "../view/pages/RedirectPage"
import NotFoundPage from "../view/pages/NotFoundPage"
import NewPeriodPage from "../view/pages/NewPeriodPage"
import EditPeriodPage from "../view/pages/EditPeriodPage"
import SettingsPage from "../view/pages/SettingsPage"
import ViewDataPage from "../view/pages/ViewDataPage"

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
  },

  {
    path: "new",
    element: <NewPeriodPage/>
  },

  {
    path: "editPeriod/:id",
    element: <EditPeriodPage/>
  },

  {
    path: "settings",
    element: <SettingsPage/>
  },

  {
    path: "view",
    element: <ViewDataPage/>
  }
])

export default router;