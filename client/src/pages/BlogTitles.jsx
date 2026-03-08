import { Hash, Sparkles, Copy, Check } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Markdown from 'react-markdown'
import { useAuth } from '@clerk/clerk-react'

const BASE = import.meta.env.VITE_BASE_URL

const BlogTitles = () => {
  const blogcategories = [
    'General', 'Technology', 'Health', 'Business',
    'Travel', 'Lifestyle', 'Education', 'Food',
  ]

  const [selectedCategory, setSelectedCategory] = useState('General')
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [content, setContent]   = useState('')
  const [copied, setCopied]     = useState(false)
  const [streaming, setStreaming] = useState(false)
  const { getToken } = useAuth()

  /* ── SSE Streaming ── */
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    setContent('')
    setLoading(true)
    setStreaming(true)

    try {
      const token = await getToken()
      const prompt = `Generate a list of 10 catchy, SEO-optimised blog title ideas for the keyword "${input}" in the ${selectedCategory} category. Format as a numbered list.`

      const response = await fetch(`${BASE}/api/ai/stream-blog-title`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) throw new Error('Streaming failed')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const raw = decoder.decode(value, { stream: true })
        for (const line of raw.split('\n')) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6)
          if (payload === '[DONE]') break
          try {
            const parsed = JSON.parse(payload)
            if (parsed.error) { toast.error(parsed.error); break }
            if (parsed.token) {
              accumulated += parsed.token
              setContent(accumulated)
            }
          } catch { /* partial */ }
        }
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
      setStreaming(false)
    }
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

      {/* ── Left: Config Panel ── */}
      <form onSubmit={onSubmitHandler} className='glass w-full max-w-lg p-5'>
        <div className='flex items-center gap-3 mb-5'>
          <Sparkles className='w-6 h-6' style={{ color: '#C084FC' }} />
          <h1 className='text-xl font-semibold' style={{ color: '#E2E8F0' }}>AI Title Generator</h1>
          {streaming && (
            <span className='ml-auto text-xs px-2 py-0.5 rounded-full animate-pulse'
              style={{ background: 'rgba(192,132,252,0.15)', color: '#C084FC', border: '1px solid rgba(192,132,252,0.4)' }}>
              ● LIVE
            </span>
          )}
        </div>

        <label className='block text-xs font-semibold mb-1.5'
          style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Keyword
        </label>
        <input
          onChange={e => setInput(e.target.value)} value={input} type='text' required
          className='w-full p-2.5 px-3 text-sm rounded-xl outline-none'
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#E2E8F0' }}
          placeholder='Enter a topic or keyword…'
        />

        <label className='block text-xs font-semibold mt-4 mb-2'
          style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Category
        </label>
        <div className='flex flex-wrap gap-2'>
          {blogcategories.map((item, i) => (
            <span key={i} onClick={() => setSelectedCategory(item)}
              className='px-4 py-2 text-sm rounded-full cursor-pointer transition-all'
              style={selectedCategory === item
                ? { background: 'rgba(192,132,252,0.2)', border: '1px solid rgba(192,132,252,0.55)', color: '#C084FC' }
                : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
              {item}
            </span>
          ))}
        </div>

        <button disabled={loading}
          className='btn-glow w-full flex justify-center items-center gap-2 px-4 py-2.5 mt-6 text-sm cursor-pointer disabled:opacity-60'
          style={{ background: 'linear-gradient(135deg,#9333EA,#7C3AED)' }}>
          {loading ? <span className='spinner' /> : <Hash className='w-4 h-4' />}
          {streaming ? 'Generating…' : 'Generate Titles'}
        </button>
      </form>

      {/* ── Right: Output Panel ── */}
      <div className='glass w-full max-w-lg p-5 flex flex-col min-h-96'>
        <div className='flex items-center justify-between gap-3 mb-3'>
          <div className='flex items-center gap-2'>
            <Hash className='w-5 h-5' style={{ color: '#C084FC' }} />
            <h1 className='text-xl font-semibold' style={{ color: '#E2E8F0' }}>Generated Titles</h1>
          </div>
          {content && (
            <button onClick={handleCopy}
              className='flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg'
              style={{ background: 'rgba(192,132,252,0.15)', border: '1px solid rgba(192,132,252,0.4)', color: '#C084FC' }}>
              {copied ? <Check className='w-3.5 h-3.5' /> : <Copy className='w-3.5 h-3.5' />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-4' style={{ color: 'rgba(255,255,255,0.2)' }}>
              <Hash className='w-9 h-9' />
              <p>Enter a keyword and click "Generate Titles" to get started</p>
              <p className='text-xs' style={{ color: 'rgba(192,132,252,0.5)' }}>⚡ Real-time streaming</p>
            </div>
          </div>
        ) : (
          <div className='flex-1 overflow-y-auto text-sm' style={{ color: '#CBD5E1' }}>
            <div className='reset-tw'>
              <Markdown>{content}</Markdown>
            </div>
            {streaming && <span className='inline-block w-1.5 h-4 bg-purple-400 animate-pulse ml-0.5 align-middle' />}
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogTitles
