import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FiUpload, FiPlus, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { LoadingAnimation } from '../components/Loading'

const CreatePin = () => {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [pin, setPin] = useState("")
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [btnLoading, setBtnLoading] = useState(false)
  const [showAltText, setShowAltText] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  function handleFileChange(e) {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }
  }

  function handleDragOver(e) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) {
      setFile(dropped)
      setPreview(URL.createObjectURL(dropped))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) {
      toast.error("Please upload an image!")
      return
    }
    setBtnLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("pin", pin)
      formData.append("file", file)

      const { data } = await axios.post("/api/pin/new", formData)
      toast.success(data.message)
      navigate("/")
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!")
    } finally {
      setBtnLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen pt-6 pb-32 px-6"
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
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Left - Upload Area */}
          <div className="md:col-span-5">
            <div className="sticky top-28">
              <label
                htmlFor="pin-upload"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`group relative flex flex-col items-center justify-center w-full aspect-[2/3] rounded-[32px] cursor-pointer overflow-hidden border-2 border-dashed transition-all duration-500 ${
                  isDragging
                    ? "border-[#E60023] bg-[#E60023]/5"
                    : "border-zinc-200 hover:border-[#E60023]"
                }`}
                style={{
                  background: preview ? "none" : "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(12px)",
                  border: isDragging ? "2px dashed #E60023" : undefined,
                  boxShadow: "0 8px 32px 0 rgba(0,0,0,0.04)",
                }}
              >
                <input
                  id="pin-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-semibold text-sm bg-black/40 px-4 py-2 rounded-full">
                        Change image
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-zinc-50/30 group-hover:bg-[#E60023]/5 transition-colors duration-500"></div>
                    <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center">
                      <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-500">
                        <FiUpload className="text-zinc-900 text-2xl" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-semibold text-zinc-900">
                          Upload a Pin
                        </p>
                        <p className="text-sm text-zinc-500">
                          Drag and drop or click to upload (JPG, PNG)
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-center">
                      <span className="text-xs text-zinc-400 uppercase tracking-widest">
                        Recommended: 1000 x 1500 px
                      </span>
                    </div>
                  </>
                )}
              </label>
              <p className="mt-4 text-center text-sm text-zinc-400">
                We recommend high-quality .jpg files less than 20MB
              </p>
            </div>
          </div>

          {/* Right - Form */}
          <div className="md:col-span-7 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">
                Create Pin
              </h1>
              <button
                type="submit"
                disabled={btnLoading}
                className="bg-[#E60023] text-white px-8 py-3 rounded-full font-semibold text-sm tracking-wide shadow-lg hover:bg-red-700 active:scale-95 transition-all duration-200 flex items-center gap-2"
              >
                {btnLoading ? <LoadingAnimation /> : "PUBLISH"}
              </button>
            </div>

            {/* Title */}
            <div className="relative group">
              <label className="absolute left-6 top-3 text-[10px] text-zinc-400 pointer-events-none group-focus-within:text-[#E60023] transition-colors tracking-widest uppercase">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Add a catchy title"
                className="w-full pt-8 pb-3 px-6 bg-white/40 border border-zinc-200 rounded-2xl text-xl font-semibold text-zinc-900 placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#E60023]/20 focus:border-[#E60023] transition-all duration-300"
              />
            </div>

            {/* Description */}
            <div className="relative group">
              <label className="absolute left-6 top-3 text-[10px] text-zinc-400 pointer-events-none group-focus-within:text-[#E60023] transition-colors tracking-widest uppercase">
                Description
              </label>
              <textarea
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                placeholder="Tell everyone what your Pin is about"
                rows={4}
                className="w-full pt-8 pb-4 px-6 bg-white/40 border border-zinc-200 rounded-2xl text-base text-zinc-900 placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#E60023]/20 focus:border-[#E60023] transition-all duration-300 resize-none"
              />
            </div>

            {/* Alt Text Toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAltText(!showAltText)}
                className="flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors tracking-widest uppercase"
              >
                <span>Add Alt Text</span>
                <FiPlus
                  className={`transition-transform duration-300 ${showAltText ? "rotate-45" : ""}`}
                />
              </button>

              {showAltText && (
                <div className="relative group mt-4">
                  <label className="absolute left-6 top-3 text-[10px] text-zinc-400 pointer-events-none group-focus-within:text-[#E60023] transition-colors tracking-widest uppercase">
                    Alt Text
                  </label>
                  <textarea
                    placeholder="Describe what's in this Pin for screen readers"
                    rows={3}
                    className="w-full pt-8 pb-3 px-6 bg-white/40 border border-zinc-200 rounded-2xl text-sm text-zinc-900 placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#E60023]/20 focus:border-[#E60023] transition-all duration-300 resize-none"
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      </form>
    </div>
  )
}

export default CreatePin