import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

interface requestBody {
    question: string
  }

export async function POST(req: Request): Promise<Response>{

  const {question} = (await req.json()) as requestBody;
  
  const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question)

  const url = process.env.PINECONE_URL + '/query' || '';
  const apiKey = process.env.PINECONE_API_KEY || '';

  const options = {
    method: 'POST',
    headers: {
      'Api-Key': apiKey,
      'accept': 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      topK: 2,
      vector: queryEmbedding,
      includeMetadata: true,
      includeValues: true,
      namespace: 'test'
    }),
  };

  try {
    const response = await fetch(url, options);
    
    const data = await response.json();
   
    return new Response(JSON.stringify({matches:data.matches}), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({error}), { status: 500 });
   
  }

}
