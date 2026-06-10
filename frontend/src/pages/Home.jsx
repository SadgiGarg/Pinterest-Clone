import React, { useEffect, useRef } from 'react'
import { PinData } from '../context/PinContext'
import PinCard from '../components/PinCard'
import { Loading } from '../components/Loading'

const Home = () => {
  const { pins, loading, fetchPins, page, hasMore } = PinData()
  const observerRef = useRef(null)

  // ✅ Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPins(page + 1)
        }
      },
      { threshold: 0.1 }
    )
    if (observerRef.current) observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading, page])

  return (
    <div
      className="min-h-screen p-6"
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
      {pins.length === 0 && loading ? (
        <Loading />
      ) : pins.length === 0 ? (
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-400 text-lg">No pins yet!</p>
        </div>
      ) : (
        <>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            {pins.map((pin) => (
              <PinCard key={pin._id} pin={pin} />
            ))}
          </div>

          {/* Infinite scroll trigger */}
          <div ref={observerRef} className="h-10 mt-4" />

          {loading && (
            <div className="flex justify-center py-6">
              <div className="w-8 h-8 border-2 border-[#e60023] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!hasMore && pins.length > 0 && (
            <p className="text-center text-gray-400 text-sm py-6">
              You've seen all pins! 🎉
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default Home