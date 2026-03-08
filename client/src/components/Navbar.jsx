import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'

const Navbar = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const { openSignIn } = useClerk()

  return (
    <nav className='fixed z-50 w-full flex justify-between items-center py-3.5 px-6 sm:px-20 xl:px-32'
      style={{
        background: 'rgba(13,13,26,0.75)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>

      {/* Logo / Brand */}
      <button onClick={() => navigate('/')}
        className='flex items-center gap-2.5 cursor-pointer group'>
        <div className='w-8 h-8 rounded-lg flex items-center justify-center'
          style={{ background: 'linear-gradient(135deg,#7C3AED,#4F46E5)' }}>
          <Sparkles className='w-4 h-4 text-white' />
        </div>
        <span className='text-lg font-bold tracking-tight' style={{ color: '#E2E8F0' }}>
          NovaMind <span style={{ color: '#A78BFA' }}>AI</span>
        </span>
      </button>

      {/* CTA */}
      {user
        ? <UserButton />
        : (
          <button onClick={openSignIn}
            className='btn-glow flex items-center gap-2 px-5 py-2 text-sm font-medium cursor-pointer'>
            Get Started <ArrowRight className='w-4 h-4' />
          </button>
        )}
    </nav>
  )
}

export default Navbar