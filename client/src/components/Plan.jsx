import React from 'react'
import { PricingTable } from '@clerk/clerk-react'
import { Gem } from 'lucide-react'

const Plan = () => {
  return (
    <div id='pricing' className='px-4 sm:px-20 xl:px-32 py-24'>
      <div className='text-center mb-14'>
        <div className='flex justify-center mb-4'>
          <div className='flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium'
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#A78BFA' }}>
            <Gem className='w-3.5 h-3.5' /> Simple Pricing
          </div>
        </div>
        <h2 className='text-4xl font-bold' style={{ color: '#E2E8F0' }}>Choose Your Plan</h2>
        <p className='mt-3 max-w-lg mx-auto text-base'
          style={{ color: 'rgba(255,255,255,0.45)' }}>
          Start for free and upgrade as you grow. Find the perfect plan for your content creation needs.
        </p>
      </div>
      <div className='max-w-2xl mx-auto'>
        <PricingTable />
      </div>
    </div>
  )
}

export default Plan
