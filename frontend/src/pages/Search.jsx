import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import PinCard from '../components/PinCard'
import Loading from '../components/Loading'

const Search = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("query")

  const [pins, setPins] = useState([])
  const [loading, setLoading] = useState(false)

  async function searchPins() {
    setLoading(true)
    try {
      const { data } = await axios.get(`/api/pin/search?query=${query}`)
      setPins(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (query) searchPins()
  }, [query])

  if (loading) return <Loading />

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
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          Results for{" "}
          <span className="text-[#e60023]">"{query}"</span>
        </h1>
        <p className="text-gray-400 text-sm">
          {pins.length} {pins.length === 1 ? "pin" : "pins"} found
        </p>
      </div>

      {/* Results */}
      {pins.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <span className="text-5xl">🔍</span>
          <p className="text-gray-400 text-lg">No pins found for "{query}"</p>
          <p className="text-gray-300 text-sm">Try searching something else</p>
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

export default Search