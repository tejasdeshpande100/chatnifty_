'use client'
import React, { useState, ChangeEvent, useMemo } from 'react'
import { IoSend } from 'react-icons/io5';
import { ImCross } from 'react-icons/im';
import Sources from './sources';
import Greeting from './greeting';
import ThinkingLoader from '../ui/thinkingLoader';
import SourcesLoader from '../ui/sourcesLoader';


const Chat: React.FC = () => {

  const [inputValue, setInputValue] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [sources, setSources] = useState<any[]>([])
  const [displayGreeting, setDisplayGreeting] = useState<boolean>(true);
  const [streaming, setStreaming] = useState<boolean>(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (e?: React.FormEvent, ) => {
    if (e) {
        e.preventDefault();
    }

    getResponse(inputValue)
    
   
  }

  const getResponse = async (question:string) => {
    if(displayGreeting){
        setDisplayGreeting(false);
    }

    try{
        setSources([]);
        setAiResponse('');
        const response = await fetch('api/pinecone', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({question: question}),
        });
    
        // Ensure the response is valid
        if (!response.ok) {
            console.log(response)
            throw new Error(`Error here: ${response.status} - ${response.statusText}`);
        }
    
        const matches = (await response.json()).matches;
        
        const sources = matches.map((match: any) => {
            setSources((prev) => [...prev, match.metadata]);
            return match.metadata.text;
        });
        
        try {
        
            const response = await fetch('api/chat', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                question: question,
                sources: sources
            }),
            });
        
            // Ensure the response is valid
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
        
            const reader = response.body?.getReader();

            setStreaming(true)
    
            // Read the streaming text
            while (true) {
                if(reader){
                    const { done, value } = await reader.read();
    
                    // Check if the streaming is complete
                    if (done) {
                        break;
                    }
    
                    // Convert the received value to text
                    const chunk = new TextDecoder().decode(value);
    
                    // Process the received text
                    setAiResponse((prev) => prev + chunk.toString());
                }else{
                    console.log('reader is null')
                    break;
                }
                
            }

            setStreaming(false)
        } catch (error) {
            console.error('Error:', error);
        }
    }catch(error){
        console.error('Error in Fetching Data',error);
        return;
    }
  }

  // Memoize the Sources component to prevent unnecessary re-renders
  const MemoizedSources = useMemo(() => <Sources sources={sources} />, [sources]);


  return (
    <div className="container mx-auto max-w-6xl">
        <form onSubmit={handleSubmit} className='flex'>
            
            <input 
                type="text" 
                required
                value={inputValue} 
                onChange={handleInputChange} 
                className="w-full m-auto bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none margin" 
                placeholder="Ask a question..." 
            />
            <button 
                disabled={streaming}
                className="hover:bg-sky-400/50 bg-sky-400/20 text-sky-400 font-bold py-2 px-4 rounded"
            >
                <IoSend 
                 type='submit'
                 size={24} />
            </button>
        </form>
        {/* <div className='text-slate-500 text-xs mt-1'>Being specific will provide better results</div> */}
        <div className="bg-[#0f172a] p-4 rounded-lg border border-gray-500 shadow-md mt-4 text-slate-300 h-full">
        {displayGreeting?
        <Greeting setInputValue={setInputValue} getResponse={getResponse} />
        :<> 
            {aiResponse?
            <div>
                {aiResponse}
            </div>
            :sources.length?<div className='flex justify-end'>
                <ThinkingLoader/>
            </div>:null}   
            {sources.length?<div>
            {MemoizedSources}
            </div>:<div className='flex justify-end'>
            <SourcesLoader/>
                </div>}
        </>
        }
        </div>
    </div>
  )
}

export default Chat