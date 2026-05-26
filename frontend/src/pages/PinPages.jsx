import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { UserData } from '../context/UserContext'
import Loading from '../components/Loading'

const PinPage = () => {
  const { id } = useParams()
  const { user, isAuth } = UserData()
  const navigate = useNavigate()

  const [pin, setPin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState("")
  const [btnLoading, setBtnLoading] = useState(false)

  async function fetchPin() {
    try {
      const { data } = await axios.get(`/api/pin/${id}`)
      setPin(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
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
    try {
      await axios.delete(`/api/pin/${id}`)
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchPin()
  }, [id])

  if (loading) return <Loading />

  if (!pin) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-400">Pin not found!</p>
    </div>
  )

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

          {/* Owner + Delete */}
          <div className="flex items-center justify-between mb-4">

            {/* ✅ Owner is now a clickable link */}
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

            {/* Delete button - only for owner */}
            {isAuth && user?._id === pin.owner?._id && (
              <button
                onClick={deletePin}
                className="text-xs text-red-500 font-semibold hover:text-red-700 transition px-3 py-1 rounded-full hover:bg-red-50"
              >
                Delete Pin
              </button>
            )}
          </div>

          {/* Title & Description */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {pin.title}
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            {pin.pin}
          </p>

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
                    <div className="flex items-start gap-2">

                      {/* ✅ Comment user also links to their profile */}
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
                    </div>

                    {/* Delete comment */}
                    {isAuth && user?._id === c.user?._id && (
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