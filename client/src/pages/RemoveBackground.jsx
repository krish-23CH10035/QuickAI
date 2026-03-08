import { Eraser, Sparkles, Download } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import BeforeAfterSlider from '../components/BeforeAfterSlider'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const RemoveBackground = () => {
  const [file, setFile]         = useState(null)
  const [preview, setPreview]   = useState('')   // original preview URL
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState('')   // processed URL

  const { getToken } = useAuth()

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResult('')
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!file) return
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('image', file)
      const { data } = await axios.post('/api/ai/remove-image-background', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setResult(data.content)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-full overflow-y-auto p-6 flex items-start flex-wrap gap-4'>

      {/* ── Left: Upload Panel ── */}
      <form onSubmit={onSubmitHandler} className='glass w-full max-w-lg p-5'>
        <div className='flex items-center gap-3 mb-5'>
          <Sparkles className='w-6 h-6' style={{ color: '#FB923C' }} />
          <h1 className='text-xl font-semibold' style={{ color: '#E2E8F0' }}>Background Removal</h1>
        </div>

        <label className='block text-xs font-semibold mb-1.5'
          style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Upload Image
        </label>
        <input
          onChange={handleFileChange} type='file' accept='image/*' required
          className='w-full p-2.5 px-3 text-sm rounded-xl outline-none cursor-pointer'
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
        />
        <p className='text-xs mt-1.5' style={{ color: 'rgba(255,255,255,0.3)' }}>Supports PNG, JPG and other image formats</p>

        {/* Thumbnail preview */}
        {preview && !result && (
          <img src={preview} alt='Preview' className='mt-4 w-full rounded-xl object-cover max-h-40' />
        )}

        <button disabled={loading}
          className='btn-glow w-full flex justify-center items-center gap-2 px-4 py-2.5 mt-6 text-sm cursor-pointer'
          style={{ background: 'linear-gradient(135deg,#EA580C,#DC2626)' }}>
          {loading ? <span className='spinner' /> : <Eraser className='w-4 h-4' />}
          Remove Background
        </button>
      </form>

      {/* ── Right: Output Panel ── */}
      <div className='glass w-full max-w-lg p-5 flex flex-col min-h-96'>
        <div className='flex items-center justify-between gap-2 mb-3'>
          <div className='flex items-center gap-2'>
            <Eraser className='w-5 h-5' style={{ color: '#FB923C' }} />
            <h1 className='text-xl font-semibold' style={{ color: '#E2E8F0' }}>
              {result ? 'Before / After' : 'Processed Image'}
            </h1>
          </div>
          {result && (
            <a href={result} target='_blank' rel='noopener noreferrer'
              className='flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg'
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34D399' }}>
              <Download className='w-3.5 h-3.5' /> Download
            </a>
          )}
        </div>

        {!result ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-4' style={{ color: 'rgba(255,255,255,0.2)' }}>
              <Eraser className='w-9 h-9' />
              <p>Upload an image and click "Remove Background" to get started</p>
            </div>
          </div>
        ) : (
          <div className='flex-1 flex flex-col gap-3'>
            <BeforeAfterSlider before={preview} after={result} />
            <p className='text-xs text-center' style={{ color: 'rgba(255,255,255,0.3)' }}>
              ← Drag the slider to compare original vs. processed →
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RemoveBackground