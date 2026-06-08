import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { UserData } from '../context/UserContext'
import Loading from '../components/Loading'
import { FiEdit2, FiX, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'

const PinPage = () => {
  const { id } = useParams()
  const { user, isAuth } = UserData()
  const navigate = useNavigate()

  const [pin, setPin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState("")
  const [btnLoading, setBtnLoading] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editPin, setEditPin] = useState("")
  const [editLoading, setEditLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  async function fetchPin() {
    try {
      const { data } = await axios.get(`/api/pin/${id}`)
      setPin(data)
      setEditTitle(data.title)
      setEditPin(data.pin)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleEdit(e) {
    e.preventDefault()

    if (editTitle.trim().length < 3) {
      return toast.error("Title must be at least 3 characters")
    }
    if (editPin.trim().length < 10) {
      return toast.error("Description must be at least 10 characters")
    }

    setEditLoading(true)
    try {
      const { data } = await axios.put(`/api/pin/${id}`, {
        title: editTitle,
        pin: editPin,
      })
      toast.success(data.message)
      setHasChanges(false)
      setIsEditing(false)
      fetchPin()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update pin")
    } finally {
      setEditLoading(false)
    }
  }

  async function addComment(e) {
    e.preventDefault()
    setBtnLoading(true)
    try {
      await axios.post(`/api/pin/comment/${id}`, { comment })
      setComment("")
      fetchPin()
    } catch (error) {
      console.log(error)
    } finally {
      setBtnLoading(false)
    }
  }

  async function deleteComment(commentId) {
    try {
      await axios.delete(`/api/pin/comment/${id}?commentId=${commentId}`)
      fetchPin()
    } catch (error) {
      console.log(error)
    }
  }

  async function deletePin() {
    const confirmed = window.confirm("Are you sure you want to delete this pin?")
    if (!confirmed) return
    try {
      await axios.delete(`/api/pin/${id}`)
      toast.success("Pin deleted!")
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchPin()
  }, [id])

  // ✅ Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [hasChanges])

  if (loading) return <Loading />

  if (!pin) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-400">Pin not found!</p>
    </div>
  )

  // ✅ Fixed ID comparison
  const isOwner = isAuth &&
    user?._id?.toString() === pin.owner?._id?.toString()

  return (
    <div
      className="min-h-screen p-6 flex items-start justify-center"
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
      <div
        className="w-full max-w-4xl rounded-[32px] overflow-hidden flex flex-col md:flex-row"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(32px)",
          border: "1px solid rgba(255,255,255,0.4)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
        }}
      >
        {/* Left - Image */}
        <div className="md:w-1/2">
          <img
            src={pin.image?.url}
            alt={pin.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right - Details */}
        <div className="md:w-1/2 p-8 flex flex-col">

          {/* Owner + Actions */}
          <div className="flex items-center justify-between mb-4">
            <Link
              to={`/user/${pin.owner?._id}`}
              className="flex items-center gap-3 hover:opacity-80 transition"
            >
              <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center overflow-hidden">
                {pin.owner?.profilePic ? (
                  <img
                    src={pin.owner.profilePic}
                    alt={pin.owner.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-semibold">
                    {pin.owner?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {pin.owner?.name}
                </p>
                <p className="text-xs text-gray-400">
                  {pin.owner?.email}
                </p>
              </div>
            </Link>

            {/* ✅ Owner Action Buttons */}
            {isOwner && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (isEditing) {
                      // Reset to original values on cancel
                      setEditTitle(pin.title)
                      setEditPin(pin.pin)
                      setHasChanges(false)
                    }
                    setIsEditing(!isEditing)
                  }}
                  className={`flex items-center gap-1 text-xs font-semibold transition px-3 py-1.5 rounded-full ${
                    isEditing
                      ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      : "bg-black/5 text-gray-600 hover:bg-black/10"
                  }`}
                >
                  {isEditing ? (
                    <><FiX size={12} /> Cancel</>
                  ) : (
                    <><FiEdit2 size={12} /> Edit</>
                  )}
                </button>

                <button
                  onClick={deletePin}
                  className="text-xs text-red-500 font-semibold hover:text-red-700 transition px-3 py-1.5 rounded-full hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Edit Form OR Normal View */}
          {isEditing ? (
            <form onSubmit={handleEdit} className="mb-6 space-y-3">
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1 block">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => {
                    setEditTitle(e.target.value)
                    setHasChanges(true)
                  }}
                  required
                  placeholder="Pin title"
                  className="w-full px-4 py-3 bg-black/5 rounded-2xl text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-300"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1 block">
                  Description
                </label>
                <textarea
                  value={editPin}
                  onChange={(e) => {
                    setEditPin(e.target.value)
                    setHasChanges(true)
                  }}
                  required
                  rows={4}
                  placeholder="Pin description"
                  className="w-full px-4 py-3 bg-black/5 rounded-2xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-300 resize-none"
                />
              </div>

              {/* Character count hints */}
              <div className="flex justify-between text-[10px] text-gray-400 px-1">
                <span>{editTitle.length} chars (min 3)</span>
                <span>{editPin.length} chars (min 10)</span>
              </div>

              <button
                type="submit"
                disabled={editLoading || !hasChanges}
                className={`w-full text-white rounded-full py-3 font-semibold text-sm transition-colors duration-300 active:scale-95 flex items-center justify-center gap-2 ${
                  editLoading || !hasChanges
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#e60023] hover:bg-[#b7001a]"
                }`}
              >
                {editLoading ? (
                  "Saving..."
                ) : (
                  <><FiCheck size={14} /> Save Changes</>
                )}
              </button>
            </form>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {pin.title}
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                {pin.pin}
              </p>
            </>
          )}

          {/* Comments */}
          <div className="flex-1 overflow-y-auto">
            <h2 className="font-semibold text-gray-700 mb-3">
              Comments ({pin.comments?.length})
            </h2>

            {pin.comments?.length === 0 ? (
              <p className="text-gray-400 text-sm">No comments yet!</p>
            ) : (
              <div className="space-y-3">
                {pin.comments?.map((c) => (
                  <div key={c._id} className="flex items-start justify-between gap-2">
                    <Link
                      to={`/user/${c.user?._id}`}
                      className="flex items-start gap-2 hover:opacity-80 transition"
                    >
                      <div className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {c.user?.profilePic ? (
                          <img
                            src={c.user.profilePic}
                            alt={c.user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-semibold text-gray-600">
                            {c.user?.name?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700">
                          {c.user?.name}
                        </p>
                        <p className="text-xs text-gray-500">{c.comment}</p>
                      </div>
                    </Link>

                    {/* ✅ Fixed comment delete ID comparison */}
                    {isAuth && user?._id?.toString() === c.user?._id?.toString() && (
                      <button
                        onClick={() => deleteComment(c._id)}
                        className="text-xs text-red-400 hover:text-red-600 flex-shrink-0"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Comment */}
          {isAuth && (
            <form onSubmit={addComment} className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="flex-1 bg-black/5 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-300"
              />
              <button
                type="submit"
                disabled={btnLoading}
                className="bg-[#e60023] text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-[#b7001a] transition-colors duration-300 active:scale-95"
              >
                {btnLoading ? "..." : "Post"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default PinPage