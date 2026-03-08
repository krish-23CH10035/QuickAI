import React from 'react'
import { AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { ArrowRight } from 'lucide-react'

const AiTools = () => {
  const navigate = useNavigate()
  const { user } = useUser()

  return (
    <section id='tools' className='px-4 sm:px-20 xl:px-32 py-24'
      style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(124,58,237,0.04) 50%, transparent 100%)' }}>

      {/* Section header */}
      <div className='text-center mb-14'>
        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5'
          style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: '#A78BFA' }}>
          ✦ 6 Powerful Tools
        </div>
        <h2 className='text-4xl sm:text-5xl font-bold' style={{ color: '#F1F5F9' }}>
          Everything You Need to <br className='hidden sm:block' />
          <span style={{
            background: 'linear-gradient(120deg,#A78BFA,#7C3AED)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>Create & Publish</span>
        </h2>
        <p className='mt-4 max-w-lg mx-auto text-base' style={{ color: 'rgba(255,255,255,0.4)' }}>
          One platform for all your AI content needs. No switching apps, no complexity.
        </p>
      </div>

      {/* Tool grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto'>
        {AiToolsData.map((tool, i) => (
          <div key={i}
            onClick={() => user ? navigate(tool.path) : null}
            className='group relative p-6 rounded-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1.5'
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 2px 20px rgba(0,0,0,0.2)',
            }}>

            {/* Hover glow */}
            <div className='absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'
              style={{ background: `linear-gradient(135deg, ${tool.bg.from}08, ${tool.bg.to}08)`, border: `1px solid ${tool.bg.from}30` }} />

            {/* Icon */}
            <div className='w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative z-10'
              style={{ background: `linear-gradient(135deg, ${tool.bg.from}, ${tool.bg.to})` }}>
              <tool.Icon className='w-5 h-5 text-white' />
            </div>

            <h3 className='text-base font-semibold mb-2 relative z-10' style={{ color: '#F1F5F9' }}>
              {tool.title}
            </h3>
            <p className='text-sm leading-relaxed mb-5 relative z-10' style={{ color: 'rgba(255,255,255,0.38)' }}>
              {tool.description}
            </p>

            {/* Arrow CTA */}
            <div className='flex items-center gap-1.5 text-xs font-medium relative z-10 group-hover:gap-2.5 transition-all'
              style={{ color: tool.bg.from }}>
              Try it now <ArrowRight className='w-3 h-3' />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AiTools