import { createBrowserRouter } from "react-router-dom"
import App from '../App'
import About from "../aboutpage/About"
import Error from '../errors/ErrorPage'
import Registration from "../auth/register"
import Profile from "../usersettings/profile"
import Dashboard from "../dashboard/Dashboard"
// import Profile from '../user/profile'

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <Error />,
        children: [
            {
                path: "/about",
                element: <About />
            },
            {
                path: "/dashboard",
                element: <Dashboard />
            },
            {
                path: "/register",
                element: <Registration />
            },
            {
                path: "/settings",
                element: <Profile />
            }
        ]
    }
])