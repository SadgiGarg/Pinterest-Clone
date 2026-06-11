import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { UserData } from '../context/UserContext'
import { PinData } from '../context/PinContext'

const PinCard = ({ pin }) => {
  const { user } = UserData()
  const { setPins } = PinData()
  const [saving, setSaving] = useState(false)
  const [liking, setLiking] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const isSaved = pin.saves?.includes(user?._id)
  // ✅ Check if the current logged-in user is in the likes array
  const isLiked = pin.likes?.includes(user?._id)

  async function handleSave(e) {
    e.preventDefault()
    e.stopPropagation()
    if (saving) return

    // ✅ Optimistic UI update for Saves
    const wasSaved = isSaved
    setPins(prev => prev.map(p => {
      if (p._id !== pin._id) return p
      return {
        ...p,
        saves: wasSaved
          ? p.saves.filter(id => id !== user?._id)
          : [...(p.saves || []), user?._id]
      }
    }))

    setSaving(true)
    try {
      await axios.post(`/api/pin/save/${pin._id}`)
    } catch (error) {
      // ✅ Rollback on failure
      setPins(prev => prev.map(p => {
        if (p._id !== pin._id) return p
        return {
          ...p,
          saves: wasSaved
            ? [...(p.saves || []), user?._id]
            : p.saves.filter(id => id !== user?._id)
        }
      }))
      console.log(error)
    } finally {
      setSaving(false)
    }
  }

  // ✅ New Handler: Toggles Like status optimistically
  async function handleLike(e) {
    e.preventDefault()
    e.stopPropagation()
    if (liking) return

    const wasLiked = isLiked
    
    // ⚡ Optimistic UI Update: Instantly add/remove user ID from context state array
    setPins(prev => prev.map(p => {
      if (p._id !== pin._id) return p
      return {
        ...p,
        likes: wasLiked
          ? (p.likes || []).filter(id => id !== user?._id)
          : [...(p.likes || []), user?._id]
      }
    }))

    setLiking(true)
    try {
      // Hits the PUT endpoint we established on your backend routes line
      await axios.put(`/api/pin/like/${pin._id}`)
    } catch (error) {
      // 🔄 Rollback state changes gracefully if the database server throws an error
      setPins(prev => prev.map(p => {
        if (p._id !== pin._id) return p
        return {
          ...p,
          likes: wasLiked
            ? [...(p.likes || []), user?._id]
            : (p.likes || []).filter(id => id !== user?._id)
        }
      }))
      console.log("Like feature error context:", error)
    } finally {
      setLiking(false)
    }
  }

  return (
    <div className="break-inside-avoid block group mb-4">
      <div
        className="rounded-[20px] overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(32px)",
          border: "1px solid rgba(255,255,255,0.4)",
          boxShadow: isHovered
            ? "0 20px 40px rgba(0,0,0,0.12)"
            : "0 4px 15px rgba(0,0,0,0.04)",
          transform: isHovered ? "scale(1.02)" : "scale(1)",
          transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Pin Image */}
        <div className="relative overflow-hidden">
          <Link to={`/pin/${pin._id}`} className="block">
            <img
              src={pin.image?.url}
              alt={pin.title}
              className="w-full object-cover"
              style={{
                transform: isHovered ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            />
          </Link>

          {/* Hover overlay */}
          <div
            className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none"
            style={{
              background: isHovered
                ? "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.3) 100%)"
                : "transparent",
              opacity: isHovered ? 1 : 0,
              transition: "all 0.3s ease",
            }}
          >
            {/* Top - Save button */}
            <div className="flex justify-end pointer-events-auto">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`font-bold text-sm px-4 py-2 rounded-full shadow-lg transition-all duration-200 active:scale-95 ${
                  isSaved
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-[#e60023] text-white hover:bg-[#b7001a]"
                }`}
              >
                {saving ? "..." : isSaved ? "Saved" : "Save"}
              </button>
            </div>

            {/* Bottom - Owner */}
            <div className="flex items-center gap-2 pointer-events-auto">
              <Link
                to={`/user/${pin.owner?._id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border border-white/40">
                  {pin.owner?.profilePic?.url ? (
                    <img
                      src={pin.owner.profilePic.url}
                      alt={pin.owner.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-xs font-bold">
                      {pin.owner?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-white text-xs font-semibold drop-shadow">
                  {pin.owner?.name}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Pin Info */}
        <div className="p-3">
          <h3 className="font-semibold text-gray-800 text-sm truncate">
            {pin.title}
          </h3>

          <div className="flex items-center justify-between mt-2">
            <Link
              to={`/user/${pin.owner?._id}`}
              className="flex items-center gap-2 group/owner"
            >
              <div className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {pin.owner?.profilePic?.url ? (
                  <img
                    src={pin.owner.profilePic.url}
                    alt={pin.owner.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-xs font-semibold text-gray-600">
                    {pin.owner?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 group-hover/owner:underline">
                {pin.owner?.name}
              </span>
            </Link>

            {/* ✅ Interactive Heart Section */}
            <div className="flex items-center gap-2.5">
              <button 
                onClick={handleLike}
                disabled={liking}
                className="transition-transform duration-150 active:scale-90 flex items-center justify-center focus:outline-none"
              >
                {isLiked ? (
                  // Filled Red Heart Icon SVG
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e60023" className="w-5 h-5 drop-shadow-sm">
                    <path d="M11.645 20.91l-.007-.003-.005-.002-1.198-.6c-4.436-2.233-7.435-5.322-7.435-9.135 0-3.376 2.725-6.172 6.12-6.172 2.11 0 3.86 1.05 4.88 2.535 1.02-1.485 2.77-2.535 4.88-2.535 3.395 0 6.12 2.796 6.12 6.172 0 3.813-3 6.902-7.435 9.136l-1.197.6-.005.002-.007.003-.03.015a.75.75 0 01-.659 0l-.03-.015z" />
                  </svg>
                ) : (
                  // Outlined Gray Heart Icon SVG
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                )}
              </button>

              {/* Display total likes tally metrics dynamically */}
              {pin.likes?.length > 0 && (
                <span className="text-xs font-medium text-gray-500 min-w-[10px]">
                  {pin.likes.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PinCard