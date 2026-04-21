import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowRight, Check, X, ArrowLeftRight } from 'lucide-react'
import Modal from '../Modal'
import InitiateTradeModal from '../screens/InitiateTradeModal'

interface TradeOffer {
  id: number
  from: { manager: string; team: string; color: string; logo: string }
  to: { manager: string; team: string; color: string; logo: string }
  offering: string
  requesting: string
  status: 'pending' | 'accepted' | 'rejected'
  timestamp: string
}

interface MarketPlayer {
  id: number
  name: string
  role: string
  owner: { team: string; manager: string; color: string; logo: string }
  askingPrice: string
  available: boolean
}

import { TEAMS } from '../../data/teams'

const TRADE_OFFERS: TradeOffer[] = [
  {
    id: 1,
    from: { manager: TEAMS.RCB.manager, team: TEAMS.RCB.shortName, color: TEAMS.RCB.color, logo: TEAMS.RCB.logo },
    to: { manager: TEAMS.KKR.manager, team: TEAMS.KKR.shortName, color: TEAMS.KKR.color, logo: TEAMS.KKR.logo },
    offering: 'Glenn Maxwell',
    requesting: 'Andre Russell',
    status: 'pending',
    timestamp: '2h ago',
  },
  {
    id: 2,
    from: { manager: TEAMS.MI.manager, team: TEAMS.MI.shortName, color: TEAMS.MI.color, logo: TEAMS.MI.logo },
    to: { manager: TEAMS.SRH.manager, team: TEAMS.SRH.shortName, color: TEAMS.SRH.color, logo: TEAMS.SRH.logo },
    offering: 'Tim David',
    requesting: 'Travis Head',
    status: 'pending',
    timestamp: '5h ago',
  },
  {
    id: 3,
    from: { manager: TEAMS.CSK.manager, team: TEAMS.CSK.shortName, color: TEAMS.CSK.color, logo: TEAMS.CSK.logo },
    to: { manager: TEAMS.RCB.manager, team: TEAMS.RCB.shortName, color: TEAMS.RCB.color, logo: TEAMS.RCB.logo },
    offering: 'Devon Conway',
    requesting: 'Faf du Plessis',
    status: 'rejected',
    timestamp: '1d ago',
  },
]

const MARKET_PLAYERS: MarketPlayer[] = [
  { id: 1, name: 'Shimron Hetmyer', role: 'Batter', owner: { team: TEAMS.RCB.shortName, manager: TEAMS.RCB.manager, color: TEAMS.RCB.color, logo: TEAMS.RCB.logo }, askingPrice: '₹8 Cr', available: true },
  { id: 2, name: 'Lockie Ferguson', role: 'Bowler', owner: { team: TEAMS.KKR.shortName, manager: TEAMS.KKR.manager, color: TEAMS.KKR.color, logo: TEAMS.KKR.logo }, askingPrice: '₹6 Cr', available: true },
  { id: 3, name: 'Marco Jansen', role: 'All-rounder', owner: { team: TEAMS.SRH.shortName, manager: TEAMS.SRH.manager, color: TEAMS.SRH.color, logo: TEAMS.SRH.logo }, askingPrice: '₹7 Cr', available: true },
  { id: 4, name: 'Akash Madhwal', role: 'Bowler', owner: { team: TEAMS.MI.shortName, manager: TEAMS.MI.manager, color: TEAMS.MI.color, logo: TEAMS.MI.logo }, askingPrice: '₹4 Cr', available: true },
  { id: 5, name: 'Moeen Ali', role: 'All-rounder', owner: { team: TEAMS.CSK.shortName, manager: TEAMS.CSK.manager, color: TEAMS.CSK.color, logo: TEAMS.CSK.logo }, askingPrice: '₹5 Cr', available: true },
]


