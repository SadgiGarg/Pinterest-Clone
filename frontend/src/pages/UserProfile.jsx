import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { UserData } from '../context/UserContext'
import { PinData } from '../context/PinContext'
import Loading from '../components/Loading'
import PinCard from '../components/PinCard'
import toast from 'react-hot-toast'
import { FiShare2, FiEdit2, FiLogOut } from 'react-icons/fi'

const UserProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: loggedInUser, setIsAuth } = UserData()
  const { pins } = PinData()

  // 👤 State for profile information
  const [user, setProfileUser] = useState(null)
  
  // 📌 State to hold pins returned explicitly by the backend for this user
  const [localUserPins, setLocalUserPins] = useState([])
  
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("created")
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editBio, setEditBio] = useState("")
  const [btnLoading, setBtnLoading] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [profilePicFile, setProfilePicFile] = useState(null)
  const [previewPic, setPreviewPic] = useState(null)

  const isOwner = loggedInUser?._id === id

  async function fetchUser() {
    try {
      setLoading(true)
      const { data } = await axios.get(`/api/user/${id}`)
      
      // ✅ Restructure the nested backend data wrapper payload correctly
      setProfileUser(data.user)
      setLocalUserPins(data.pins || [])
      
      setEditName(data.user.name)
      setEditBio(data.user.bio || "")
      setIsFollowing(data.user.followers?.includes(loggedInUser?._id))
    } catch (error) {
      console.log("Error loading profile data payload:", error)
      toast.error("Could not fetch user profile details")
    } finally {
      setLoading(false)
    }
  }

  async function followUnfollow() {
    try {
      const { data } = await axios.post(`/api/user/follow/${id}`)
      toast.success(data.message)
      fetchUser()
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }

  async function updateProfile(e) {
    e.preventDefault()
    setBtnLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", editName)
      formData.append("bio", editBio)
      if (profilePicFile) {
        formData.append("file", profilePicFile)
      }

      await axios.put(`/api/user/${id}`, formData)
      toast.success("Profile updated!")
      setIsEditing(false)
      setPreviewPic(null)
      setProfilePicFile(null)
      fetchUser()
    } catch (error) {
      toast.error(error.response?.data?.message)
    } finally {
      setBtnLoading(false)
    }
  }
  
  async function handleLogout() {
    const confirmed = window.confirm("Are you sure you want to log out?")
    if (!confirmed) return
    try {
      await axios.get("/api/user/logout")
      toast.success("Logged out successfully!")
      setIsAuth(false)
      navigate("/login")
    } catch (error) {
      toast.error("Logout failed. Please try again.")
    }
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Profile link copied!")
  }

  useEffect(() => {
    fetchUser()
  }, [id])

  if (loading) return <Loading />

  if (!user) return (
    <div className="flex justify-center items-center h-96">
      <p className="text-gray-400">User not found!</p>
    </div>
  )

  return (
    <div className="min-h-screen pb-32" style={{ backgroundColor: "#fbf9f9" }}>
      <main className="pt-8 pb-32 px-6 max-w-5xl mx-auto">

        {/* ── Profile Header ── */}
        <section className="flex flex-col items-center text-center mb-12">

          {/* Avatar */}
          <div className="relative mb-6 group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-black/5 flex items-center justify-center relative z-10">
              {user.profilePic?.url ? (
                <img
                  src={user.profilePic.url}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl font-bold text-gray-400">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="absolute inset-0 bg-[#e60023] opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
          </div>

          {/* Edit Form OR Name Display */}
          {isEditing ? (
            <form onSubmit={updateProfile} className="space-y-3 w-full max-w-sm">
        
              {/* Profile Pic Upload */}
              <div className="flex flex-col items-center gap-2">
                <label htmlFor="profilePic" className="cursor-pointer group">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-black/5 flex items-center justify-center border-2 border-dashed border-gray-300 group-hover:border-[#e60023] transition">
                    {previewPic ? (
                      <img src={previewPic} alt="preview" className="w-full h-full object-cover" />
                    ) : user.profilePic?.url ? (
                      <img src={user.profilePic.url} alt="profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-gray-400">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-1">Click to change</p>
                </label>
                <input
                  id="profilePic"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    setProfilePicFile(e.target.files[0])
                    setPreviewPic(URL.createObjectURL(e.target.files[0]))
                  }}
                />
              </div>

              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-black/5 rounded-full px-5 py-3 text-center font-bold text-xl focus:outline-none focus:ring-2 focus:ring-red-200 transition-all"
                placeholder="Your name"
              />
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={3}
                className="w-full bg-black/5 rounded-2xl px-5 py-3 text-center text-sm focus:outline-none focus:ring-2 focus:ring-red-200 transition-all resize-none"
                placeholder="Your bio"
              />
              <div className="flex gap-2 justify-center">
                <button
                  type="submit"
                  disabled={btnLoading}
                  className="bg-[#e60023] text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-[#b7001a] transition active:scale-95"
                >
                  {btnLoading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setPreviewPic(null)
                    setProfilePicFile(null)
                  }}
                  className="bg-black/5 text-gray-600 px-6 py-2 rounded-full font-semibold text-sm hover:bg-black/10 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                {user.name}
              </h2>
              <p className="text-gray-500 font-medium mb-3">
                @{user.name?.toLowerCase().replace(/\s+/g, "")}
              </p>
              {user.bio && (
                <p className="max-w-md text-gray-500 mx-auto text-base mb-4">
                  {user.bio}
                </p>
              )}
            </>
          )}

          {/* Followers / Following */}
          <div className="flex items-center gap-6 mb-6">
            <div className="flex flex-col items-center">
              <span className="font-extrabold text-gray-900 text-xl">
                {user.followers?.length ?? 0}
              </span>
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-widest">
                Followers
              </span>
            </div>
            <div className="w-1 h-6 bg-zinc-200 rounded-full"></div>
            <div className="flex flex-col items-center">
              <span className="font-extrabold text-gray-900 text-xl">
                {user.following?.length ?? 0}
              </span>
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-widest">
                Following
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {isOwner ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-[#e60023] text-white rounded-full font-semibold text-sm hover:bg-[#b7001a] transition active:scale-95 shadow-lg"
                >
                  <FiEdit2 size={15} />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-3 bg-black/5 text-gray-700 rounded-full font-semibold text-sm hover:bg-red-50 hover:text-[#e60023] transition active:scale-95"
                >
                  <FiLogOut size={15} />
                  Log out
                </button>
              </>
            ) : (
              <button
                onClick={followUnfollow}
                className={`px-6 py-3 rounded-full font-semibold text-sm transition active:scale-95 shadow-lg ${
                  isFollowing
                    ? "bg-black/5 text-gray-800 hover:bg-black/10"
                    : "bg-[#e60023] text-white hover:bg-[#b7001a]"
                }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
            <button
              onClick={handleShare}
              className="p-3 bg-white border border-zinc-200 rounded-full flex items-center justify-center hover:bg-zinc-50 transition active:scale-95 text-gray-700"
              style={{
                backdropFilter: "blur(12px)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.04)"
              }}
            >
              <FiShare2 size={18} />
            </button>
          </div>
        </section>

        {/* ── Tabs ── */}
        <nav className="flex justify-center border-b border-zinc-200/50 mb-8">
          <div className="flex gap-8 pb-4">
            {["created", "saved"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-semibold text-sm uppercase tracking-widest px-2 relative transition-colors ${
                  activeTab === tab ? "text-gray-900" : "text-gray-400 hover:text-gray-700"
                }`}
              >
                {tab}
                <span
                  className={`absolute -bottom-4 left-1/4 right-1/4 h-[3px] bg-[#e60023] rounded-full transition-transform duration-300 ${
                    activeTab === tab ? "scale-x-100" : "scale-x-0"
                  }`}
                ></span>
              </button>
            ))}
          </div>
        </nav>

        {/* Pins Grid */}
        <section>
          {activeTab === "created" ? (
            localUserPins.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="text-gray-400 text-lg">No pins created yet!</p>
                {isOwner && (
                  <Link
                    to="/pin/create"
                    className="bg-[#e60023] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#b7001a] transition active:scale-95"
                  >
                    Create your first pin
                  </Link>
                )}
              </div>
            ) : (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                {localUserPins.map((pin) => (
                  <PinCard key={pin._id} pin={pin} />
                ))}
              </div>
            )
          ) : (
            (() => {
              // Filters globally stored state values to identify matching items saved by this account
              const savedPins = pins.filter((p) => p.saves?.includes(id))
              return savedPins.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-400 text-lg">No saved pins yet!</p>
                </div>
              ) : (
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                  {savedPins.map((pin) => (
                    <PinCard key={pin._id} pin={pin} />
                  ))}
                </div>
              )
            })()
          )}
        </section>
      </main>
    </div>
  )
}

export default UserProfile