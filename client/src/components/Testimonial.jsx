import React from 'react'
import { Star, Quote } from 'lucide-react'

const reviews = [
  {
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
    name: 'Arjun Sharma',
    title: 'Marketing Lead, TechCorp',
    content: 'NovaMind AI has revolutionized our content workflow. The article quality is outstanding, and it saves us hours every week.',
    rating: 5,
  },
  {
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    name: 'Priya Mehta',
    title: 'Freelance Designer, StartupLab',
    content: 'The background removal is flawless — what used to take me 20 minutes in Photoshop takes 2 seconds here. Mind-blowing.',
    rating: 5,
  },
  {
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop',
    name: 'Dev Kumar',
    title: 'Software Engineer, MediaHouse',
    content: 'The resume reviewer gave me super actionable feedback. Rewrote my resume based on the AI suggestions and landed 3 interviews.',
    rating: 5,
  },
]

const Testimonial = () => (
  <section className='px-4 sm:px-20 xl:px-32 py-24'>
    {/* Header */}
    <div className='text-center mb-14'>
      <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5'
        style={{ background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.25)', color: '#FCD34D' }}>
        ★ Loved by thousands
      </div>
      <h2 className='text-4xl sm:text-5xl font-bold' style={{ color: '#F1F5F9' }}>
        Real People, Real Results
      </h2>
      <p className='mt-4 max-w-md mx-auto text-base' style={{ color: 'rgba(255,255,255,0.4)' }}>
        Join thousands of creators who use NovaMind AI every day.
      </p>
    </div>

    {/* Cards */}
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto'>
      {reviews.map((r, i) => (
        <div key={i}
          className='relative p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col'
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>

          {/* Quote icon */}
          <Quote className='w-6 h-6 mb-4 opacity-30' style={{ color: '#A78BFA' }} />

          {/* Stars */}
          <div className='flex gap-1 mb-4'>
            {[...Array(r.rating)].map((_, j) => (
              <Star key={j} className='w-4 h-4 fill-yellow-400 text-yellow-400' />
            ))}
          </div>

          <p className='text-sm leading-relaxed flex-1 mb-6' style={{ color: 'rgba(255,255,255,0.6)' }}>
            "{r.content}"
          </p>

          <div className='flex items-center gap-3 pt-5'
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <img src={r.image} alt={r.name}
              className='w-10 h-10 rounded-full object-cover ring-2'
              style={{ ringColor: 'rgba(124,58,237,0.4)' }} />
            <div>
              <p className='text-sm font-semibold' style={{ color: '#F1F5F9' }}>{r.name}</p>
              <p className='text-xs' style={{ color: 'rgba(255,255,255,0.3)' }}>{r.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
)

export default Testimonial