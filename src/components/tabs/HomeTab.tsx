import { useState, useMemo } from 'react'
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

/** Pick a random player photo between the two available for the team. */
function pickRandomPhoto(team: typeof NEXT_MATCH.home) {
  const useSecond = Math.random() > 0.5;
  if (useSecond && team.captainPhoto2) {
    return { 
      photo: team.captainPhoto2, 
      facing: team.captainFacing2 ?? 'right',
      name: team.captain2 ?? team.captain
    }
  }
  return { 
    photo: team.captainPhoto!, 
    facing: team.captainFacing ?? 'right',
    name: team.captain
  }
}

/** Determine a dynamic and contextual title for the match based on rivalries and current standings. */
function getMatchTitle(homeTeam: string, awayTeam: string, matches: Match[]): string {
  // calculate points
  const points: Record<string, number> = {};
  Object.keys(TEAMS).forEach(k => points[k] = 0);
  
  matches.forEach(m => {
    if (m.status === 'completed' && m.winner) {
      points[m.winner] = (points[m.winner] || 0) + 2;
    }
  });
  
  const sortedTeams = Object.keys(TEAMS).sort((a, b) => points[b] - points[a]);
  const homeRank = sortedTeams.indexOf(homeTeam);
  const awayRank = sortedTeams.indexOf(awayTeam);
  
  const titles: string[] = [];
  const t1 = [homeTeam, awayTeam].sort().join('-');
  
  // Specific Internet/Meme Rivalries & Star Power Matchups
  if (t1 === 'CSK-RCB') titles.push('Southern Derby', 'Royal Showdown', 'Thala vs King', 'Dhoni vs Kohli');
  if (t1 === 'KKR-SRH') titles.push('Shoaib vs Bumrah', 'Gayle vs Hardik', 'Pace Battle', 'Cummins vs Akhtar');
  if (t1 === 'MI-RCB') titles.push('Star Wars', 'Heavyweight Clash', 'King vs Hitman', 'Afridi vs Kapil Dev');
  if (t1 === 'CSK-KKR') titles.push('Champion Clash', 'Purple & Gold', 'Thala vs Kung Fu', 'Dhoni vs Cummins');
  if (t1 === 'KKR-MI') titles.push('East vs West', 'Hitman vs Hardik', 'Rohit vs Bumrah', 'Kapil vs Cummins');
  
  // Position based
  if (homeRank < 2 && awayRank < 2) {
    titles.push('Top of the Table', 'For Supremacy');
  } else if (homeRank > 2 && awayRank > 2) {
    titles.push('Survival Fight', 'Do or Die');
  } else if ((homeRank === 0 && awayRank === sortedTeams.length - 1) || (homeRank === sortedTeams.length - 1 && awayRank === 0)) {
    titles.push('David vs Goliath', 'Giant Killers?');
  }
  
  // Generics (including original)
  titles.push('The Clash', 'The Showdown', 'Blockbuster', 'Face-Off', 'Epic Encounter');
  
  return titles[Math.floor(Math.random() * titles.length)] + '.';
}

