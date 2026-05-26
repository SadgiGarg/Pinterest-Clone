import React from 'react'
import { Link } from 'react-router-dom'

const PinCard = ({ pin }) => {
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
        {/* Pin Image — clicking goes to pin detail */}
        <Link to={`/pin/${pin._id}`} className="block overflow-hidden">
          <img
            src={pin.image?.url}
            alt={pin.title}
            className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Pin Info */}
        <div className="p-3">
          <h3 className="font-semibold text-gray-800 text-sm truncate">
            {pin.title}
          </h3>

          {/* Owner — clicking goes to user profile */}
          <Link
            to={`/user/${pin.owner?._id}`}
            className="flex items-center gap-2 mt-2 w-fit group/owner"
          >
            <div className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
              {pin.owner?.profilePic ? (
                <img
                  src={pin.owner.profilePic}
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
        </div>
      </div>
    </div>
  )
}

export default PinCard