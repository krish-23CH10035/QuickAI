import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Heart } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {

  const [creations, setCreations] = useState([])
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get('/api/user/get-published-creations', {
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

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post('/api/user/toggle-like-creation', { id }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        toast.success(data.message)
        await fetchCreations()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) fetchCreations()
  }, [user])

  return !loading ? (
    <div className='flex-1 h-full flex flex-col gap-4 p-6 overflow-y-auto'>
      <p className='text-xs font-semibold'
        style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Community Creations
      </p>
      <div className='glass h-full w-full rounded-xl overflow-y-auto p-2'>
        {creations.length === 0 ? (
          <div className='flex justify-center items-center h-full'>
            <p className='text-sm' style={{ color: 'rgba(255,255,255,0.2)' }}>No public creations yet</p>
          </div>
        ) : (
          <div className='columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3'>
            {creations.map((creation, index) => (
              <div key={index} className='relative group break-inside-avoid rounded-xl overflow-hidden'>
                <img src={creation.content} alt="" className='w-full object-cover rounded-xl' />
                <div className='absolute inset-0 flex items-end justify-between p-3
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  bg-gradient-to-b from-transparent to-black/75 rounded-xl'>
                  <p className='text-xs text-white max-w-[70%] line-clamp-2'>{creation.prompt}</p>
                  <div className='flex gap-1 items-center'>
                    <p className='text-xs text-white'>{creation.likes?.length ?? 0}</p>
                    <Heart
                      onClick={() => imageLikeToggle(creation.id ?? creation._id)}
                      className={`min-w-5 h-5 cursor-pointer hover:scale-110 transition-transform
                        ${creation.likes?.includes(user?.id) ? 'fill-red-500 text-red-500' : 'text-white'}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className='flex justify-center items-center h-full'>
      <span className='spinner' style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }} />
    </div>
  )
}

export default Community