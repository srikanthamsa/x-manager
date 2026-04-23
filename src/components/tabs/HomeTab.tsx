import { useState } from 'react'
import { motion } from 'motion/react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
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

/** Pick the photo that naturally faces the desired direction; fall back to primary (will be flipped). */
function pickPhoto(team: typeof NEXT_MATCH.home, want: 'left' | 'right') {
  if (team.captainFacing === want) return { photo: team.captainPhoto!, facing: team.captainFacing }
  if (team.captainFacing2 === want && team.captainPhoto2) return { photo: team.captainPhoto2, facing: team.captainFacing2 }
  return { photo: team.captainPhoto!, facing: team.captainFacing ?? 'right' }
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] pt-10"
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
          className="relative z-30 flex flex-col items-center gap-4 pb-8"
        >
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-foreground-muted">Next Match</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gradient leading-tight">The Clash.</h1>
        </motion.div>

        {/* Clash panels */}
        <div className="relative flex" style={{ height: '420px' }}>

          {/* Home player — wants to face RIGHT toward center */}
          {(() => {
            const { photo: homePhoto, facing: homeFacing } = pickPhoto(NEXT_MATCH.home, 'right')
            const { photo: awayPhoto, facing: awayFacing } = pickPhoto(NEXT_MATCH.away, 'left')
            return (
          <>
          <div className="flex-1 relative overflow-hidden">
            {/* Color glow — transparent at top, full intensity at 50% height, stays full to bottom */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 2 }}
              style={{ background: `linear-gradient(to bottom, transparent 0%, ${NEXT_MATCH.home.color}44 50%, ${NEXT_MATCH.home.color}77 100%)` }}
            />
            {homePhoto && (
              <motion.img
                src={homePhoto}
                alt={NEXT_MATCH.home.captain ?? NEXT_MATCH.home.team}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1.1, ease: EASE }}
                className="absolute bottom-0 right-0 h-full object-contain object-bottom z-10"
                style={{ transform: homeFacing === 'left' ? 'scaleX(-1)' : undefined }}
              />
            )}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-20" />
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.7, ease: EASE }}
              className="absolute bottom-0 left-0 p-5 md:p-8 z-30 space-y-0.5"
            >
              <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/35">{NEXT_MATCH.home.manager}</p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none" style={{ color: NEXT_MATCH.home.color }}>
                {NEXT_MATCH.home.team}
              </h2>
              {NEXT_MATCH.home.captain && (
                <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest">{NEXT_MATCH.home.captain}</p>
              )}
            </motion.div>
          </div>

          {/* ── Lottie divider + VS ── */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
            {/* Lottie animation — full height, centered */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center" style={{ width: 120 }}>
              <DotLottieReact
                src="https://lottie.host/0bcc69c8-2106-422e-b3ac-535ba93d2845/Jah7Yhr8qI.lottie"
                loop
                autoplay
                style={{ width: 120, height: '100%' }}
              />
            </div>

            {/* VS badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6, ease: EASE }}
              className="relative flex flex-col items-center gap-0.5 z-10"
            >
              <div className="absolute inset-0 -m-4 rounded-full bg-black/50 backdrop-blur-md" />
              <motion.span
                className="relative text-2xl md:text-4xl font-black italic text-white"
                animate={{
                  textShadow: [
                    '0 0 8px rgba(255,255,255,0.3)',
                    '0 0 24px rgba(255,255,255,0.9)',
                    '0 0 8px rgba(255,255,255,0.3)',
                  ],
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                VS
              </motion.span>
              <span className="relative text-[8px] font-mono text-white/30 uppercase tracking-[0.3em]">Match {NEXT_MATCH.id}</span>
            </motion.div>
          </div>

          {/* Away player — wants to face LEFT toward center */}
          <div className="flex-1 relative overflow-hidden">
            {/* Color glow — transparent at top, full intensity at 50% height, stays full to bottom */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 2 }}
              style={{ background: `linear-gradient(to bottom, transparent 0%, ${NEXT_MATCH.away.color}44 50%, ${NEXT_MATCH.away.color}77 100%)` }}
            />
            {awayPhoto && (
              <motion.img
                src={awayPhoto}
                alt={NEXT_MATCH.away.captain ?? NEXT_MATCH.away.team}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1.1, ease: EASE }}
                className="absolute bottom-0 left-0 h-full object-contain object-bottom z-10"
                style={{ transform: awayFacing === 'right' ? 'scaleX(-1)' : undefined }}
              />
            )}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-20" />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.7, ease: EASE }}
              className="absolute bottom-0 right-0 p-5 md:p-8 z-30 text-right space-y-0.5"
            >
              <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/35">{NEXT_MATCH.away.manager}</p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none" style={{ color: NEXT_MATCH.away.color }}>
                {NEXT_MATCH.away.team}
              </h2>
              {NEXT_MATCH.away.captain && (
                <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest">{NEXT_MATCH.away.captain}</p>
              )}
            </motion.div>
          </div>
          </>
            )
          })()}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6, ease: EASE }}
          className="flex flex-col items-center gap-3 py-8"
        >
          <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest">{NEXT_MATCH.venue}</p>
          <button
            onClick={() => setMatchCenterOpen(true)}
            className="px-10 py-4 bg-foreground text-bg-base rounded-full text-sm font-bold tracking-tight hover:bg-accent hover:text-white transition-all duration-500 shadow-2xl hover:shadow-accent/40 group"
          >
            Enter Match Center <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
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

        {/* Mobile */}
        <div className="md:hidden">
          <FranchiseWheel managers={MANAGERS} S={352} cx={176} cy={176} r={136} band={80} logoSize={120} />
        </div>
        {/* Desktop */}
        <div className="hidden md:block">
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
