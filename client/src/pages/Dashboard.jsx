import React, { useEffect, useState } from 'react'
import { Gem, Sparkles, Image, FileText, Hash, Scissors } from 'lucide-react'
import { Protect } from '@clerk/clerk-react'
import Creationitem from '../components/Creationitem.jsx'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '@clerk/clerk-react'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const TYPE_META = {
  article:          { label: 'Articles',        icon: FileText, color: '#3B82F6', bg: 'rgba(59,130,246,0.15)'  },
  'Blog-title':     { label: 'Blog Titles',      icon: Hash,     color: '#9333EA', bg: 'rgba(147,51,234,0.15)' },
  'blog-title':     { label: 'Blog Titles',      icon: Hash,     color: '#9333EA', bg: 'rgba(147,51,234,0.15)' },
  image:            { label: 'Images',           icon: Image,    color: '#10B981', bg: 'rgba(16,185,129,0.15)'  },
  'remove-bg':      { label: 'BG Removed',       icon: Scissors, color: '#F97316', bg: 'rgba(249,115,22,0.15)'  },
  'remove-obj':     { label: 'Objects Removed',  icon: Scissors, color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
  'resume-review':  { label: 'Resume Reviews',   icon: FileText, color: '#14B8A6', bg: 'rgba(20,184,166,0.15)'  },
}

const Dashboard = () => {
  const [creations, setCreations] = useState([])
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/user/get-user-creations', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setCreations(data.creations)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  useEffect(() => { getDashboardData() }, [])

  // Compute per-type counts from the user's creations
  const typeCounts = creations.reduce((acc, c) => {
    acc[c.type] = (acc[c.type] || 0) + 1
    return acc
  }, {})

  const activeTypes = Object.entries(typeCounts).filter(([, v]) => v > 0)

  return (
    <div className='h-full overflow-y-auto p-6' style={{color:'#E2E8F0'}}>

      {/* Top stat cards */}
      <div className='flex justify-start gap-4 flex-wrap mb-6'>

        {/* Total Creations */}
        <div className='glass flex justify-between items-center w-72 p-5 px-6'
          style={{boxShadow:'0 4px 24px rgba(124,58,237,0.08)'}}>
          <div>
            <p className='text-xs font-medium mb-1' style={{color:'rgba(255,255,255,0.45)'}}>Total Creations</p>
            <h2 className='text-2xl font-bold'>{creations.length}</h2>
          </div>
          <div className='w-11 h-11 rounded-xl flex justify-center items-center'
            style={{ background:'linear-gradient(135deg,#3B82F6,#0EA5E9)', boxShadow:'0 0 16px rgba(59,130,246,0.45)' }}>
            <Sparkles className='w-5 h-5 text-white' />
          </div>
        </div>

        {/* Active Plan */}
        <div className='glass flex justify-between items-center w-72 p-5 px-6'
          style={{boxShadow:'0 4px 24px rgba(124,58,237,0.08)'}}>
          <div>
            <p className='text-xs font-medium mb-1' style={{color:'rgba(255,255,255,0.45)'}}>Active Plan</p>
            <h2 className='text-2xl font-bold'>
              <Protect plan='premium' fallback='Free'>Premium</Protect>
            </h2>
          </div>
          <div className='w-11 h-11 rounded-xl flex justify-center items-center'
            style={{ background:'linear-gradient(135deg,#7C3AED,#4F46E5)', boxShadow:'0 0 16px rgba(124,58,237,0.45)' }}>
            <Gem className='w-5 h-5 text-white' />
          </div>
        </div>
      </div>

      {/* Per-type breakdown */}
      {activeTypes.length > 0 && (
        <div className='mb-6'>
          <p className='text-xs font-semibold mb-3'
            style={{color:'rgba(255,255,255,0.35)', letterSpacing:'0.08em', textTransform:'uppercase'}}>
            Breakdown by Type
          </p>
          <div className='flex flex-wrap gap-3'>
            {activeTypes.map(([type, count]) => {
              const meta = TYPE_META[type] || { label: type, icon: Sparkles, color: '#A78BFA', bg: 'rgba(167,139,250,0.12)' }
              const Icon = meta.icon
              return (
                <div key={type} className='flex items-center gap-2.5 px-4 py-2.5 rounded-xl'
                  style={{ background: meta.bg, border: `1px solid ${meta.color}33` }}>
                  <Icon className='w-4 h-4' style={{ color: meta.color }} />
                  <span className='text-sm font-medium' style={{ color: '#E2E8F0' }}>{meta.label}</span>
                  <span className='text-xs font-bold px-1.5 py-0.5 rounded-md'
                    style={{ background: `${meta.color}22`, color: meta.color }}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Creations list */}
      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='w-11 h-11 rounded-full border-2 border-t-transparent animate-spin'
            style={{borderColor:'#7C3AED', borderTopColor:'transparent'}} />
        </div>
      ) : (
        <div className='space-y-3'>
          <p className='text-sm font-semibold mb-3'
            style={{color:'rgba(255,255,255,0.45)', letterSpacing:'0.08em', textTransform:'uppercase'}}>
            Recent Creations
          </p>
          {creations.length === 0 ? (
            <p className='text-sm text-center py-12' style={{color:'rgba(255,255,255,0.2)'}}>
              No creations yet — go make something! 🚀
            </p>
          ) : (
            creations.map(item => <Creationitem key={item.id} item={item} />)
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard