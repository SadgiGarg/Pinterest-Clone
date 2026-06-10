import React from 'react'

const SkeletonCard = ({ height }) => (
  <div className="break-inside-avoid mb-4 rounded-[20px] overflow-hidden" style={{ height }}>
    <div
      className="w-full h-full rounded-[20px]"
      style={{
        background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
      }}
    />
  </div>
)

export const Loading = () => {
  const heights = [280, 380, 220, 320, 420, 260, 300, 350, 240, 390, 270, 310]
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#fbf9f9" }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
        {heights.map((height, i) => (
          <SkeletonCard key={i} height={height} />
        ))}
      </div>
    </div>
  )
}

export const LoadingAnimation = () => (
  <div className="inline-block w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
)

export default Loading
