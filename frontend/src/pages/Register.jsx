import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserData } from '../context/UserContext'

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [terms, setTerms] = useState(false)

  const navigate = useNavigate()
  const { registerUser, btnLoading } = UserData()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await registerUser(name, email, password, navigate)
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
      {/* Background Decorative Image */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqP5A3rI1rTAp1S6an2S4Gxib8V8xtYoWZ2OYq6YnTK_MDBd_BSgDRAdpabVebZUz26NVqdZGg1WNOT5PIoRVKIctOye7fbjv1El4TtW8cbUvGFISQ1wTISoCaHyyWSdm_0L88fISinGUoGv7Dnh4Ry20z0aaP2GRIuxoVBfr-ctZ_Znf4BRB6_iNBlmxJZjevUjDJs_a3ma4HccoOgyUSPcNTRA_yw-05RPurKHPSUUHxT6dFwW3vn_s6FzTrwQDFGCvvkIcDS6iG"
          alt="background"
          className="w-full h-full object-cover opacity-10 grayscale"
        />
      </div>

      <main className="w-full max-w-[480px]">
        {/* Glass Card */}
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
              Create your account
            </h1>
            <p className="text-sm text-[#5f5e5e] mt-1">
              Join our community of elite curators
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-6">

            {/* Full Name - Floating Label */}
            <div className="relative group">
              <input
                type="text"
                id="full_name"
                placeholder=" "
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-14 px-6 pt-4 pb-1 bg-black/5 rounded-full focus:ring-2 focus:ring-red-200 text-base outline-none transition-all duration-300 peer"
              />
              <label
                htmlFor="full_name"
                className="absolute left-6 top-4 text-[#5f5e5e] pointer-events-none transition-all duration-300 origin-left
                  peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-[#b7001a] peer-focus:font-semibold
                  peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75"
              >
                Full Name
              </label>
            </div>

            {/* Email - Floating Label */}
            <div className="relative group">
              <input
                type="email"
                id="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-14 px-6 pt-4 pb-1 bg-black/5 rounded-full focus:ring-2 focus:ring-red-200 text-base outline-none transition-all duration-300 peer"
              />
              <label
                htmlFor="email"
                className="absolute left-6 top-4 text-[#5f5e5e] pointer-events-none transition-all duration-300 origin-left
                  peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-[#b7001a] peer-focus:font-semibold
                  peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75"
              >
                Email Address
              </label>
            </div>

            {/* Password - Floating Label */}
            <div className="relative group">
              <input
                type="password"
                id="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-14 px-6 pt-4 pb-1 bg-black/5 rounded-full focus:ring-2 focus:ring-red-200 text-base outline-none transition-all duration-300 peer"
              />
              <label
                htmlFor="password"
                className="absolute left-6 top-4 text-[#5f5e5e] pointer-events-none transition-all duration-300 origin-left
                  peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-[#b7001a] peer-focus:font-semibold
                  peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75"
              >
                Password
              </label>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start px-2">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  required
                  className="w-4 h-4 text-[#e60023] border-gray-300 rounded focus:ring-red-200 bg-white cursor-pointer"
                />
              </div>
              <div className="ml-2 text-sm text-[#5f5e5e]">
                <label htmlFor="terms">
                  I agree to the{" "}
                  <a href="#" className="text-[#b7001a] font-semibold hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#b7001a] font-semibold hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={btnLoading}
              className="w-full h-14 bg-[#e60023] text-white font-semibold rounded-full shadow-lg shadow-red-200 hover:bg-[#b7001a] transition-colors duration-300 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{btnLoading ? "Creating account..." : "Create account"}</span>
              {!btnLoading && (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </button>
          </form>

          {/* Secondary Actions */}
          <div className="mt-10 text-center space-y-4 w-full">

            {/* Login Link */}
            <p className="text-sm text-[#5f5e5e]">
              Already have an account?{" "}
              <Link to="/login" className="text-[#b7001a] font-semibold hover:underline ml-1">
                Sign in
              </Link>
            </p>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-[10px] text-[#5f5e5e] uppercase tracking-widest font-semibold">
                or register with
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Social Buttons */}
            <div className="flex gap-4 justify-center">
              {/* Google */}
              <button
                type="button"
                className="flex items-center justify-center w-14 h-14 rounded-full hover:bg-white transition-all active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(32px)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
                }}
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAw8FbFVJ93vNg2yvQ_uGXHDSz2Xi34-0eAALZeI4oiw4kRL7fJL0nlin_n0yp61KwTiDp6bGqkpsgTpJJWC49M3p3XSkZmk7llUdwFMA1UMqFLewxAeIGf2HlKBEBstExjpkn9RiB-KwL_DslazCyIIA1Yx_0v3sZNKiejtH-_kGRYzDh-kyCUKOZEDpkPv5AU2v-cpBORKfjS7B3hHwAKYqp_Keq2pFLDX3KvMfDUYJethTokY9jWqtV_N6jhHG66VRK1ZFB6cfb0"
                  alt="Google"
                  className="w-6 h-6"
                />
              </button>

              {/* Apple */}
              <button
                type="button"
                className="flex items-center justify-center w-14 h-14 rounded-full hover:bg-white transition-all active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(32px)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-zinc-900" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </button>
            </div>
          </div>
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

export default Register