import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, Filter, ArrowRight } from 'lucide-react'
import { MATCHES } from '../../data/matches'
import type { Match } from '../../data/matches'
import Modal from '../Modal'
import MatchDetailScreen from '../screens/MatchDetailScreen'


const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function FixturesTab() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all')
  const [showFilter, setShowFilter] = useState(false)
  const [selected, setSelected] = useState<Match | null>(null)

  const filtered = MATCHES.filter(m =>
    (filter === 'all' || m.status === filter) && m.id <= 20
  )

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex items-end justify-between border-b border-white/5 pb-8"
      >
        <div>
          <h1 className="text-5xl font-bold tracking-tighter text-gradient leading-tight">Fixtures.</h1>
          <p className="text-foreground-muted mt-2 font-mono text-[10px] uppercase tracking-[0.2em]">
            Season 1 Schedule <span className="text-foreground-subtle/20 mx-2">|</span> 20 League · 3 Playoff
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all"
          >
            <Filter className="w-4 h-4 text-accent" />
            <span className="text-xs font-bold tracking-tight text-foreground-subtle uppercase">
              {filter === 'all' ? 'Filter' : filter}
            </span>
            <ChevronDown className={`w-4 h-4 text-foreground-muted transition-transform duration-300 ${showFilter ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showFilter && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="absolute right-0 top-full mt-2 linear-glass p-1.5 min-w-[160px] z-20 bg-bg-base/95 shadow-2xl border-white/10"
              >
                {(['all', 'upcoming', 'completed'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => { setFilter(f); setShowFilter(false) }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl transition-all uppercase tracking-widest ${
                      filter === f ? 'text-accent bg-accent/10' : 'text-foreground-muted hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Match List */}
      <div className="space-y-px bg-white/[0.02] border border-white/[0.03] rounded-[2rem] overflow-hidden">
        {filtered.map((match, i) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.6, ease: EASE }}
            className="group relative bg-bg-base hover:bg-white/[0.02] transition-all duration-500"
          >
            <div className="px-4 py-5 flex items-center gap-2">
              {/* Match number */}
              <div className="shrink-0 w-7 text-center">
                <span className="text-[9px] font-black text-foreground-muted/30 font-mono">M{match.id}</span>
              </div>

              {/* Matchup */}
              <div className="flex-1 flex flex-row items-center gap-3 md:gap-16">
                {/* Home */}
                <div className="flex items-center gap-2 md:gap-6 flex-1 justify-end">
                  <div className="text-right hidden md:block">
                    <p className="text-xl font-bold tracking-tight uppercase">{match.home.team}</p>
                    <p className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">{match.home.manager}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 md:hidden">
                    <div className="w-16 h-16 flex items-center justify-center transition-transform group-hover:scale-110">
                      {match.home.logo
                        ? <img src={match.home.logo} alt={match.home.team} className="w-full h-full object-contain" />
                        : <span className="text-xs font-bold">{match.home.team}</span>
                      }
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tight">{match.home.team}</span>
                  </div>
                  <div className="w-24 h-24 rounded-2xl hidden md:flex items-center justify-center transition-transform group-hover:scale-110">
                    {match.home.logo
                      ? <img src={match.home.logo} alt={match.home.team} className="w-full h-full object-contain" />
                      : <span className="text-sm font-bold">{match.home.team}</span>
                    }
                  </div>
                </div>

                {/* VS */}
                <div className="relative flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 bg-accent/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <span className="text-sm font-black text-white/50 italic relative z-10 group-hover:text-accent transition-colors">VS</span>
                </div>

                {/* Away */}
                <div className="flex items-center gap-2 md:gap-6 flex-1">
                  <div className="w-24 h-24 rounded-2xl hidden md:flex items-center justify-center transition-transform group-hover:scale-110">
                    {match.away.logo
                      ? <img src={match.away.logo} alt={match.away.team} className="w-full h-full object-contain" />
                      : <span className="text-sm font-bold">{match.away.team}</span>
                    }
                  </div>
                  <div className="flex flex-col items-center gap-1 md:hidden">
                    <div className="w-16 h-16 flex items-center justify-center transition-transform group-hover:scale-110">
                      {match.away.logo
                        ? <img src={match.away.logo} alt={match.away.team} className="w-full h-full object-contain" />
                        : <span className="text-xs font-bold">{match.away.team}</span>
                      }
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tight">{match.away.team}</span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xl font-bold tracking-tight uppercase">{match.away.team}</p>
                    <p className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">{match.away.manager}</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                {match.status === 'live' && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/5">
                    <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400">Live</span>
                  </div>
                )}
                {match.status === 'completed' && (
                  <span className="text-[9px] font-mono uppercase tracking-widest text-foreground-muted/50">FT</span>
                )}
                {match.status === 'upcoming' && (
                  <span className="text-[9px] font-mono uppercase tracking-widest text-foreground-muted/50">Soon</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 pb-3 flex justify-end">
              <button
                onClick={() => setSelected(match)}
                className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-1"
              >
                Details <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-foreground-muted font-mono text-xs uppercase tracking-widest">No matches found</p>
        </div>
      )}

      {/* Modals */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Match ${selected.id} · ${selected.home.team} vs ${selected.away.team}` : ''}
        fullScreen
      >
        {selected && <MatchDetailScreen match={selected} />}
      </Modal>
    </div>
  )
}
