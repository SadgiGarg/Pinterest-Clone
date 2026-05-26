import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserData } from '../context/UserContext'

const Navbar = () => {
  const { user, isAuth } = UserData()
  const navigate = useNavigate()

  return (
    <nav
      className="sticky top-0 z-50 px-6 py-3 flex items-center justify-between"
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(32px)",
        borderBottom: "1px solid rgba(255,255,255,0.4)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <span className="text-[#e60023] text-2xl font-bold">
          Pinterest
        </span>
      </Link>

      {/* Search Bar */}
      <div className="flex-1 mx-6 max-w-xl">
        <input
          type="text"
          placeholder="Search for ideas..."
          className="w-full bg-black/5 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-300"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {isAuth ? (
          <>
            <Link
              to="/"
              className="text-gray-600 font-semibold hover:text-black text-sm hidden md:block px-4 py-2 rounded-full hover:bg-black/5 transition-all duration-300"
            >
              Home
            </Link>
            <Link
              to="/pin/create"
              className="text-gray-600 font-semibold hover:text-black text-sm hidden md:block px-4 py-2 rounded-full hover:bg-black/5 transition-all duration-300"
            >
             Create
             </Link>
            <Link
              to={`/user/${user?._id}`}
              className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-red-200 transition-all duration-300"
            >
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-600 font-semibold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 font-semibold text-sm px-4 py-2 rounded-full hover:bg-black/5 transition-all duration-300"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="bg-[#e60023] text-white font-semibold rounded-full px-5 py-2 text-sm hover:bg-[#b7001a] transition-colors duration-300 active:scale-95"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar