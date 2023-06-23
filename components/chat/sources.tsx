import React from 'react';
import Source from './source';

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
            
            return (
                <Source metadata={metadata} index={index} key={`${metadata.type}-${index}`}/>
            )
        })}
        </>
            :''}</>
    )
}

export default Sources;