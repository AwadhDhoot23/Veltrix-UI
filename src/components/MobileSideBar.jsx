import React, { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Sidebar from './Sidebar';
const MobileSideBar = () => {
    const [isOpen, setIsOpen]=useState(false);
  return (
    
        <div className='relative'>
            
            {!isOpen && (
                <div 
                    onClick={() => setIsOpen(true)} 
                    className='absolute top-7 left-3 z-30 cursor-pointer p-2'
                >
                    <div className='absolute -top-[0px] -left-[0px]'>
                    <MenuIcon/>
                    </div>
                </div>
            )}
            
            {/* Sidebar Overlay Container */}
            {isOpen && (
                <div className='fixed inset-0 z-40 h-[100dvh] w-full bg-black/50 overflow-y-auto'>
                    
                    <div 
                        onClick={() => setIsOpen(false)} 
                        className='absolute top-7 left-3 z-50 cursor-pointer p-2'
                    >
                        <CloseIcon className="text-white" />
                    </div>
                    
                    <Sidebar />
                </div>
            )}
        </div>
  )
}

export default MobileSideBar
