import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { ArrowRight, Sparkles, Zap, FileText, ImageIcon, Scissors, Star } from 'lucide-react'
import axios from 'axios'

/* ── Counter hook ────────────────────────────────────────────────── */
function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    if (!target || started.current) return
    started.current = true
    let current = 0
    const totalFrames = Math.round(duration / 16)
    const increment = target / totalFrames
    const timer = setInterval(() => {
      current += increment
      if (current >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return count
}

const StatCard = ({ value, label, suffix = '' }) => {
  const count = useCountUp(value)
  return (
    <div className='flex flex-col items-center gap-1.5 px-8 py-5 rounded-2xl'
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <span className='text-3xl sm:text-4xl font-extrabold tabular-nums'
        style={{ background: 'linear-gradient(135deg,#A78BFA,#7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {count.toLocaleString()}{suffix}
      </span>
      <span className='text-xs sm:text-sm font-medium' style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
    </div>
  )
}

/* ── Tool pill ───────────────────────────────────────────────────── */
const Pill = ({ icon: Icon, label, color }) => (
  <div className='flex items-center gap-2 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap'
    style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}>
    <Icon className='w-3.5 h-3.5' />{label}
  </div>
)

/* ── Review star card ────────────────────────────────────────────── */
const ReviewCard = ({ name, text }) => (
  <div className='rounded-xl p-4 text-left min-w-[200px] max-w-[220px]'
    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
    <div className='flex gap-0.5 mb-2'>{[...Array(5)].map((_, i) => <Star key={i} className='w-3 h-3 fill-yellow-400 text-yellow-400' />)}</div>
    <p className='text-xs leading-relaxed mb-2' style={{ color: 'rgba(255,255,255,0.6)' }}>"{text}"</p>
    <p className='text-xs font-semibold' style={{ color: '#A78BFA' }}>{name}</p>
  </div>
)

/* ── Hero ─────────────────────────────────────────────────────────── */
const Hero = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ articles: 0, images: 0, users: 0 })

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/api/stats`)
      .then(r => { if (r.data.success) setStats(r.data) })
      .catch(() => {/* keep zeros */})
  }, [])

  return (
    <section className='relative w-full overflow-hidden min-h-screen flex flex-col items-center justify-center px-4 sm:px-12 pt-28 pb-16'
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.28) 0%, transparent 70%), #0D0D1A' }}>

      {/* Glow blobs */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none'
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 65%)', filter: 'blur(60px)' }} />

      {/* Top badge */}
      <div className='flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 z-10'
        style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)', color: '#A78BFA' }}>
        <Sparkles className='w-3.5 h-3.5' /> Powered by Groq · Llama 3.3 70B
      </div>

      {/* Headline */}
      <h1 className='text-center text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] z-10 max-w-4xl'>
        <span style={{ color: '#F1F5F9' }}>The AI Suite That</span><br />
        <span style={{
          background: 'linear-gradient(120deg, #C4B5FD 0%, #7C3AED 45%, #4F46E5 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Creates Everything.</span>
      </h1>

      <p className='mt-5 text-center max-w-xl text-base sm:text-lg z-10'
        style={{ color: 'rgba(255,255,255,0.45)' }}>
        Write articles, generate images, remove backgrounds, and review resumes — all in one place, powered by state-of-the-art AI.
      </p>

      {/* CTA row */}
      <div className='flex flex-wrap justify-center gap-3 mt-8 z-10'>
        <button onClick={() => navigate('/ai')}
          className='btn-glow flex items-center gap-2 px-7 py-3.5 text-sm font-semibold cursor-pointer'>
          Start Creating Free <ArrowRight className='w-4 h-4' />
        </button>
        <button
          onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
          className='flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl cursor-pointer transition hover:bg-white/10'
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#E2E8F0' }}>
          See All Tools
        </button>
      </div>

      {/* Tool pills */}
      <div className='flex flex-wrap justify-center gap-2 mt-7 z-10'>
        <Pill icon={FileText}  label='AI Articles'         color='#818CF8' />
        <Pill icon={Zap}       label='Blog Titles'         color='#A78BFA' />
        <Pill icon={ImageIcon} label='Image Generation'    color='#34D399' />
        <Pill icon={Scissors}  label='Background Removal'  color='#FB923C' />
      </div>

      {/* Trust row */}
      <div className='flex items-center gap-3 mt-8 z-10'>
        <img src={assets.user_group} alt="users" className='h-9 rounded-full' />
        <div>
          <div className='flex gap-0.5 mb-0.5'>{[...Array(5)].map((_, i) => <Star key={i} className='w-3 h-3 fill-yellow-400 text-yellow-400' />)}</div>
          <p className='text-xs' style={{ color: 'rgba(255,255,255,0.4)' }}>Loved by <strong style={{ color: '#A78BFA' }}>creators worldwide</strong></p>
        </div>
      </div>

      {/* ── REAL Live stats from DB ── */}
      <div className='grid grid-cols-3 gap-3 sm:gap-6 mt-12 z-10 w-full max-w-xl'>
        <StatCard value={stats.articles} label='Articles & Titles' suffix='+' />
        <StatCard value={stats.images}   label='Images Generated'  suffix='+' />
        <StatCard value={stats.users}    label='Active Users'       suffix='+' />
      </div>

      {/* Floating review cards */}
      <div className='hidden md:flex gap-4 mt-10 z-10 flex-wrap justify-center'>
        <ReviewCard name='Arjun S.' text='Generated a 1000-word article in under 10 seconds. Incredible!' />
        <ReviewCard name='Priya M.' text='The background removal is flawless. Saves me hours of Photoshop.' />
        <ReviewCard name='Dev K.'   text='Resume review gave me super actionable feedback. Got the job!' />
      </div>
    </section>
  )
}

export default Hero