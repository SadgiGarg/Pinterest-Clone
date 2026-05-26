import React from 'react'
import { PinData } from '../context/PinContext'
import PinCard from '../components/PinCard'
import Loading from '../components/Loading'

const Home = () => {
  const { pins, loading: isLoading } = PinData()

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
      {isLoading ? (
        <Loading />
      ) : pins.length === 0 ? (
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-400 text-lg">No pins yet!</p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {pins.map((pin) => (
            <PinCard key={pin._id} pin={pin} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home