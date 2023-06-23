import React from 'react';
import LineChart from '../ui/lineChart';

interface Props {
    sources: any;
  }

const Sources : React.FC<Props> = (props: any)=> {
    const sources:any  = props.sources;
    return (
        <>
        {sources.length?
        <>
        {sources.map((metadata:any,index:number)=>{
            let sourceContent = ''
            let companyName = metadata?.text.match(/Company Name: (.*)/)?.[1]
            let documentName = ''
           
            if(metadata.type === 'text'){
                sourceContent = metadata?.text.split('Passage:')[1]
                documentName = metadata?.text.match(/Document Name: (.*)/)?.[1]
            }
            const uniqueKey = `${metadata.type}-${index}`;
            return (
                <div key={uniqueKey}>
                {metadata.type === 'text'? 
                <div className="mt-4 bg-slate-800 p-4 rounded">
                    <div className='text-lg underline font-bold mb-2'>{companyName}: {documentName}</div>
                    {sourceContent}
                </div>:<div className="mt-4 bg-slate-800 p-4 rounded">
                    <LineChart metadata={metadata}/>
                    </div>}
                </div>
            )
        })}
        </>
            :''}</>
    )
}

export default Sources;