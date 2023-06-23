import React from 'react'
import { GiBrain } from 'react-icons/gi'


const thinkingLoader = () => {
  return (
    <div className='flex text-center m-auto'>
    
        <GiBrain className='text-sky-400' size={30}/> 
        <div className='mt-1 ml-2'>Thinking....</div>
        
    </div>
  )
}

export default thinkingLoader


