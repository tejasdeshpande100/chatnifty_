"use client"
import React,{useState} from 'react';
import LineChart from '../ui/lineChart';
import Table from '../ui/table';

interface Props {
    metadata: any,
    index: number,
  }

const Source : React.FC<Props> = (props: any)=> {

    const metadata  = props.metadata;
    const [table, setTable] = useState<boolean>(false);

    let sourceContent = ''
    let companyName = metadata?.text.match(/Company Name: (.*)/)?.[1]
    let documentName = ''
    
    if(metadata.type === 'text'){
        sourceContent = metadata?.text.split('Passage:')[1]
        documentName = metadata?.text.match(/Document Name: (.*)/)?.[1]
    }
            
    return (
        <div>
        {metadata.type === 'text'? 
        <div className="mt-4 bg-slate-800 p-4 rounded">
            <div className='text-lg underline font-bold mb-2'>{companyName}: {documentName}</div>
            {sourceContent}
        </div>:
        <div className="mt-4 bg-slate-800 p-4 rounded">
            <button 
                onClick={()=>setTable(false)}
                className={` hover:bg-sky-400/10 ${table?'':'bg-sky-400/20'} text-sky-400  py-2 px-4 transition duration-300`}>
                Chart
            </button>

            <button 
                onClick={()=>setTable(true)}
                className={`hover:bg-sky-400/10 ${table?'bg-sky-400/20':''} text-sky-400  py-2 px-4 transition duration-300`}>
                Table
            </button>
            {table?
            <Table metadata={metadata}/>: <LineChart metadata={metadata}/>}
           
        </div>}
        </div>
    )
}

export default Source;