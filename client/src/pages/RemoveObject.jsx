import { Scissors, Sparkles, Download } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import BeforeAfterSlider from '../components/BeforeAfterSlider'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const RemoveObject = () => {
  const [file, setFile]         = useState(null)
  const [preview, setPreview]   = useState('')
  const [object, setObject]     = useState('')
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState('')

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
    if (object.trim().split(' ').length > 1) return toast.error('Please provide only a single object name')
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('image', file)
      formData.append('object', object)
      const { data } = await axios.post('/api/ai/remove-image-object', formData, {
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

      <form onSubmit={onSubmitHandler} className='glass w-full max-w-lg p-5'>
        <div className='flex items-center gap-3 mb-5'>
          <Sparkles className='w-6 h-6' style={{ color: '#60A5FA' }} />
          <h1 className='text-xl font-semibold' style={{ color: '#E2E8F0' }}>Object Removal</h1>
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

        {preview && !result && (
          <img src={preview} alt='Preview' className='mt-4 w-full rounded-xl object-cover max-h-40' />
        )}

        <label className='block text-xs font-semibold mt-4 mb-1.5'
          style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Object to Remove
        </label>
        <textarea
          onChange={e => setObject(e.target.value)} value={object} rows={2} required
          className='w-full p-2.5 px-3 text-sm rounded-xl outline-none resize-none'
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#E2E8F0' }}
          placeholder='e.g., watch (single word only)'
        />

        <button disabled={loading}
          className='btn-glow w-full flex justify-center items-center gap-2 px-4 py-2.5 mt-6 text-sm cursor-pointer'>
          {loading ? <span className='spinner' /> : <Scissors className='w-4 h-4' />}
          Remove Object
        </button>
      </form>

      <div className='glass w-full max-w-lg p-5 flex flex-col min-h-96'>
        <div className='flex items-center justify-between gap-2 mb-3'>
          <div className='flex items-center gap-2'>
            <Scissors className='w-5 h-5' style={{ color: '#60A5FA' }} />
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
              <Scissors className='w-9 h-9' />
              <p>Upload an image and click "Remove Object" to get started</p>
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

export default RemoveObject