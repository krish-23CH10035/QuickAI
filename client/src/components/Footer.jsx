import React, { useState } from 'react'
import { Sparkles, Mail, Twitter, Github, Linkedin, ArrowRight, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const LINKS = {
  Company: ['Home', 'About us', 'Contact us', 'Privacy Policy'],
  Product:  ['Write Article', 'Blog Titles', 'Generate Images', 'Remove Background', 'Remove Object', 'Resume Review'],
}

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }
    setSubscribed(true)
    setEmail('')
    toast.success('🎉 You\'re subscribed! Welcome to NovaMind AI.')
    setTimeout(() => setSubscribed(false), 5000)
  }

  return (
    <footer className='mt-24 px-6 sm:px-20 xl:px-32 pt-14 pb-6'
      style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.25)' }}>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-10 pb-10'
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

        {/* Brand col */}
        <div className='md:col-span-1'>
          <div className='flex items-center gap-2.5 mb-4'>
            <div className='w-8 h-8 rounded-lg flex items-center justify-center'
              style={{ background: 'linear-gradient(135deg,#7C3AED,#4F46E5)' }}>
              <Sparkles className='w-4 h-4 text-white' />
            </div>
            <span className='text-base font-bold' style={{ color: '#E2E8F0' }}>
              NovaMind <span style={{ color: '#A78BFA' }}>AI</span>
            </span>
          </div>
          <p className='text-sm leading-relaxed mb-5' style={{ color: 'rgba(255,255,255,0.4)' }}>
            Transform your content creation with our suite of premium AI tools. Write, generate, and optimise — all in one place.
          </p>
          {/* Social icons */}
          <div className='flex gap-3'>
            {[Twitter, Github, Linkedin].map((Icon, i) => (
              <button key={i}
                className='w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110'
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Icon className='w-3.5 h-3.5' style={{ color: 'rgba(255,255,255,0.5)' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Links cols */}
        {Object.entries(LINKS).map(([title, items]) => (
          <div key={title}>
            <h3 className='text-xs font-semibold mb-4 uppercase tracking-widest'
              style={{ color: 'rgba(255,255,255,0.35)' }}>{title}</h3>
            <ul className='space-y-2.5'>
              {items.map(item => (
                <li key={item}>
                  <a href='#'
                    className='text-sm transition-colors hover:text-[#A78BFA]'
                    style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter col */}
        <div>
          <h3 className='text-xs font-semibold mb-4 uppercase tracking-widest'
            style={{ color: 'rgba(255,255,255,0.35)' }}>Newsletter</h3>
          <p className='text-sm mb-4' style={{ color: 'rgba(255,255,255,0.4)' }}>
            The latest AI news and updates sent to your inbox weekly.
          </p>
          <form onSubmit={handleSubscribe} className='flex flex-col gap-2'>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4'
                style={{ color: 'rgba(255,255,255,0.3)' }} />
              <input
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='Enter your email'
                className='w-full pl-9 pr-3 py-2.5 text-sm rounded-xl outline-none'
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#E2E8F0',
                }}
              />
            </div>
            <button type='submit'
              className='btn-glow w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium cursor-pointer'>
              {subscribed
                ? <><CheckCircle className='w-4 h-4' /> Subscribed!</>
                : <><ArrowRight className='w-4 h-4' /> Subscribe</>}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className='flex flex-col sm:flex-row justify-between items-center gap-2 pt-5'>
        <p className='text-xs' style={{ color: 'rgba(255,255,255,0.25)' }}>
          © 2025 NovaMind AI · All rights reserved.
        </p>
        <p className='text-xs' style={{ color: 'rgba(255,255,255,0.2)' }}>
          Built with ❤️ by Krish Sahu
        </p>
      </div>
    </footer>
  )
}

export default Footer
