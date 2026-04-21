import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Trophy } from 'lucide-react'
import { MATCHES, type Match } from '../../data/matches'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface Props {
  onSelectMatch: (match: Match) => void
}

type Filter = 'all' | 'upcoming' | 'completed'

const PLAYOFF_IDS = [21, 22, 23]
const PLAYOFF_LABELS: Record<number, string> = { 21: 'Qualifier 1', 22: 'Eliminator', 23: 'Grand Final' }

export default function AllMatchesScreen({ onSelectMatch }: Props) {
  const [filter, setFilter] = useState<Filter>('all')
  const filtered = MATCHES.filter(m => filter === 'all' || m.status === filter)

  return (
    <div className="pb-10">
      {/* Filter */}
      <div className="flex gap-1.5 p-4 border-b border-white/[0.05]">
        {(['all', 'upcoming', 'completed'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
              filter === f ? 'bg-accent text-white' : 'bg-white/[0.04] text-foreground-muted hover:bg-white/[0.06]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* League matches */}
      <div className="p-4 space-y-1">
        {filtered.filter(m => !PLAYOFF_IDS.includes(m.id)).map((match, i) => (
          <motion.button
            key={match.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03, ease: EASE }}
            onClick={() => onSelectMatch(match)}
            className="w-full text-left flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/[0.03] transition-colors group"
          >
            <span className="text-[10px] font-mono text-foreground-muted/40 w-12 shrink-0 text-right">M{match.id}</span>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                {match.home.logo && <img src={match.home.logo} alt={match.home.team} className="w-7 h-7 object-contain" />}
                <span className="text-sm font-bold">{match.home.team}</span>
              </div>
              <span className="text-[9px] font-mono text-foreground-muted/30 mx-1">vs</span>
              <div className="flex items-center gap-1.5">
                {match.away.logo && <img src={match.away.logo} alt={match.away.team} className="w-7 h-7 object-contain" />}
                <span className="text-sm font-bold">{match.away.team}</span>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              {match.result
                ? <span className="text-[10px] font-mono text-foreground-muted hidden sm:block truncate max-w-[120px]">{match.result}</span>
                : null
              }
              <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                match.status === 'completed'
                  ? 'bg-white/[0.03] border-white/[0.06] text-foreground-muted'
                  : 'bg-accent/10 border-accent/20 text-accent'
              }`}>
                {match.status === 'completed' ? 'Done' : 'TBD'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-foreground-muted/30 group-hover:text-accent transition-colors" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Playoffs */}
      {filter !== 'completed' && (
        <div className="mx-4 mt-4 border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400/60" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-foreground-muted">Playoffs</span>
          </div>
          {MATCHES.filter(m => PLAYOFF_IDS.includes(m.id)).map(match => (
            <div key={match.id} className="flex items-center gap-4 px-4 py-3.5 border-b border-white/[0.04] last:border-0">
              <span className="text-[10px] font-mono text-foreground-muted/40 w-12 shrink-0 text-right">M{match.id}</span>
              <div className="flex-1">
                <p className="text-sm font-bold">{PLAYOFF_LABELS[match.id]}</p>
                <p className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">Teams TBD</p>
              </div>
              <span className="text-[9px] font-mono text-foreground-muted/30 uppercase tracking-widest">Locked</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
