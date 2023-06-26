import { OpenAIStream, StreamingTextResponse } from 'ai'
import { OPENAI_API_HOST, FETCH_ANSWER_PROMPT } from '../../../utils/app/const';


export const runtime = 'edge'


interface requestBody {
  question: string,
  sources: any[]
}

export async function POST(req: Request): Promise<Response>{

    try {

      const {question, sources} = (await req.json()) as requestBody;
      console.log(question)


      let financialData = 'Fanancial Data:\n\n'

      sources.forEach((source:string) => {
        financialData += `${source}\n\n`
      })

      const prompt = `${FETCH_ANSWER_PROMPT}${question}\n\n${financialData}\n\n}`

      

      let url = `${OPENAI_API_HOST}/v1/chat/completions`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert in the fields of finance, business, investing, and economics.',
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0,
          stream: true
      
        }),
      });

      
      if(response.status !== 200)
        return new Response('OpenaAI API error', { status: response.status })
     
      try{
        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);
      }  catch (error) {
        // Handle the error
        console.log('erorrrr',error)
        return new Response('error', { status: 500 })
      }
      
      
    
    } catch (error) {
      // Handle the error
      console.log('erorrrr',error)
      return new Response('error', { status: 500 })
    }
    
  }

