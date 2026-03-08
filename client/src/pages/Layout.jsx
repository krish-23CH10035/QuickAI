import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { X, Menu, Sparkles } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { SignIn, useUser } from '@clerk/clerk-react'

const Layout = () => {
  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)
  const { user } = useUser()

  return user ? (
    <div className='flex flex-col items-start justify-start h-screen' style={{ background: '#0D0D1A' }}>
      <nav className='w-full px-8 min-h-14 flex items-center justify-between'
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(13,13,26,0.85)', backdropFilter: 'blur(8px)' }}>
        <button onClick={() => navigate('/')} className='flex items-center gap-2 cursor-pointer'>
          <div className='w-7 h-7 rounded-lg flex items-center justify-center'
            style={{ background: 'linear-gradient(135deg,#7C3AED,#4F46E5)' }}>
            <Sparkles className='w-3.5 h-3.5 text-white' />
          </div>
          <span className='text-base font-bold hidden sm:block' style={{ color: '#E2E8F0' }}>
            NovaMind <span style={{ color: '#A78BFA' }}>AI</span>
          </span>
        </button>
        {sidebar
          ? <X onClick={() => setSidebar(false)} className='w-6 h-6 text-gray-400 sm:hidden' />
          : <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-gray-400 sm:hidden' />}
      </nav>
      <div className='flex-1 w-full flex h-[calc(100vh-56px)]'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className='flex-1 overflow-hidden' style={{ background: '#0D0D1A' }}>
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className='flex items-center justify-center h-screen' style={{ background: '#0D0D1A' }}>
      <SignIn />
    </div>
  )
}

export default Layout