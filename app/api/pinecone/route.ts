import { PineconeClient } from '@pinecone-database/pinecone'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

interface requestBody {
    question: string
  }

export async function POST(req: Request): Promise<Response>{

  const {question} = (await req.json()) as requestBody;
  
  const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question)

  const client = new PineconeClient()
  await client.init({
    apiKey: process.env.PINECONE_API_KEY || '',
    environment: process.env.PINECONE_ENVIRONMENT || ''
  })

  const index = client.Index(process.env.PINECONE_INDEX || '');


  let queryResponse:any = await index.query({
    queryRequest: {
      topK: 5,
      vector: queryEmbedding,
      includeMetadata: true,
      includeValues: true,
      namespace: 'test'
    },
  });
  
  return new Response(JSON.stringify({matches:queryResponse.matches}), { status: 200 });
}
