import { useUser, useClerk, Protect } from '@clerk/clerk-react'
import { Hash, House, SquarePen, Image, Eraser, Scissors, FileText, Users, LogOut, Sparkles } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/ai',                   label: 'Dashboard',         Icon: House     },
  { to: '/ai/write-article',     label: 'Write Article',     Icon: SquarePen },
  { to: '/ai/blog-titles',       label: 'Blog Titles',       Icon: Hash      },
  { to: '/ai/generate-images',   label: 'Generate Images',   Icon: Image     },
  { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser    },
  { to: '/ai/remove-object',     label: 'Remove Object',     Icon: Scissors  },
  { to: '/ai/review-resume',     label: 'Review Resume',     Icon: FileText  },
  { to: '/ai/community',         label: 'Community',         Icon: Users     },
]

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser()
  const { signOut, openUserProfile } = useClerk()

  return (
    <div className={`w-60 flex flex-col justify-between items-center max-sm:absolute top-14
      bottom-0 ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out`}
      style={{ background: 'rgba(255,255,255,0.03)', borderRight: '1px solid rgba(255,255,255,0.07)' }}>

      <div className='my-5 w-full'>
        {/* Brand tag */}
        <div className='flex items-center gap-2 px-5 mb-5'>
          <div className='w-7 h-7 rounded-lg flex items-center justify-center'
            style={{ background: 'linear-gradient(135deg,#7C3AED,#4F46E5)' }}>
            <Sparkles className='w-3.5 h-3.5 text-white' />
          </div>
          <span className='text-sm font-bold' style={{ color: '#E2E8F0' }}>
            NovaMind <span style={{ color: '#A78BFA' }}>AI</span>
          </span>
        </div>
        {/* Avatar with glow ring */}
        <div className='mx-auto w-fit p-0.5 rounded-full'
          style={{ background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', boxShadow: '0 0 18px rgba(124,58,237,0.45)' }}>
          <img src={user.imageUrl} alt="avatar"
            className='w-12 h-12 rounded-full block' style={{ border: '2px solid #0D0D1A' }} />
        </div>
        <h1 className='mt-2 text-center text-sm font-semibold' style={{ color: '#E2E8F0' }}>{user.fullName}</h1>

        <div className='px-4 mt-5 text-sm flex flex-col gap-1'>
          {navItems.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} end={to === '/ai'} onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 flex items-center gap-3 rounded-xl transition-all duration-200
                 ${isActive
                   ? 'text-white'
                   : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`
              }
              style={({ isActive }) => isActive
                ? { background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', boxShadow: '0 2px 14px rgba(124,58,237,0.35)' }
                : {}}>
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className='w-full p-4 px-5 flex items-center justify-between'
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div onClick={openUserProfile} className='flex gap-2 items-center cursor-pointer'>
          <img src={user.imageUrl} alt="avatar" className='w-8 rounded-full' />
          <div>
            <h1 className='text-sm font-medium' style={{ color: '#E2E8F0' }}>{user.fullName}</h1>
            <p className='text-xs' style={{ color: 'rgba(255,255,255,0.4)' }}>
              <Protect plan='premium' fallback='Free'>Premium</Protect> Plan
            </p>
          </div>
        </div>
        <LogOut onClick={signOut} className='w-4.5 cursor-pointer transition'
          style={{ color: 'rgba(255,255,255,0.35)' }}
          onMouseEnter={e => e.currentTarget.style.color = '#E2E8F0'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'} />
      </div>
    </div>
  )
}

export default Sidebar
