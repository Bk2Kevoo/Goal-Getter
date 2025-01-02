import { createBrowserRouter } from "react-router-dom"
import App from '../App'
import About from "../aboutpage/About"
import Error from '../errors/ErrorPage'
import Registration from "../auth/Register"
import Profile from "../usersettings/profile"
import Dashboard from "../dashboard/Dashboard"
import ExpensesForm from "../expense/ExpenseForm"
import Goals from "../goals/Goals"
import EditGoal from "../goals/EditGoalForm"
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
            },
            {
                path: "/expenses/new",
                element: <ExpensesForm />
            },
            {
                path: "/goals/new",
                element: <Goals />
            },
            {
                path:"/goals/:id/update",
                element: <EditGoal />
            }
        ]
    }
])