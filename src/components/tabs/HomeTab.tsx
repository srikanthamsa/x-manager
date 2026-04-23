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

  const { photo: homePhoto, facing: homeFacing } = pickPhoto(NEXT_MATCH.home, 'right')
  const { photo: awayPhoto, facing: awayFacing } = pickPhoto(NEXT_MATCH.away, 'left')

  const handleSelectMatch = (match: Match) => {
    setAllMatchesOpen(false)
    setSelectedMatch(match)
  }

  // Lightning bolt clip-paths — panels share a perfect zigzag seam at screen center
  // Home extends 8% past center at top/75%, pulls 8% before center at 25%/bottom
  const homeClip = 'polygon(0% 0%, 100% 0%, 108% 25%, 92% 50%, 108% 75%, 100% 100%, 0% 100%)'
  const awayClip = 'polygon(0% 0%, 8% 25%, -8% 50%, 8% 75%, 0% 100%, 100% 100%, 100% 0%)'

  return (
    <div className="max-w-6xl mx-auto space-y-24 pb-20">
      {/* ── Hero / Next Match — full bleed, top to bottom ── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative -mx-4 -mt-12 overflow-hidden flex-shrink-0"
        style={{ height: '100svh', minHeight: 640 }}
      >
        {/* ─ PANELS ─ */}
        <div className="absolute inset-0 flex">
          {/* Home panel */}
          <div className="flex-1 relative" style={{ clipPath: homeClip }}>
            <motion.div
              className="absolute inset-0 z-0 pointer-events-none"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 2 }}
              style={{ background: `radial-gradient(ellipse 110% 65% at 80% 115%, ${NEXT_MATCH.home.color}90 0%, ${NEXT_MATCH.home.color}30 40%, transparent 65%), linear-gradient(to top, ${NEXT_MATCH.home.color}30 0%, transparent 50%)` }}
            />
            {homePhoto && (
              <motion.img
                src={homePhoto} alt={NEXT_MATCH.home.captain ?? NEXT_MATCH.home.team}
                initial={{ opacity: 0, y: 60, scaleX: homeFacing === 'left' ? -1 : 1 }}
                animate={{ opacity: 1, y: 0, scaleX: homeFacing === 'left' ? -1 : 1 }}
                transition={{ delay: 0.5, duration: 1.1, ease: EASE }}
                className="absolute bottom-0 right-0 h-[92%] object-contain object-bottom z-10"
                style={{ mixBlendMode: 'luminosity' }}
              />
            )}
            <div className="absolute inset-0 z-[11] pointer-events-none" style={{ background: NEXT_MATCH.home.color, mixBlendMode: 'color', opacity: 0.65 }} />
          </div>

          {/* Away panel */}
          <div className="flex-1 relative" style={{ clipPath: awayClip }}>
            <motion.div
              className="absolute inset-0 z-0 pointer-events-none"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 2 }}
              style={{ background: `radial-gradient(ellipse 110% 65% at 20% 115%, ${NEXT_MATCH.away.color}90 0%, ${NEXT_MATCH.away.color}30 40%, transparent 65%), linear-gradient(to top, ${NEXT_MATCH.away.color}30 0%, transparent 50%)` }}
            />
            {awayPhoto && (
              <motion.img
                src={awayPhoto} alt={NEXT_MATCH.away.captain ?? NEXT_MATCH.away.team}
                initial={{ opacity: 0, y: 60, scaleX: awayFacing === 'right' ? -1 : 1 }}
                animate={{ opacity: 1, y: 0, scaleX: awayFacing === 'right' ? -1 : 1 }}
                transition={{ delay: 0.6, duration: 1.1, ease: EASE }}
                className="absolute bottom-0 left-0 h-[92%] object-contain object-bottom z-10"
                style={{ mixBlendMode: 'luminosity' }}
              />
            )}
            <div className="absolute inset-0 z-[11] pointer-events-none" style={{ background: NEXT_MATCH.away.color, mixBlendMode: 'color', opacity: 0.65 }} />
          </div>
        </div>

        {/* ─ TOP FADE — title readability ─ */}
        <div className="absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-black/75 to-transparent z-20 pointer-events-none" />

        {/* ─ BOTTOM FADE ─ */}
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/95 via-black/70 to-transparent z-20 pointer-events-none" />

        {/* ─ LIGHTNING SEAM — Lottie animations at the 4 kink points of the bolt ─ */}
        <div className="absolute inset-0 flex justify-center pointer-events-none z-20">
          <div className="relative h-full" style={{ width: 130 }}>
            {[0, 25, 50, 75, 100].map((pct, i) => (
              <div
                key={i}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ top: `${pct}%`, width: 130, height: 160 }}
              >
                <DotLottieReact
                  src="https://lottie.host/0bcc69c8-2106-422e-b3ac-535ba93d2845/Jah7Yhr8qI.lottie"
                  loop autoplay
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ─ TITLE ─ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
          className="absolute top-0 inset-x-0 z-30 pt-14 flex justify-center pointer-events-none"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            The Clash.
          </h1>
        </motion.div>

        {/* ─ BOTTOM INFO ROW ─ */}
        <div className="absolute bottom-0 inset-x-0 z-30 pb-28 px-5">
          <div className="flex items-end justify-between gap-2">
            {/* Home */}
            <motion.div
              initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.7, ease: EASE }}
              className="space-y-0.5 min-w-0"
            >
              <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/60 truncate">{NEXT_MATCH.home.manager}</p>
              <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-white"
                style={{ textShadow: `0 0 24px ${NEXT_MATCH.home.color}, 0 2px 4px rgba(0,0,0,0.8)` }}>
                {NEXT_MATCH.home.team}
              </h2>
              <p className="text-[9px] font-mono text-white/60 uppercase tracking-widest truncate">{NEXT_MATCH.home.captain}</p>
            </motion.div>

            {/* Center: venue + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6, ease: EASE }}
              className="flex flex-col items-center gap-2 flex-shrink-0"
            >
              <p className="text-[8px] font-mono text-white/35 uppercase tracking-widest text-center whitespace-nowrap">{NEXT_MATCH.venue}</p>
              <button
                onClick={() => setMatchCenterOpen(true)}
                className="px-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/25 text-white rounded-full text-[11px] font-bold tracking-tight hover:bg-white/20 transition-all duration-500 group whitespace-nowrap"
              >
                Match Center <ArrowRight className="inline-block ml-1 w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>

            {/* Away */}
            <motion.div
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.7, ease: EASE }}
              className="text-right space-y-0.5 min-w-0"
            >
              <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/60 truncate">{NEXT_MATCH.away.manager}</p>
              <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-white"
                style={{ textShadow: `0 0 24px ${NEXT_MATCH.away.color}, 0 2px 4px rgba(0,0,0,0.8)` }}>
                {NEXT_MATCH.away.team}
              </h2>
              <p className="text-[9px] font-mono text-white/60 uppercase tracking-widest truncate">{NEXT_MATCH.away.captain}</p>
            </motion.div>
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
