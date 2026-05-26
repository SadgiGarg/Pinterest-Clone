import React, { useState } from 'react'
import { UserData } from  '../context/UserContext'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { LoadingAnimation } from '../components/Loading'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const navigate = useNavigate()
  const {loginUser,btnLoading }= UserData();

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    await loginUser(email,password,navigate)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundColor: "#fbf9f9",
        backgroundImage: `
          radial-gradient(at 0% 0%, rgba(230,0,35,0.05) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(183,0,26,0.03) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(230,0,35,0.05) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(183,0,26,0.03) 0px, transparent 50%)
        `,
      }}
    >
      {/* Background decorative image */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqP5A3rI1rTAp1S6an2S4Gxib8V8xtYoWZ2OYq6YnTK_MDBd_BSgDRAdpabVebZUz26NVqdZGg1WNOT5PIoRVKIctOye7fbjv1El4TtW8cbUvGFISQ1wTISoCaHyyWSdm_0L88fISinGUoGv7Dnh4Ry20z0aaP2GRIuxoVBfr-ctZ_Znf4BRB6_iNBlmxJZjevUjDJs_a3ma4HccoOgyUSPcNTRA_yw-05RPurKHPSUUHxT6dFwW3vn_s6FzTrwQDFGCvvkIcDS6iG"
          alt="background"
          className="w-full h-full object-cover opacity-10 grayscale"
        />
      </div>

      <main className="w-full max-w-[480px]">
        {/* Card */}
        <div
          className="rounded-[32px] p-10 flex flex-col items-center"
          style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(32px)",
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
          }}
        >
          {/* Brand */}
          <div className="mb-6 text-center">
            <span className="text-[#e60023] text-[40px] font-bold leading-none mb-2 block">
              Pinterest
            </span>
            <h1 className="text-2xl font-semibold text-gray-800">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Find new ideas to try
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-14 px-6 bg-black/5 rounded-full focus:ring-2 focus:ring-red-200 text-base outline-none transition-all duration-300"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-14 px-6 bg-black/5 rounded-full focus:ring-2 focus:ring-red-200 text-base outline-none transition-all duration-300"
            />

            {/* Forgot Password */}
            <div className="text-right">
              <a href="#" className="text-sm text-[#b7001a] font-semibold hover:underline">
                Forgot your password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={btnLoading}
              className="w-full h-14 bg-[#e60023] text-white font-semibold rounded-full shadow-lg hover:bg-[#b7001a] transition-colors duration-300 active:scale-95"
            >
              {btnLoading ? <LoadingAnimation /> : "Log in"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center w-full my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-xs text-gray-400 uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Register Link */}
          <p className="text-sm text-gray-500">
            Not on Pinterest yet?{" "}
            <Link to="/register" className="text-[#e60023] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-4 text-center">
          <p className="text-[10px] text-gray-400 tracking-widest uppercase">
            © 2024 PINTEREST INC.
          </p>
        </footer>
      </main>
    </div>
  )
}

export default Login