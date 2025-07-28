import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Routes ,Route, Navigate} from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore'
import  {Loader} from 'lucide-react'
import {Toaster} from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'

const App = () => {

  const {theme} = useThemeStore()
  const {authUser,checkAuth , isCheckingAuth, onlineUsers} = useAuthStore()

  console.log({onlineUsers})

  useEffect(() =>{
    checkAuth()
  }, [])

  if(isCheckingAuth & !authUser) return(
    <div className='flex items-center justify-center h-screen' >
      <Loader className="size-10 animate-spin" />
    </div>
      
  )
  return (
    <div data-theme = {theme} className="min-h-screen overflow-x-hidden">
      <Navbar  />
      <Routes>
        <Route path="/" element={ authUser? <HomePage/>: <Navigate to="/login" />}/>
        <Route path="/signup" element={ authUser ? <Navigate to= "/" /> : <SignUpPage/>} ></Route>
        <Route path="/login" element = {authUser ? <Navigate to= "/" /> :<LoginPage/>} ></Route>
        <Route path="/settings" element={<SettingsPage/>}></Route>
        <Route  path = "/profile" element = { authUser? <ProfilePage/> : <Navigate to="/login" />}></Route>
      </Routes>
      <Toaster/>

    </div>
  )
}

export default App
