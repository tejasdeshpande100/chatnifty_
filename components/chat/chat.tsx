'use client'
import React, { useState, ChangeEvent, useMemo } from 'react'
import { IoSend } from 'react-icons/io5';
import { ImCross } from 'react-icons/im';
import Sources from './sources';
import Greeting from './greeting';
import ThinkingLoader from '../ui/thinkingLoader';


const Chat: React.FC = () => {

  const [inputValue, setInputValue] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [sources, setSources] = useState<any[]>([])
  const [displayGreeting, setDisplayGreeting] = useState<boolean>(true);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) {
        e.preventDefault();
    }
    if(displayGreeting){
        setDisplayGreeting(false);
    }

    try{
        const response = await fetch('http://localhost:3000/api/pinecone', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({question: inputValue}),
        });
    
        // Ensure the response is valid
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    
        const matches = (await response.json()).matches;
        setSources([]);
        const sources = matches.map((match: any) => {
            setSources((prev) => [...prev, match.metadata]);
            return match.metadata.text;
        });
        
        try {
        
            const response = await fetch('http://localhost:3000/api/chat', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                question: inputValue,
                sources: sources
            }),
            });
        
            // Ensure the response is valid
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
        
            const reader = response.body?.getReader();
    
            setAiResponse('');
    
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
        <form onSubmit={handleSend} className='flex'>
            <input type="text" 
                value={inputValue} 
                onChange={handleInputChange} 
                className="w-full m-auto bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none margin" 
                placeholder="Ask a question, being specific will provide better results" 
            />
            <button 
                className="hover:bg-sky-400/50 bg-sky-400/20 text-sky-400 font-bold py-2 px-4 rounded"
            >
                <IoSend 
                 type='submit'
                 size={24} />
            </button>
        </form>
        <div className="bg-[#0f172a] p-4 rounded-lg border border-gray-500 shadow-md mt-4 text-slate-300">
        {displayGreeting?
        <Greeting setInputValue={setInputValue} handleSend={handleSend} />
        :<> 
            {aiResponse?<>
            <div>
                {aiResponse}
            </div>
            {MemoizedSources}</>:<div className='flex justify-end'>
                <ThinkingLoader/>
            </div>}   
        </>
        }
        </div>
    </div>
  )
}

export default Chat