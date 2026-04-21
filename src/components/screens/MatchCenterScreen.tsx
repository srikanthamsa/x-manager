import { motion } from 'motion/react'
import { MapPin, Users, Swords } from 'lucide-react'
import type { Match } from '../../data/matches'
import { TEAM_PLAYERS } from '../../data/matches'

const EASE = [0.16, 1, 0.3, 1]

interface Props { match: Match }

export default function MatchCenterScreen({ match }: Props) {
  const homePlayers = TEAM_PLAYERS[match.home.team] ?? []
  const awayPlayers = TEAM_PLAYERS[match.away.team] ?? []

  return (
    <div className="p-6 space-y-8 pb-10">
      {/* Teams hero */}
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.05]"
        style={{ background: `linear-gradient(135deg, ${match.home.color}22, transparent 50%, ${match.away.color}22)` }}>
        <div className="flex items-center justify-between px-6 py-8">
          <div className="flex flex-col items-center gap-3 flex-1">
            {match.home.logo
              ? <img src={match.home.logo} alt={match.home.team} className="w-20 h-20 object-contain" />
              : <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-black">{match.home.team}</div>
            }
            <div className="text-center">
              <p className="font-bold tracking-tight text-base">{match.home.fullName}</p>
              <p className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">{match.home.manager}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 px-4">
            <span className="text-xs font-black text-white/20 tracking-widest">VS</span>
            <div className={`px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest border ${
              match.status === 'live'
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                : match.status === 'completed'
                ? 'bg-white/[0.04] border-white/[0.08] text-foreground-muted'
                : 'bg-accent/10 border-accent/20 text-accent'
            }`}>
              {match.status === 'upcoming' ? 'Upcoming' : match.status === 'live' ? '● Live' : 'Final'}
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 flex-1">
            {match.away.logo
              ? <img src={match.away.logo} alt={match.away.team} className="w-20 h-20 object-contain" />
              : <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-black">{match.away.team}</div>
            }
            <div className="text-center">
              <p className="font-bold tracking-tight text-base">{match.away.fullName}</p>
              <p className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">{match.away.manager}</p>
            </div>
          </div>
        </div>

        {match.result && (
          <div className="text-center pb-4">
            <span className="text-sm font-semibold text-foreground-subtle">{match.result}</span>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-6 text-[11px] font-mono text-foreground-muted uppercase tracking-widest">
        <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{match.venue}</span>
        <span className="flex items-center gap-1.5"><Swords className="w-3 h-3" />Match {match.id}</span>
      </div>

      {/* Probable XIs */}
      {match.status === 'upcoming' && homePlayers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, ease: EASE }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-accent/60" />
            <h3 className="text-sm font-bold tracking-tight">Probable Playing XIs</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[{ team: match.home, players: homePlayers }, { team: match.away, players: awayPlayers }].map(({ team, players }) => (
              <div key={team.team} className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  {team.logo && <img src={team.logo} alt={team.team} className="w-6 h-6 object-contain" />}
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: team.color }}>{team.team}</span>
                </div>
                <div className="space-y-2">
                  {players.slice(0, 11).map((p, i) => (
                    <div key={p.name} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[9px] font-mono text-foreground-muted/40 w-4 shrink-0">{i + 1}</span>
                        <span className="text-xs font-medium truncate">{p.name}</span>
                      </div>
                      <span className="text-[9px] font-mono text-foreground-muted/50 shrink-0">{p.role.slice(0, 3).toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* H2H */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, ease: EASE }}
        className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-5 space-y-4"
      >
        <h3 className="text-sm font-bold tracking-tight">Head to Head</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: match.home.team, value: '–', color: match.home.color },
            { label: 'Draws', value: '–', color: undefined },
            { label: match.away.team, value: '–', color: match.away.color },
          ].map(({ label, value, color }) => (
            <div key={label} className="space-y-1">
              <p className="text-2xl font-black" style={{ color: color ?? undefined }}>{value}</p>
              <p className="text-[9px] font-mono text-foreground-muted uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-foreground-muted text-center font-mono">First time these franchises meet this season</p>
      </motion.div>
    </div>
  )
}
