import React, { useState } from 'react'
import Markdown from 'react-markdown'
import { ChevronDown, ChevronUp } from 'lucide-react'

const TYPE_COLORS = {
  article:          '#3B82F6',
  'Blog-title':     '#9333EA',
  'blog-title':     '#9333EA',
  image:            '#10B981',
  'remove-bg':      '#F97316',
  'remove-obj':     '#EF4444',
  'resume-review':  '#14B8A6',
}

const Creationitem = ({ item }) => {

  const [expanded, setExpanded] = useState(false)
  const accent = TYPE_COLORS[item.type] || '#A78BFA'

  return (
    <div className='glass max-w-5xl cursor-pointer transition-all duration-200'
      style={{ boxShadow: expanded ? `0 4px 24px ${accent}22` : 'none' }}
      onClick={() => setExpanded(!expanded)}>

      <div className='flex justify-between items-center gap-4 p-4'>
        <div className='flex-1 min-w-0'>
          <h2 className='text-sm font-medium truncate' style={{ color: '#E2E8F0' }}>{item.prompt}</h2>
          <p className='text-xs mt-0.5' style={{ color: 'rgba(255,255,255,0.35)' }}>
            {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className='flex items-center gap-2 shrink-0'>
          <span className='text-xs px-3 py-1 rounded-full font-medium'
            style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}>
            {item.type}
          </span>
          {expanded
            ? <ChevronUp className='w-4 h-4' style={{ color: 'rgba(255,255,255,0.4)' }} />
            : <ChevronDown className='w-4 h-4' style={{ color: 'rgba(255,255,255,0.4)' }} />}
        </div>
      </div>

      {expanded && (
        <div className='px-4 pb-4' style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          onClick={e => e.stopPropagation()}>
          {item.type === 'image' || item.type === 'remove-bg' || item.type === 'remove-obj' ? (
            <img src={item.content} alt="result" className='mt-3 w-full max-w-md rounded-xl' />
          ) : (
            <div className='mt-3 max-h-72 overflow-y-auto text-sm' style={{ color: '#CBD5E1' }}>
              <div className='reset-tw'>
                <Markdown>{item.content}</Markdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Creationitem
