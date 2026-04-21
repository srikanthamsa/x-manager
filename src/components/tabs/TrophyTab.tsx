import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Trophy, Star, Crown, Lock, Shield, ArrowRight, TrendingUp, Eye } from 'lucide-react'
import trophyImg from '../../assets/trophy.png'
import { TEAMS } from '../../data/teams'
import Modal from '../Modal'
import FranchiseHistoryScreen from '../screens/FranchiseHistoryScreen'

interface ManagerAchievement {
  name: string
  shortName: string
  logo: string
  color: string
  manager: string
  nickname: string
  tagline: string
  trophies: number
  runnerUp: number
  mvpAwards: number
}

const MANAGERS_ACHIEVEMENTS: ManagerAchievement[] = [
  { ...TEAMS.RCB, trophies: 0, runnerUp: 0, mvpAwards: 0 },
  { ...TEAMS.KKR, trophies: 0, runnerUp: 0, mvpAwards: 0 },
  { ...TEAMS.SRH, trophies: 0, runnerUp: 0, mvpAwards: 0 },
  { ...TEAMS.MI, trophies: 0, runnerUp: 0, mvpAwards: 0 },
  { ...TEAMS.CSK, trophies: 0, runnerUp: 0, mvpAwards: 0 },
]

const DEMO_ACHIEVEMENTS: ManagerAchievement[] = [
  { ...TEAMS.CSK, trophies: 3, runnerUp: 1, mvpAwards: 4 },
  { ...TEAMS.MI, trophies: 2, runnerUp: 2, mvpAwards: 3 },
  { ...TEAMS.RCB, trophies: 1, runnerUp: 2, mvpAwards: 5 },
  { ...TEAMS.KKR, trophies: 1, runnerUp: 1, mvpAwards: 2 },
  { ...TEAMS.SRH, trophies: 0, runnerUp: 1, mvpAwards: 2 },
]

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function TrophyTab() {
  const [demo, setDemo] = useState(false)
  const [selectedManager, setSelectedManager] = useState<ManagerAchievement | null>(null)
  const achievements = demo ? DEMO_ACHIEVEMENTS : MANAGERS_ACHIEVEMENTS

  return (
    <div className="max-w-6xl mx-auto space-y-24 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex flex-col items-center text-center space-y-4 pt-12"
      >
        <div className="flex items-center gap-4 px-6 py-2 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md">
          <Trophy className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-foreground-muted">The Hall of Fame</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-gradient pb-2">
          Immortals.
        </h1>
      </motion.div>

      {/* Demo toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => setDemo(!demo)}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border transition-all ${
            demo ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-white/[0.03] border-white/[0.06] text-foreground-muted hover:border-white/[0.1]'
          }`}
        >
          <Eye className="w-3 h-3" />
          {demo ? 'Showing Preview Mode' : 'Preview Mode'}
        </button>
      </div>

      {/* Cabinet section */}
      <AnimatePresence mode="wait">
        {demo ? (
          <motion.section
            key="demo"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="space-y-8"
          >
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-accent">Preview Mode</p>
              <p className="text-[11px] font-mono text-foreground-muted uppercase tracking-widest">This is how the cabinet would look like after multiple seasons</p>
            </div>

            {/* Trophy shelf for top teams */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-8 md:p-12 space-y-10">
              {DEMO_ACHIEVEMENTS.filter(m => m.trophies > 0).map((mgr, idx) => (
                <motion.div
                  key={mgr.shortName}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, ease: EASE }}
                  className="flex items-center gap-6 pb-8 border-b border-white/[0.04] last:border-0 last:pb-0"
                >
                  <img src={mgr.logo} alt={mgr.shortName} className="w-14 h-14 object-contain shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{mgr.manager}</p>
                    <p className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">{mgr.shortName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: mgr.trophies }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ delay: idx * 0.1 + i * 0.15, type: 'spring', stiffness: 200 }}
                        className="flex flex-col items-center gap-0.5"
                      >
                        <img
                          src={trophyImg}
                          alt="trophy"
                          className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-[0_0_10px_rgba(255,200,0,0.5)]"
                        />
                        <span className="text-[7px] font-mono text-foreground-muted/50 uppercase tracking-widest">S{i + 1}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="locked"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
            className="relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-accent/5 blur-[120px] rounded-full -z-10" />
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-[3rem] p-12 md:p-24 flex flex-col items-center text-center space-y-8 backdrop-blur-3xl">
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
                <div className="relative w-24 h-24 rounded-full bg-bg-base border border-white/10 flex items-center justify-center shadow-2xl">
                  <Lock className="w-10 h-10 text-accent/40" />
                </div>
              </div>

              <div className="max-w-md space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">Cabinet Locked.</h2>
                <p className="text-foreground-muted text-lg font-light leading-relaxed">
                  Season 1 is currently in progress. The first name etched here will become{' '}
                  <motion.span
                    className="font-black tracking-[0.25em] text-accent uppercase text-base"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    IMMORTAL
                  </motion.span>{' '}
                  in the league's history.
                </p>
              </div>

              <div className="flex items-center gap-12 pt-4">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-mono text-foreground-muted uppercase tracking-widest">Active Players</span>
                  <span className="text-2xl font-black">5</span>
                </div>
                <div className="w-px h-12 bg-white/5" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-mono text-foreground-muted uppercase tracking-widest">Prize Pool</span>
                  <span className="text-2xl font-black">₹ 500</span>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Manager Records */}
      <section className="space-y-12 px-2 md:px-6">
        <div className="flex items-end justify-between border-b border-white/5 pb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter">Franchise Legacy.</h2>
            <p className="text-foreground-muted mt-1 font-mono text-[10px] uppercase tracking-widest">Career Statistics & Accolades</p>
          </div>
          <TrendingUp className="w-5 h-5 text-accent/40" />
        </div>

        <div className="space-y-px bg-white/[0.03] border border-white/[0.03] rounded-[2rem] overflow-hidden">
          {achievements.map((manager, i) => (
            <motion.div
              key={manager.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-bg-base p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 group hover:bg-white/[0.02] transition-colors duration-500 border-b border-white/[0.02] last:border-0"
            >
              {/* Profile */}
              <div className="flex items-center gap-6 md:gap-8 min-w-0 md:min-w-[280px] w-full md:w-auto">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-[2rem] flex items-center justify-center transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 shrink-0">
                  <img src={manager.logo} alt={manager.shortName} className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight">{manager.manager}</h3>
                  <p className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest mt-1">{manager.nickname}</p>
                  <p className="text-xs text-accent mt-2 italic font-medium opacity-60 group-hover:opacity-100 transition-opacity truncate">"{manager.tagline}"</p>
                  {/* Mobile trophy display */}
                  {manager.trophies > 0 && (
                    <div className="flex gap-1 mt-2 md:hidden">
                      {Array.from({ length: manager.trophies }).map((_, j) => (
                        <img key={j} src={trophyImg} alt="trophy" className="w-6 h-6 object-contain" />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Accolades */}
              <div className="flex-1 grid grid-cols-3 gap-4 md:gap-8 w-full md:w-auto">
                <div className="flex flex-col items-center md:items-start gap-2">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-500/60" />
                    <span className="text-xs font-mono text-foreground-muted uppercase tracking-widest">Titles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black tabular-nums">{manager.trophies}</span>
                    {manager.trophies > 0 && (
                      <div className="hidden md:flex gap-1">
                        {Array.from({ length: Math.min(manager.trophies, 3) }).map((_, j) => (
                          <img key={j} src={trophyImg} alt="trophy" className="w-7 h-7 object-contain" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center md:items-start gap-2 border-l border-white/5 pl-4 md:pl-8">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-foreground-subtle/30" />
                    <span className="text-xs font-mono text-foreground-muted uppercase tracking-widest">Finals</span>
                  </div>
                  <span className="text-3xl font-black tabular-nums">{manager.runnerUp}</span>
                </div>
                <div className="flex flex-col items-center md:items-start gap-2 border-l border-white/5 pl-4 md:pl-8">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-emerald-500/40" />
                    <span className="text-xs font-mono text-foreground-muted uppercase tracking-widest">MVPs</span>
                  </div>
                  <span className="text-3xl font-black tabular-nums">{manager.mvpAwards}</span>
                </div>
              </div>

              {/* Arrow CTA */}
              <button
                onClick={() => setSelectedManager(manager)}
                className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-accent hover:border-accent group/btn shrink-0"
              >
                <ArrowRight className="w-4 h-4 text-foreground group-hover/btn:text-white" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Franchise history modal */}
      <Modal
        open={!!selectedManager}
        onClose={() => setSelectedManager(null)}
        title={selectedManager ? `${selectedManager.manager} · ${selectedManager.shortName}` : ''}
        fullScreen
      >
        {selectedManager && <FranchiseHistoryScreen manager={selectedManager} />}
      </Modal>
    </div>
  )
}
