import React from 'react'
import {HiOutlineLightBulb} from 'react-icons/hi'
import {GiBrain} from 'react-icons/gi'
import {BsFillExclamationTriangleFill} from 'react-icons/bs'


const examples =[
    "How much revenue did Reliance generate in 2020?",
    "How much revenue did Reliance generate in 2020?",
    "How much revenue did Reliance generate in 2020?"
]

const capabilities =[
    `Capability 1 Lorem Ipsum dolar sit amet`,
    `Capability 2 Lorem Ipsum dolar sit amet`,
    `Capability 3 Lorem Ipsum dolar sit amet`
]

const limitations =[
    `Limitation 1 Lorem Ipsum dolar sit amet`,
    `Limitation 2 Lorem Ipsum dolar sit amet`,
    `Limitation 3 Lorem Ipsum dolar sit amet`
]


interface Props {
    setInputValue: (input:string)=>void,
    getResponse: (question:string)=>void
}

const greeting: React.FC<Props> = (props) => {
    const { setInputValue, getResponse } = props;

    const handleClick = (index:number)=>{
        console.log(examples[index])
        setInputValue(examples[index])
        getResponse(examples[index])
    }
  return (
   
    <div className="flex flex-wrap md:flex-nowrap w-full bg-transparent text-center h-full">

        <div className='w-full m-1'>
            <div className='flex text-sky-400'>
                <HiOutlineLightBulb className='m-auto' size={30}/>
            </div>
            <div className='mt-2'>
                Examples
            </div>
            {examples.map((example, index)=>(
            <div onClick={()=>handleClick(index)} key={index} className='mt-3 bg-[#0f172a] p-3 cursor-pointer rounded hover:bg-sky-900 bg-sky-600/10'>
                {`"${example}" -->`}
            </div>
            ))}
        </div>
        <div className='w-full m-1'>
            <div className='flex text-sky-400'>
                <GiBrain className='m-auto' size={30}/>
            </div>
            <div className='mt-2'>
                Capabilities
            </div>
            {capabilities.map((capability, index)=>(
                <div key={index} className='mt-3 bg-[#0f172a] p-3 rounded bg-sky-600/10'>
                    {capability}
                </div>
            ))}
            
        </div>
        <div className='w-full m-1' >
            <div className='flex text-sky-400'>
                <BsFillExclamationTriangleFill className='m-auto'  size={30}/>
            </div>
            <div className='mt-2'>
                Limitations
            </div>
            {limitations.map((limitation, index)=>(
                <div key={index} className='mt-3 bg-[#0f172a] p-3 rounded bg-sky-600/10'>
                    {limitation}
                </div>
            ))}
        </div>
        
    </div>
    
  )
}

export default greeting