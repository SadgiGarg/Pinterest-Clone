import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserData } from './context/UserContext'
import{ Loading }  from './components/Loading'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import PinPage from './pages/PinPages'
import Navbar from './components/Navbar'
import CreatePin from "./pages/CreatePin"
import MyAccount from "./pages/MyAccount"
import UserProfile from './pages/UserProfile'


const App = () => {
  const { loading, isAuth, user } = UserData()

  return (
    <>
      {loading ? (
        <Loading /> 
      ) : (
        <BrowserRouter>
          {isAuth && <Navbar user={user} />}
          <Routes>
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route path="/register" element={isAuth ? <Home /> : <Register />} />
            <Route path="/" element={isAuth ? <Home /> : <Login />} />
            <Route path="/pin/:id" element={isAuth ? <PinPage /> : <Login />} />
            <Route path="/pin/create" element={isAuth ? <CreatePin /> : <Login />} />
            <Route path="/profile/:id" element={isAuth ? <MyAccount /> : <Login />} />
            <Route path="/user/:id" element={isAuth ? <UserProfile /> : <Login />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  )
}

export default App