type SubTab = 'offers' | 'market'
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function TradesTab() {
  const [subTab, setSubTab] = useState<SubTab>('offers')
  const [tradeOpen, setTradeOpen] = useState(false)

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex flex-col items-center text-center space-y-6 border-b border-white/5 pb-12"
      >
        <div className="flex gap-1.5 p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl">
          {(['offers', 'market'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSubTab(t)}
              className={`relative px-8 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-500 ${
                subTab === t ? 'text-foreground' : 'text-foreground-muted hover:text-foreground-subtle'
              }`}
            >
              {subTab === t && (
                <motion.div
                  layoutId="subTabPill"
                  className="absolute inset-0 rounded-xl bg-accent shadow-[0_0_20px_rgba(94,106,210,0.3)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t}</span>
            </button>
          ))}
        </div>

        <div>
          <h1 className="text-5xl font-bold tracking-tighter text-gradient leading-tight">
            Exchange.
          </h1>
          <p className="text-foreground-muted mt-2 font-mono text-[10px] uppercase tracking-[0.2em]">
            Deals, Offers & The Open Market
          </p>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {subTab === 'offers' ? (
          <motion.div
            key="offers"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="space-y-px bg-white/[0.02] border border-white/[0.03] rounded-[2rem] overflow-hidden"
          >
            {TRADE_OFFERS.map((offer) => (
              <div 
                key={offer.id} 
                className="bg-bg-base p-8 md:p-10 flex flex-col lg:flex-row lg:items-center gap-8 md:gap-12 group hover:bg-white/[0.02] transition-colors duration-500 border-b border-white/[0.02] last:border-0"
              >
                {/* Visual Transaction Indicator */}
                <div className="flex items-center justify-center lg:justify-start gap-6">
                   <div 
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  >
                    <img src={offer.from.logo} alt={offer.from.team} className="w-full h-full object-contain" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-foreground-muted/40" />
                  <div 
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  >
                    <img src={offer.to.logo} alt={offer.to.team} className="w-full h-full object-contain" />
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <div className="space-y-1 text-center lg:text-left">
                    <p className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">Offering</p>
                    <p className="text-lg md:text-xl font-bold tracking-tight text-foreground">{offer.offering}</p>
                  </div>
                  <div className="space-y-1 text-center lg:text-left">
                    <p className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">Requesting</p>
                    <p className="text-lg md:text-xl font-bold tracking-tight text-foreground">{offer.requesting}</p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 pt-4 lg:pt-0">
                  <div className="text-center lg:text-right">
                    <p className="text-xs font-mono text-foreground-muted uppercase tracking-widest">{offer.timestamp}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-1 ${
                      offer.status === 'pending' ? 'text-amber-500' :
                      offer.status === 'accepted' ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {offer.status}
                    </p>
                  </div>
                  {offer.status === 'pending' && (
                    <div className="flex gap-2">
                      <button className="w-10 h-10 rounded-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 flex items-center justify-center transition-all">
                        <Check className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 flex items-center justify-center transition-all">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="market"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="space-y-px bg-white/[0.02] border border-white/[0.03] rounded-[2rem] overflow-hidden"
          >
            {MARKET_PLAYERS.map((player) => (
              <div 
                key={player.id} 
                className="bg-bg-base px-8 py-10 lg:px-10 lg:py-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12 group hover:bg-white/[0.02] transition-colors duration-500 border-b border-white/[0.02] last:border-0"
              >
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  <div 
                    className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500"
                  >
                    <img src={player.owner.logo} alt={player.owner.team} className="w-full h-full object-contain" />
                  </div>
                  <div className="text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                      <p className="text-xl font-bold tracking-tight">{player.name}</p>
                      <span className="text-[10px] font-mono py-0.5 px-2 rounded bg-white/[0.03] text-foreground-muted uppercase tracking-widest">{player.role}</span>
                    </div>
                    <p className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest mt-1">Owner: {player.owner.team} ({player.owner.manager})</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
                   <div className="text-center lg:text-right">
                     <p className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">Asking Price</p>
                     <p className="text-2xl font-black text-gradient mt-0.5">{player.askingPrice}</p>
                   </div>
                   <button className="w-full md:w-auto px-8 py-3 bg-foreground text-bg-base rounded-full text-xs font-bold tracking-tight hover:bg-accent hover:text-white transition-all duration-500 shadow-xl group">
                     Initiate Deal
                   </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Initiate Trade CTA */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => setTradeOpen(true)}
          className="flex items-center gap-3 px-8 py-4 bg-white/[0.03] border border-white/[0.08] rounded-full text-sm font-bold hover:bg-accent/10 hover:border-accent/30 hover:text-accent transition-all duration-300 group"
        >
          <ArrowLeftRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Initiate a Trade
        </button>
      </div>

      <Modal open={tradeOpen} onClose={() => setTradeOpen(false)} title="Initiate Trade" fullScreen>
        <InitiateTradeModal onClose={() => setTradeOpen(false)} />
      </Modal>
    </div>
  )
}


