import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import HlsVideo from './components/HlsVideo'
import BottomNav from './components/BottomNav'
import HomeTab from './components/tabs/HomeTab'
import FixturesTab from './components/tabs/FixturesTab'
import StandingsTab from './components/tabs/StandingsTab'
import TradesTab from './components/tabs/TradesTab'
import TrophyTab from './components/tabs/TrophyTab'

const HLS_BG = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'

export type TabId = 'home' | 'fixtures' | 'standings' | 'trades' | 'trophy'

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home')

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab key="home" />
      case 'fixtures':
        return <FixturesTab key="fixtures" />
      case 'standings':
        return <StandingsTab key="standings" />
      case 'trades':
        return <TradesTab key="trades" />
      case 'trophy':
        return <TrophyTab key="trophy" />
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-transparent selection:bg-accent/30 text-foreground overflow-hidden">
      {/* ── Background System ── */}
      <div className="bg-layers">
        <HlsVideo
          src={HLS_BG}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Animated Blobs */}
        <div 
          className="bg-blob w-[1000px] h-[1000px] -top-[20%] -left-[10%] bg-accent/20" 
          style={{ animationDuration: '15s' }} 
        />
        <div 
          className="bg-blob w-[800px] h-[800px] top-[40%] -right-[10%] bg-indigo-500/10" 
          style={{ animationDuration: '12s', animationDelay: '-5s' }} 
        />
        <div 
          className="bg-blob w-[600px] h-[600px] -bottom-[10%] left-[20%] bg-purple-500/10" 
          style={{ animationDuration: '18s', animationDelay: '-2s' }} 
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 h-screen flex flex-col">
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-12 pb-48">
          <div className="max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {renderTab()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}

export default App
