import { motion } from 'motion/react'
import { Crown, Shield, Star, Trophy } from 'lucide-react'
import trophyImg from '../../assets/trophy.png'
import { MATCHES } from '../../data/matches'

const EASE = [0.16, 1, 0.3, 1]

interface Manager {
  name: string
  shortName: string
  logo: string
  color: string
  manager: string
  tagline: string
  trophies: number
  runnerUp: number
  mvpAwards: number
}

interface Props { manager: Manager }

export default function FranchiseHistoryScreen({ manager }: Props) {
  const teamMatches = MATCHES.filter(
    m => m.status === 'completed' && (m.home.team === manager.shortName || m.away.team === manager.shortName)
  )

  return (
    <div className="p-6 space-y-8 pb-10">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: EASE }}
        className="rounded-2xl overflow-hidden border border-white/[0.05] p-6 flex flex-col items-center gap-4 text-center"
        style={{ background: `radial-gradient(circle at top, ${manager.color}20, transparent 60%)` }}
      >
        <img src={manager.logo} alt={manager.shortName} className="w-24 h-24 object-contain" />
        <div>
          <h2 className="text-xl font-black tracking-tight">{manager.manager}</h2>
          <p className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest mt-1">{manager.shortName} · Franchise Manager</p>
          <p className="text-xs text-accent/60 italic mt-2">"{manager.tagline}"</p>
        </div>
      </motion.div>

      {/* Accolades */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Crown, label: 'Titles', value: manager.trophies, color: 'text-amber-400' },
          { icon: Shield, label: 'Finals', value: manager.runnerUp, color: 'text-foreground-subtle' },
          { icon: Star, label: 'MVPs', value: manager.mvpAwards, color: 'text-emerald-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 flex flex-col items-center gap-2">
            <Icon className={`w-5 h-5 ${color} opacity-60`} />
            <span className="text-2xl font-black tabular-nums">{value}</span>
            <span className="text-[9px] font-mono text-foreground-muted uppercase tracking-widest">{label}</span>
          </div>
        ))}
      </div>

      {/* Trophy shelf */}
      {manager.trophies > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400/60" /> Trophy Cabinet
          </h3>
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: manager.trophies }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, ease: EASE }}
                className="flex flex-col items-center gap-1"
              >
                <img src={trophyImg} alt="trophy" className="w-16 h-16 object-contain drop-shadow-[0_0_12px_rgba(255,200,0,0.4)]" />
                <span className="text-[9px] font-mono text-foreground-muted uppercase tracking-widest">S{i + 1}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Match history */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold">Season Record</h3>
        {teamMatches.length === 0 ? (
          <p className="text-sm text-foreground-muted font-mono text-center py-4">No matches played yet</p>
        ) : (
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl overflow-hidden">
            {teamMatches.map(m => {
              const isHome = m.home.team === manager.shortName
              const opponent = isHome ? m.away : m.home
              const won = m.winner === manager.shortName
              return (
                <div key={m.id} className="flex items-center gap-4 px-4 py-3.5 border-b border-white/[0.03] last:border-0">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black ${won ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {won ? 'W' : 'L'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">vs {opponent.fullName}</p>
                    <p className="text-[10px] font-mono text-foreground-muted">{m.result}</p>
                  </div>
                  <span className="text-[10px] font-mono text-foreground-muted/40">M{m.id}</span>
                </div>
              )
            })}
          </div>
        )}
        {teamMatches.length > 0 && (
          <div className="flex items-center gap-4 px-2 text-[10px] font-mono text-foreground-muted">
            <span>{teamMatches.filter(m => m.winner === manager.shortName).length}W</span>
            <span>{teamMatches.filter(m => m.winner && m.winner !== manager.shortName).length}L</span>
            <span className="ml-auto">{teamMatches.length} played</span>
          </div>
        )}
      </div>
    </div>
  )
}
