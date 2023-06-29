import React from 'react'
import { FaSearchengin } from 'react-icons/fa'


const sourcesLoader = () => {
  return (
    <div className='flex text-center m-auto'>
    
        <FaSearchengin className='text-sky-400' size={30}/> 
        <div className='mt-1 ml-2'>Loading Sources....</div>
        
    </div>
  )
}

export default sourcesLoader