import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { UserData } from '../context/UserContext'
import { PinData } from '../context/PinContext'

const PinCard = ({ pin }) => {
  const { user } = UserData()
  const { setPins } = PinData()
  const [saving, setSaving] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const isSaved = pin.saves?.includes(user?._id)

  async function handleSave(e) {
    e.preventDefault()
    e.stopPropagation()
    if (saving) return

    // ✅ Optimistic UI update
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

          {/* ✅ Hover overlay */}
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

            {pin.saves?.length > 0 && (
              <span className="text-xs text-gray-400">
                {pin.saves.length} {pin.saves.length === 1 ? "save" : "saves"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PinCard