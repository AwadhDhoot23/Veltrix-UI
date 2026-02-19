import React from 'react'
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
function Footer() {
  
  return (
    <div 
    style={{
    backgroundImage:
      "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
    backgroundSize: "74px 74px",
  }}
    className='relative h-44 w-full '>
        <div className='w-full h-px bg-white '></div>
        <div className='flex items-center justify-between'>
        <div>
        <div className=' pt-5 pl-5 pb-2  text-3xl font-bold tracking-tight'>Veltrix-UI</div>
        <p className='pl-5 text-lg text-neutral-500'>A curated library of reusable React UI components.</p>
        </div>
        <div>
        <a href='https://github.com/AwadhDhoot23' target='_blank'className='pr-5 py-5 flex gap-2'>
            <GitHubIcon/>Github
        </a>
        <a href='https://www.instagram.com/awadh.d23' target='_blank'className='pr-5  flex gap-2'>
            <InstagramIcon/>Instagram
        </a>
        </div>
        </div>
        <div className='flex justify-center items-center mt-10 font-bold text-neutral-600'>© 2026 Awadh. Built with React, Tailwind, Framer and GSAP.</div>
    </div>
  )
}

export default Footer
