import React, { useState } from 'react'
import { Sparkles, Image, Download } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const imageStyles = [
  'Realistic', 'Cartoon', 'Anime', 'Ghibli',
  'Fantasy', '3D', 'Portrait', 'Watercolor',
]

const GenerateImages = () => {

  const [selectedStyle, setSelectedStyle] = useState('Realistic')
  const [input, setInput]     = useState('')
  const [publish, setPublish] = useState(false)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`
      const { data } = await axios.post('/api/ai/generate-image', { prompt, publish }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setContent(data.content)
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

      {/* ── Left: Config Panel ── */}
      <form onSubmit={onSubmitHandler} className='glass w-full max-w-lg p-5'>
        <div className='flex items-center gap-3 mb-5'>
          <Sparkles className='w-6 h-6' style={{ color: '#34D399' }} />
          <h1 className='text-xl font-semibold' style={{ color: '#E2E8F0' }}>AI Image Generator</h1>
        </div>

        <label className='block text-xs font-semibold mb-1.5'
          style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Describe Your Image
        </label>
        <textarea
          onChange={e => setInput(e.target.value)} value={input} rows={4} required
          className='w-full p-2.5 px-3 text-sm rounded-xl outline-none resize-none'
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#E2E8F0' }}
          placeholder='A futuristic city skyline at sunset...'
        />

        <label className='block text-xs font-semibold mt-4 mb-2'
          style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Style
        </label>
        <div className='flex flex-wrap gap-2 mb-4'>
          {imageStyles.map((s, i) => (
            <span key={i} onClick={() => setSelectedStyle(s)}
              className='px-3 py-1.5 text-sm rounded-full cursor-pointer transition-all'
              style={selectedStyle === s
                ? { background: 'rgba(52,211,153,0.2)', border: '1px solid rgba(52,211,153,0.55)', color: '#34D399' }
                : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
              {s}
            </span>
          ))}
        </div>

        {/* Public toggle */}
        <div className='flex items-center gap-3 my-4'>
          <label className='relative cursor-pointer'>
            <input type="checkbox" checked={publish} onChange={e => setPublish(e.target.checked)} className='sr-only peer' />
            <div className='w-9 h-5 rounded-full transition peer-checked:bg-[#34D399]'
              style={{ background: 'rgba(255,255,255,0.15)' }} />
            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4' />
          </label>
          <p className='text-sm' style={{ color: 'rgba(255,255,255,0.6)' }}>Make this image public</p>
        </div>

        <button disabled={loading}
          className='btn-glow w-full flex justify-center items-center gap-2 px-4 py-2.5 text-sm cursor-pointer'
          style={{ background: 'linear-gradient(135deg,#059669,#0891B2)' }}>
          {loading ? <span className='spinner' /> : <Image className='w-4 h-4' />}
          Generate Image
        </button>
      </form>

      {/* ── Right: Output Panel ── */}
      <div className='glass w-full max-w-lg p-5 flex flex-col min-h-96'>
        <div className='flex items-center gap-2 mb-3'>
          <Image className='w-5 h-5' style={{ color: '#34D399' }} />
          <h1 className='text-xl font-semibold' style={{ color: '#E2E8F0' }}>Generated Image</h1>
        </div>
        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-4' style={{ color: 'rgba(255,255,255,0.2)' }}>
              <Image className='w-9 h-9' />
              <p>Enter a description and click "Generate Image" to get started</p>
            </div>
          </div>
        ) : (
          <div className='flex-1 flex flex-col gap-3'>
            <img src={content} alt="Generated" className='w-full rounded-xl' />
            <a href={content} target='_blank' rel='noopener noreferrer'
              className='flex items-center justify-center gap-1.5 py-2 text-xs rounded-lg transition-all'
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34D399' }}>
              <Download className='w-3.5 h-3.5' /> Open / Download Image
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default GenerateImages