import { useNavigate, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './nav/Header'
import toast, { Toaster } from 'react-hot-toast'

const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
}

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()


  const updateUser = (value) => setCurrentUser(value)

  useEffect(() => {
    (async () => {
      const resp = await fetch("/api/v1/current-user", {
        headers: {
          "X-CSRF-TOKEN": getCookie("csrf_access_token")
        }
      })
      const data = await resp.json()
      if (resp.ok) {
        updateUser(data)
      } else {
        const resp = await fetch("/api/v1/refresh", {
          method: "POST",
          headers: {
            "X-CSRF-TOKEN": getCookie("csrf_refresh_token")
          }
        })
        const refreshData = await resp.json()
        if (resp.ok) {
          updateUser(refreshData)
        } else {
          toast.error(data.error)
          navigate("/register")
        }
      }
    })()
  }, [navigate])


  return (
    <>
      <Header currentUser={currentUser} updateUser={updateUser} getCookie={getCookie} />
      <Toaster />
      <Outlet context={{ currentUser, updateUser, getCookie}} />
    </>
  )
}

export default App
