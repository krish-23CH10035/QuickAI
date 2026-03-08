import { FileText, Sparkles, Copy, Check, Download } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import Markdown from 'react-markdown'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {

  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [copied, setCopied]   = useState(false)

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('resume', input)
      const { data } = await axios.post('/api/ai/resume-review', formData, {
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

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'resume-review.txt'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Downloaded resume-review.txt')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Copy failed')
    }
  }

  return (
    <div className='h-full overflow-y-auto p-6 flex items-start flex-wrap gap-4'>

      {/* ── Left: Upload Panel ── */}
      <form onSubmit={onSubmitHandler} className='glass w-full max-w-lg p-5'>
        <div className='flex items-center gap-3 mb-5'>
          <Sparkles className='w-6 h-6' style={{ color: '#2DD4BF' }} />
          <h1 className='text-xl font-semibold' style={{ color: '#E2E8F0' }}>Resume Review</h1>
        </div>

        <label className='block text-xs font-semibold mb-1.5'
          style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Upload Resume
        </label>
        <input
          onChange={e => setInput(e.target.files[0])} type="file" accept='application/pdf' required
          className='w-full p-2.5 px-3 text-sm rounded-xl outline-none cursor-pointer'
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
        />
        <p className='text-xs mt-1.5' style={{ color: 'rgba(255,255,255,0.3)' }}>Supports PDF only</p>

        <button disabled={loading}
          className='btn-glow w-full flex justify-center items-center gap-2 px-4 py-2.5 mt-6 text-sm cursor-pointer'
          style={{ background: 'linear-gradient(135deg,#0D9488,#0891B2)' }}>
          {loading ? <span className='spinner' /> : <FileText className='w-4 h-4' />}
          Review Resume
        </button>
      </form>

      {/* ── Right: Output Panel ── */}
      <div className='glass w-full max-w-lg p-5 flex flex-col min-h-96 max-h-[600px]'>
        <div className='flex items-center justify-between gap-3 mb-3'>
          <div className='flex items-center gap-2'>
            <FileText className='w-5 h-5' style={{ color: '#2DD4BF' }} />
            <h1 className='text-xl font-semibold' style={{ color: '#E2E8F0' }}>Processed Resume</h1>
          </div>
          {content && (
            <div className='flex gap-2'>
              <button onClick={handleCopy} title='Copy to clipboard'
                className='flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all'
                style={{ background: 'rgba(45,212,191,0.15)', border: '1px solid rgba(45,212,191,0.4)', color: '#2DD4BF' }}>
                {copied ? <Check className='w-3.5 h-3.5' /> : <Copy className='w-3.5 h-3.5' />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button onClick={handleDownload} title='Download as .txt'
                className='flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all'
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34D399' }}>
                <Download className='w-3.5 h-3.5' />
                Download
              </button>
            </div>
          )}
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-4' style={{ color: 'rgba(255,255,255,0.2)' }}>
              <FileText className='w-9 h-9' />
              <p>Upload a resume and click "Review Resume" to get started</p>
            </div>
          </div>
        ) : (
          <div className='flex-1 overflow-y-auto text-sm' style={{ color: '#CBD5E1' }}>
            <div className='reset-tw'>
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewResume