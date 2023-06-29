'use client'
import Chat from '../components/chat/chat'
import { StyledEngineProvider } from '@mui/material/styles';
import Drawer from '../components/ui/drawer';

export default function Home() {
  return (
    <main className="min-h-screen items-center pt-12 pl-2 pr-2 bg-[#0f172a]">
      <div className='fixed top-0 left-0 w-full bg-[#0f172a]'>
      <StyledEngineProvider injectFirst>
      <Drawer />
      </StyledEngineProvider>
      </div>
      <Chat/>
    </main>
  )
}