export default function HomeTab() {
  const [matchCenterOpen, setMatchCenterOpen] = useState(false)
  const [allMatchesOpen, setAllMatchesOpen] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  const { photo: homePhoto, facing: homeFacing, name: homeRawName } = useMemo(() => pickRandomPhoto(NEXT_MATCH.home), [])
  const { photo: awayPhoto, facing: awayFacing, name: awayRawName } = useMemo(() => pickRandomPhoto(NEXT_MATCH.away), [])
  const matchTitle = useMemo(() => getMatchTitle(NEXT_MATCH.home.team, NEXT_MATCH.away.team, MATCHES), [])

  const handleSelectMatch = (match: Match) => {
    setAllMatchesOpen(false)
    setSelectedMatch(match)
  }

  const splitName = (name?: string) => {
    if (!name) return { first: '', last: '' }
    const parts = name.trim().split(' ')
    const last = parts.pop()!
    return { first: parts.join(' '), last }
  }
  const homeName = splitName(homeRawName)
  const awayName = splitName(awayRawName)

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* ── Hero — cinematic match poster ── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative overflow-hidden flex-shrink-0 h-[55vh] md:h-screen"
        style={{ minHeight: 500, width: '100vw', marginLeft: 'calc(-50vw + 50%)', marginTop: '-3rem' }}
      >
        {/* ─ DARK BASE ─ */}
        <div className="absolute inset-0 bg-[#060608]" />

        {/* ─ GREY SMOKE — cinematic depth behind players ─ */}
        <div
          className="absolute inset-0 pointer-events-none z-[8]"
          style={{
            background: `
              radial-gradient(ellipse 50% 70% at 22% 80%, rgba(160,160,175,0.22) 0%, transparent 65%),
              radial-gradient(ellipse 50% 70% at 78% 80%, rgba(160,160,175,0.22) 0%, transparent 65%),
              radial-gradient(ellipse 60% 40% at 50% 100%, rgba(120,120,140,0.15) 0%, transparent 60%)
            `
          }}
        />

        {/* ─ ATMOSPHERIC SMOKE — home (left), full left-edge coverage ─ */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 2.5 }}
          style={{
            background: `
              linear-gradient(to right, ${NEXT_MATCH.home.color}55 0%, transparent 52%),
              radial-gradient(ellipse 60% 75% at 10% 30%, ${NEXT_MATCH.home.color}50 0%, transparent 70%),
              radial-gradient(ellipse 55% 65% at 2% 85%, ${NEXT_MATCH.home.color}65 0%, transparent 60%)
            `
          }}
        />
        {/* ─ ATMOSPHERIC SMOKE — away (right), full right-edge coverage ─ */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 2.5 }}
          style={{
            background: `
              linear-gradient(to left, ${NEXT_MATCH.away.color}88 0%, ${NEXT_MATCH.away.color}55 20%, transparent 52%),
              radial-gradient(ellipse 60% 75% at 100% 30%, ${NEXT_MATCH.away.color}66 0%, transparent 65%),
              radial-gradient(ellipse 55% 65% at 100% 85%, ${NEXT_MATCH.away.color}88 0%, transparent 55%),
              radial-gradient(ellipse 30% 100% at 100% 50%, ${NEXT_MATCH.away.color}55 0%, transparent 70%)
            `
          }}
        />

        {/* ─ INTENSE DRAMATIC SMOKE / GLOW ─ */}
        <motion.div
          className="absolute bottom-0 left-[5%] w-[40%] h-[70%] z-[9] pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.85, scale: 1 }}
          transition={{ delay: 0.4, duration: 2.5 }}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${NEXT_MATCH.home.color} 0%, ${NEXT_MATCH.home.color}bb 40%, transparent 70%)`,
            filter: 'blur(35px)',
          }}
        />
        <motion.div
          className="absolute bottom-0 right-[5%] w-[40%] h-[70%] z-[9] pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.85, scale: 1 }}
          transition={{ delay: 0.5, duration: 2.5 }}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${NEXT_MATCH.away.color} 0%, ${NEXT_MATCH.away.color}bb 40%, transparent 70%)`,
            filter: 'blur(35px)',
          }}
        />

        {/* ─ HOME PLAYER — proportional width fill, no height-stretch ─ */}
        <div className="absolute bottom-0 left-0 w-1/2 z-10 overflow-hidden" style={{ height: '92%', maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}>
          {homePhoto && (
            <motion.img
              src={homePhoto}
              alt={homeRawName ?? NEXT_MATCH.home.team}
              initial={{ opacity: 0, y: 40, scaleX: homeFacing === 'left' ? -1 : 1 }}
              animate={{ opacity: 1, y: 0, scaleX: homeFacing === 'left' ? -1 : 1 }}
              transition={{ delay: 0.5, duration: 1.2, ease: EASE }}
              className="absolute bottom-0 left-0"
              style={{ width: '100%', height: 'auto', mixBlendMode: 'luminosity' }}
            />
          )}
        </div>

        {/* ─ AWAY PLAYER — proportional width fill, no height-stretch ─ */}
        <div className="absolute bottom-0 right-0 w-1/2 z-10 overflow-hidden" style={{ height: '92%', maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}>
          {awayPhoto && (
            <motion.img
              src={awayPhoto}
              alt={awayRawName ?? NEXT_MATCH.away.team}
              initial={{ opacity: 0, y: 40, scaleX: awayFacing === 'right' ? -1 : 1 }}
              animate={{ opacity: 1, y: 0, scaleX: awayFacing === 'right' ? -1 : 1 }}
              transition={{ delay: 0.6, duration: 1.2, ease: EASE }}
              className="absolute bottom-0 left-0"
              style={{ width: '100%', height: 'auto', mixBlendMode: 'luminosity' }}
            />
          )}
        </div>

        {/* ─ COLOR TINTS — gradient fades so colors blend at center ─ */}
        <div
          className="absolute inset-0 z-[11] pointer-events-none"
          style={{
            background: `linear-gradient(to right, ${NEXT_MATCH.home.color}80 0%, ${NEXT_MATCH.home.color}55 35%, transparent 58%)`,
            mixBlendMode: 'color',
          }}
        />
        <div
          className="absolute inset-0 z-[11] pointer-events-none"
          style={{
            background: `linear-gradient(to left, ${NEXT_MATCH.away.color}cc 0%, ${NEXT_MATCH.away.color}88 18%, ${NEXT_MATCH.away.color}44 42%, transparent 60%)`,
            mixBlendMode: 'color',
          }}
        />

        {/* ─ CENTER BLEND — dark vignette softens where colors meet ─ */}
        <div
          className="absolute inset-0 pointer-events-none z-[12]"
          style={{ background: 'linear-gradient(to right, transparent 30%, rgba(0,0,0,0.45) 50%, transparent 70%)' }}
        />

        {/* ─ TOP FADE ─ */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/90 via-black/40 to-transparent z-20 pointer-events-none" />

        {/* ─ BOTTOM FADE ─ */}
        <div className="absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />

        {/* ─ HEADER TEXT ─ */}
        <motion.div
          className="absolute top-0 inset-x-0 z-30 pt-10 flex flex-col items-center pointer-events-none"
          initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
        >
          <p className="text-[8px] font-mono text-white/35 uppercase tracking-[0.35em] mb-3">
            Gamers United League · Season 1
          </p>
          <div className="flex items-center gap-4">
            <motion.img
              src={NEXT_MATCH.home.logo} alt={NEXT_MATCH.home.team}
              className="object-contain drop-shadow-[0_0_16px_rgba(255,255,255,0.15)] pointer-events-none"
              style={{ width: 44, height: 44 }}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55, duration: 0.8, ease: EASE }}
            />
            <h1
              className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-none text-center"
              style={{ textShadow: '0 4px 40px rgba(0,0,0,0.95)' }}
            >
              {matchTitle}
            </h1>
            <motion.img
              src={NEXT_MATCH.away.logo} alt={NEXT_MATCH.away.team}
              className="object-contain drop-shadow-[0_0_16px_rgba(255,255,255,0.15)] pointer-events-none"
              style={{ width: 44, height: 44 }}
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65, duration: 0.8, ease: EASE }}
            />
          </div>
          <p className="text-[8px] font-mono text-white/25 uppercase tracking-[0.4em] mt-2">
            Two Legacies. One Stage.
          </p>
        </motion.div>

        {/* ─ BOTTOM INFO ROW ─ */}
        <div className="absolute bottom-0 inset-x-0 z-30 pb-5 px-5">
          <div className="flex items-end justify-between gap-2">

            {/* Home player name */}
            <motion.div
              initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.95, duration: 0.7, ease: EASE }}
              className="min-w-0"
            >
              <p className="text-[8px] font-mono uppercase tracking-[0.25em] text-white/40 truncate mb-0.5">
                {NEXT_MATCH.home.manager}
              </p>
              {homeName.first && (
                <p className="text-sm font-light text-white/65 leading-none tracking-wide">{homeName.first}</p>
              )}
              <p
                className="text-3xl font-black tracking-tight text-white leading-none"
                style={{ textShadow: `0 0 20px ${NEXT_MATCH.home.color}88, 0 2px 4px rgba(0,0,0,0.9)` }}
              >
                {homeName.last}
              </p>
              <p
                className="text-[8px] font-mono uppercase tracking-widest mt-1"
                style={{ color: NEXT_MATCH.home.color, textShadow: `0 0 10px ${NEXT_MATCH.home.color}` }}
              >
                {NEXT_MATCH.home.team}
              </p>
            </motion.div>

            {/* Away player name */}
            <motion.div
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.05, duration: 0.7, ease: EASE }}
              className="text-right min-w-0"
            >
              <p className="text-[8px] font-mono uppercase tracking-[0.25em] text-white/40 truncate mb-0.5">
                {NEXT_MATCH.away.manager}
              </p>
              {awayName.first && (
                <p className="text-sm font-light text-white/65 leading-none tracking-wide">{awayName.first}</p>
              )}
              <p
                className="text-3xl font-black tracking-tight text-white leading-none"
                style={{ textShadow: `0 0 20px ${NEXT_MATCH.away.color}88, 0 2px 4px rgba(0,0,0,0.9)` }}
              >
                {awayName.last}
              </p>
              <p
                className="text-[8px] font-mono uppercase tracking-widest mt-1"
                style={{ color: NEXT_MATCH.away.color, textShadow: `0 0 10px ${NEXT_MATCH.away.color}` }}
              >
                {NEXT_MATCH.away.team}
              </p>
            </motion.div>

          </div>
        </div>
      </motion.section>

      {/* ── Match Center CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6, ease: EASE }}
        className="flex flex-col items-center gap-2 py-6 px-4"
      >
        <p className="text-[8px] font-mono text-white/30 uppercase tracking-[0.3em]">{NEXT_MATCH.venue}</p>
        <button
          onClick={() => setMatchCenterOpen(true)}
          className="w-full max-w-sm py-4 bg-white text-black rounded-2xl font-bold text-sm tracking-tight hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.08)]"
        >
          Match Center <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* ── Rest of page ── */}
      <div className="space-y-24">

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

      </div>{/* end space-y-24 */}

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
