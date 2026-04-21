import { useState } from 'react'
import { motion } from 'motion/react'
import { Zap, ArrowRight } from 'lucide-react'
import trophyImg from '../../assets/trophy.png'
import { TEAMS } from '../../data/teams'
import { MATCHES, NEXT_MATCH } from '../../data/matches'
import Modal from '../Modal'
import MatchCenterScreen from '../screens/MatchCenterScreen'
import AllMatchesScreen from '../screens/AllMatchesScreen'
import MatchDetailScreen from '../screens/MatchDetailScreen'
import type { Match } from '../../data/matches'

const MANAGERS = Object.values(TEAMS).map(team => ({
  name: team.manager,
  nickname: team.nickname,
  team: team.shortName,
  color: team.color,
  logo: team.logo,
}))

const COMPLETED = MATCHES.filter(m => m.status === 'completed').slice(0, 3).reverse()

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface WheelProps {
  managers: typeof MANAGERS
  S: number; cx: number; cy: number; r: number; band: number; logoSize: number
}

function FranchiseWheel({ managers, S, cx, cy, r, band, logoSize }: WheelProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const active = hovered !== null ? managers[hovered] : null

  return (
    <div className="relative mx-auto" style={{ width: S, height: S }}>
      <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${S} ${S}`} overflow="visible">
        {hovered !== null && (() => {
          const a = (hovered * 72 - 90) * (Math.PI / 180)
          const nx = cx + Math.cos(a) * r
          const ny = cy + Math.sin(a) * r
          const col = managers[hovered].color
          return (
            <g filter="url(#glow)">
              <circle cx={nx} cy={ny} r={band * 0.7} fill={col} fillOpacity="0.35" />
            </g>
          )
        })()}
        <defs>
          <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="18" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /></feMerge>
          </filter>
        </defs>
      </svg>

      {/* Center trophy */}
      <div className="absolute flex flex-col items-center justify-center"
        style={{ left: cx, top: cy, transform: 'translate(-50%, -50%)', width: 200, height: 200 }}>
        {active ? (
          <motion.div key={active.name} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-2">
            <img src={active.logo} alt={active.team} className="w-24 h-24 object-contain" />
            <p className="text-[10px] font-mono text-foreground-muted uppercase tracking-[0.2em]">{active.nickname}</p>
          </motion.div>
        ) : (
          <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <img src={trophyImg} alt="trophy" className="w-48 h-48 object-contain drop-shadow-[0_0_30px_rgba(255,200,0,0.3)]" />
          </motion.div>
        )}
      </div>

      {managers.map((m, i) => {
        const a = (i * 72 - 90) * (Math.PI / 180)
        const nx = cx + Math.cos(a) * r
        const ny = cy + Math.sin(a) * r
        const half = logoSize / 2
        return (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
            className="absolute cursor-pointer"
            style={{ left: nx - half, top: ny - half, width: logoSize, height: logoSize }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onTouchStart={() => setHovered(i)}
            onTouchEnd={() => setHovered(null)}
          >
            <motion.div
              animate={{ scale: hovered === i ? 1.2 : 1 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full flex items-center justify-center"
              style={{ background: `radial-gradient(circle at center, ${m.color}40 0%, ${m.color}08 55%, transparent 100%)` }}
            >
              <img src={m.logo} alt={m.team} className="object-contain" style={{ width: logoSize * 0.75, height: logoSize * 0.75 }} />
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default function HomeTab() {
  const [matchCenterOpen, setMatchCenterOpen] = useState(false)
  const [allMatchesOpen, setAllMatchesOpen] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  const handleSelectMatch = (match: Match) => {
    setAllMatchesOpen(false)
    setSelectedMatch(match)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-24 pb-20">
      {/* ── Hero / Next Match ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative pt-12"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 blur-[120px] rounded-full -z-10" />

        <div className="flex flex-col items-center text-center space-y-8">
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-foreground-muted">Live Matchday Experience</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-gradient pb-2">
            The Clash.
          </h1>

          <div className="w-full flex flex-row items-center justify-center gap-6 md:gap-24 pt-8">
            <div className="flex flex-col items-center text-center group">
              <div className="w-28 h-28 md:w-56 md:h-56 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-3">
                <img src={NEXT_MATCH.home.logo} alt={NEXT_MATCH.home.team} className="w-full h-full object-contain" />
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-lg md:text-2xl font-semibold tracking-tight uppercase">{NEXT_MATCH.home.team}</p>
                <p className="text-[10px] md:text-sm font-mono text-foreground-muted uppercase tracking-wider">{NEXT_MATCH.home.manager}</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="h-16 md:h-24 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              <span className="text-3xl md:text-5xl font-black text-white/60 italic py-3 md:py-4">VS</span>
              <div className="h-16 md:h-24 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-28 h-28 md:w-56 md:h-56 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:-rotate-3">
                <img src={NEXT_MATCH.away.logo} alt={NEXT_MATCH.away.team} className="w-full h-full object-contain" />
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-lg md:text-2xl font-semibold tracking-tight uppercase">{NEXT_MATCH.away.team}</p>
                <p className="text-[10px] md:text-sm font-mono text-foreground-muted uppercase tracking-wider">{NEXT_MATCH.away.manager}</p>
              </div>
            </div>
          </div>

          <div className="pt-12 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center">
              <p className="text-lg font-medium text-foreground-subtle tracking-tight">{NEXT_MATCH.venue}</p>
              <p className="text-sm text-foreground-muted font-mono uppercase tracking-widest mt-1">
                Match {NEXT_MATCH.id}
              </p>
            </div>
            <button
              onClick={() => setMatchCenterOpen(true)}
              className="px-10 py-4 bg-foreground text-bg-base rounded-full text-sm font-bold tracking-tight hover:bg-accent hover:text-white transition-all duration-500 shadow-2xl hover:shadow-accent/40 group"
            >
              Enter Match Center <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </motion.section>

      {/* ── Status Bar Metrics ── */}
      <section className="relative px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-10">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <span className="text-[10px] font-mono text-foreground-muted uppercase tracking-[0.2em]">Tournament Pool</span>
            <span className="text-3xl font-bold tracking-tight">₹ 500</span>
            <span className="text-[10px] text-accent font-medium flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" /> Live updates
            </span>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-2 border-l border-white/5 md:pl-12">
            <span className="text-[10px] font-mono text-foreground-muted uppercase tracking-[0.2em]">Franchises</span>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold tracking-tight">05</span>
              <span className="text-sm text-foreground-muted font-light mb-1">active teams</span>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-2 border-l border-white/5 md:pl-12">
            <span className="text-[10px] font-mono text-foreground-muted uppercase tracking-[0.2em]">Total Matches</span>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold tracking-tight">23</span>
              <span className="text-sm text-foreground-muted font-light mb-1">matches</span>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-2 border-l border-white/5 md:pl-12">
            <span className="text-[10px] font-mono text-foreground-muted uppercase tracking-[0.2em]">Season Status</span>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold tracking-tight">S1</span>
              <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Active</span>
              </div>
            </div>
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* ── Franchise Board ── */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tighter">Franchise Board.</h2>
          <p className="text-foreground-muted mt-2">The architects of Season 1</p>
        </div>

        {/* Mobile wheel */}
        <div className="md:hidden flex justify-center">
          <FranchiseWheel managers={MANAGERS} S={360} cx={180} cy={180} r={138} band={80} logoSize={120} />
        </div>
        {/* Desktop wheel */}
        <div className="hidden md:flex justify-center">
          <FranchiseWheel managers={MANAGERS} S={440} cx={220} cy={220} r={170} band={100} logoSize={150} />
        </div>
      </section>

      {/* ── Activity Feed ── */}
      <section className="space-y-12">
        <div className="flex items-end justify-between border-b border-white/5 pb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter">Activity.</h2>
            <p className="text-foreground-muted mt-1 font-mono text-[10px] uppercase tracking-widest">Latest from the pitch</p>
          </div>
          <button
            onClick={() => setAllMatchesOpen(true)}
            className="text-xs font-bold text-foreground hover:text-accent transition-colors flex items-center gap-2 group"
          >
            All Matches <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="space-y-px bg-white/[0.03] rounded-3xl overflow-hidden border border-white/[0.03]">
          {COMPLETED.map((match) => (
            <div
              key={match.id}
              className="bg-bg-base px-5 py-4 flex flex-col gap-3 group hover:bg-white/[0.02] transition-colors duration-500 border-b border-white/[0.02] last:border-0"
            >
              {/* Top row: logos + match number */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={match.home.logo} alt={match.home.team} className="w-9 h-9 object-contain" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">{match.home.team}</span>
                  <span className="text-[9px] font-mono text-foreground-muted/40 uppercase tracking-widest px-1">vs</span>
                  <span className="text-[10px] font-bold uppercase tracking-tight">{match.away.team}</span>
                  <img src={match.away.logo} alt={match.away.team} className="w-9 h-9 object-contain" />
                </div>
                <span className="text-[9px] font-mono text-foreground-muted/50 uppercase tracking-widest shrink-0">M{match.id}</span>
              </div>
              {/* Result */}
              <p className="text-sm text-foreground-subtle leading-snug">{match.result}</p>
              {/* Details link */}
              <button
                onClick={() => setSelectedMatch(match)}
                className="self-start text-[10px] font-bold text-accent uppercase tracking-widest"
              >
                Details →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Modals ── */}
      <Modal open={matchCenterOpen} onClose={() => setMatchCenterOpen(false)} title={`Match ${NEXT_MATCH.id} · Match Center`} fullScreen>
        <MatchCenterScreen match={NEXT_MATCH} />
      </Modal>

      <Modal open={allMatchesOpen} onClose={() => setAllMatchesOpen(false)} title="All Matches" fullScreen>
        <AllMatchesScreen onSelectMatch={handleSelectMatch} />
      </Modal>

      <Modal open={!!selectedMatch} onClose={() => setSelectedMatch(null)} title={selectedMatch ? `Match ${selectedMatch.id} · ${selectedMatch.home.team} vs ${selectedMatch.away.team}` : ''} fullScreen>
        {selectedMatch && <MatchDetailScreen match={selectedMatch} />}
      </Modal>
    </div>
  )
}
