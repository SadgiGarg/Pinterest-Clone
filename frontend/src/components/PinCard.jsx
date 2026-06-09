import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { UserData } from '../context/UserContext'
import { PinData } from '../context/PinContext'

const PinCard = ({ pin }) => {
  const { user } = UserData()
  const { fetchPins } = PinData()
  const [saving, setSaving] = useState(false)

  const isSaved = pin.saves?.includes(user?._id)

  async function handleSave(e) {
    e.preventDefault()
    e.stopPropagation()
    setSaving(true)
    try {
      await axios.post(`/api/pin/save/${pin._id}`)
      await fetchPins()
    } catch (error) {
      console.log(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="break-inside-avoid block group mb-4">
      <div
        className="rounded-[20px] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(32px)",
          border: "1px solid rgba(255,255,255,0.4)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
        }}
      >
        {/* Pin Image with Save Button on hover */}
        <div className="relative overflow-hidden">
          <Link to={`/pin/${pin._id}`} className="block">
            <img
              src={pin.image?.url}
              alt={pin.title}
              className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Save Button - shows on hover */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-start justify-end p-3 pointer-events-none">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`pointer-events-auto font-semibold text-sm px-4 py-2 rounded-full shadow-lg transition-all duration-200 active:scale-95 ${
                isSaved
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-[#e60023] text-white hover:bg-[#b7001a]"
              }`}
            >
              {saving ? "..." : isSaved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* Pin Info */}
        <div className="p-3">
          <h3 className="font-semibold text-gray-800 text-sm truncate">
            {pin.title}
          </h3>

          <div className="flex items-center justify-between mt-2">
            {/* Owner */}
            <Link
              to={`/user/${pin.owner?._id}`}
              className="flex items-center gap-2 w-fit group/owner"
            >
              <div className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
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

            {/* Save count */}
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