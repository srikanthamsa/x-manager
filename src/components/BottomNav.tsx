import { motion } from 'motion/react'
import { Home, CalendarDays, BarChart3, ArrowLeftRight, Trophy } from 'lucide-react'
import type { TabId } from '../App'

interface BottomNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const tabs: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'fixtures', label: 'Fixtures', icon: CalendarDays },
  { id: 'standings', label: 'Table', icon: BarChart3 },
  { id: 'trades', label: 'Trades', icon: ArrowLeftRight },
  { id: 'trophy', label: 'Trophies', icon: Trophy },
]

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex justify-center px-4">
      <nav className="linear-glass !rounded-full px-2 py-2 flex items-center gap-1 w-fit min-w-[320px] shadow-2xl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative group px-4 py-2.5 rounded-full transition-all duration-300"
            >
              {/* Active Highlight */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 rounded-full bg-accent/10 border border-accent/20"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center gap-1">
                <Icon
                  className={`w-5 h-5 transition-all duration-300 ${
                    isActive 
                      ? 'text-accent scale-110 drop-shadow-[0_0_8px_rgba(94,106,210,0.5)]' 
                      : 'text-foreground-muted group-hover:text-foreground'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={`text-[10px] font-medium tracking-wide transition-all duration-300 ${
                    isActive ? 'text-foreground' : 'text-foreground-muted group-hover:text-foreground-subtle'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

