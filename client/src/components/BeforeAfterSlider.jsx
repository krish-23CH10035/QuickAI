import React, { useRef, useState, useCallback } from 'react'
import { Move } from 'lucide-react'

/**
 * BeforeAfterSlider — drag a divider to reveal processed vs original
 * Props:
 *   before: string (URL of original image)
 *   after:  string (URL of processed image)
 */
const BeforeAfterSlider = ({ before, after }) => {
  const [sliderPos, setSliderPos] = useState(50) // percent
  const containerRef = useRef(null)
  const dragging = useRef(false)

  const updatePosition = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const pos = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
    setSliderPos(pos)
  }, [])

  const onMouseMove = useCallback((e) => {
    if (!dragging.current) return
    updatePosition(e.clientX)
  }, [updatePosition])

  const onTouchMove = useCallback((e) => {
    if (!dragging.current) return
    updatePosition(e.touches[0].clientX)
  }, [updatePosition])

  const stopDrag = () => { dragging.current = false }

  return (
    <div
      ref={containerRef}
      className='relative w-full rounded-xl overflow-hidden select-none'
      style={{ aspectRatio: '4/3', cursor: 'ew-resize' }}
      onMouseMove={onMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onTouchMove={onTouchMove}
      onTouchEnd={stopDrag}
    >
      {/* After (processed) — full width base */}
      <img src={after} alt='Processed' className='absolute inset-0 w-full h-full object-cover' />

      {/* Before (original) — clipped to left of slider */}
      <div className='absolute inset-0 overflow-hidden' style={{ width: `${sliderPos}%` }}>
        <img src={before} alt='Original' className='absolute inset-0 w-full h-full object-cover'
          style={{ width: `${(100 / sliderPos) * 100}%`, maxWidth: 'none' }} />
      </div>

      {/* Labels */}
      <div className='absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold text-white'
        style={{ background: 'rgba(0,0,0,0.55)' }}>ORIGINAL</div>
      <div className='absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-bold text-white'
        style={{ background: 'rgba(0,0,0,0.55)' }}>PROCESSED</div>

      {/* Divider line */}
      <div className='absolute inset-y-0 w-0.5 pointer-events-none'
        style={{ left: `${sliderPos}%`, background: 'white', boxShadow: '0 0 8px rgba(0,0,0,0.5)' }} />

      {/* Handle */}
      <div
        className='absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow-xl cursor-ew-resize'
        style={{ left: `${sliderPos}%`, background: 'white', boxShadow: '0 0 0 3px rgba(124,58,237,0.5), 0 4px 16px rgba(0,0,0,0.4)' }}
        onMouseDown={(e) => { e.preventDefault(); dragging.current = true }}
        onTouchStart={(e) => { e.preventDefault(); dragging.current = true }}
      >
        <Move className='w-4 h-4' style={{ color: '#7C3AED' }} />
      </div>
    </div>
  )
}

export default BeforeAfterSlider
