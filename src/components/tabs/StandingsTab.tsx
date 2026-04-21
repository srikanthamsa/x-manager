import { motion } from 'motion/react'
import { Info } from 'lucide-react'
import { TEAMS } from '../../data/teams'

interface TeamStanding {
  rank: number
  team: string
  fullName: string
  manager: string
  color: string
  logo: string
  played: number
  won: number
  lost: number
  nrr: string
  points: number
}

const STANDINGS: TeamStanding[] = [
  { rank: 1, team: TEAMS.CSK.shortName, fullName: TEAMS.CSK.name, manager: TEAMS.CSK.manager, color: TEAMS.CSK.color, logo: TEAMS.CSK.logo, played: 0, won: 0, lost: 0, nrr: '+0.000', points: 0 },
  { rank: 2, team: TEAMS.RCB.shortName, fullName: TEAMS.RCB.name, manager: TEAMS.RCB.manager, color: TEAMS.RCB.color, logo: TEAMS.RCB.logo, played: 0, won: 0, lost: 0, nrr: '+0.000', points: 0 },
  { rank: 3, team: TEAMS.KKR.shortName, fullName: TEAMS.KKR.name, manager: TEAMS.KKR.manager, color: TEAMS.KKR.color, logo: TEAMS.KKR.logo, played: 0, won: 0, lost: 0, nrr: '+0.000', points: 0 },
  { rank: 4, team: TEAMS.SRH.shortName, fullName: TEAMS.SRH.name, manager: TEAMS.SRH.manager, color: TEAMS.SRH.color, logo: TEAMS.SRH.logo, played: 0, won: 0, lost: 0, nrr: '+0.000', points: 0 },
  { rank: 5, team: TEAMS.MI.shortName, fullName: TEAMS.MI.name, manager: TEAMS.MI.manager, color: TEAMS.MI.color, logo: TEAMS.MI.logo, played: 0, won: 0, lost: 0, nrr: '+0.000', points: 0 },
]

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function StandingsTab() {
  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex flex-col items-center text-center space-y-4"
      >
        <div>
          <h1 className="text-5xl font-bold tracking-tighter text-gradient leading-tight">
            Leaderboard.
          </h1>
          <p className="text-foreground-muted mt-2 font-mono text-[10px] uppercase tracking-[0.2em]">
            Season 1 <span className="text-foreground-subtle/20 mx-2">|</span> Power Rankings
          </p>
        </div>
      </motion.div>

      {/* Mobile Cards */}
      <div className="md:hidden bg-white/[0.02] border border-white/[0.03] rounded-[2rem] overflow-hidden">
        {STANDINGS.map((team, i) => (
          <motion.div
            key={team.team}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: EASE }}
            className="relative px-4 py-4 border-b border-white/[0.03] last:border-0"
            style={{ background: `linear-gradient(to right, ${team.color}44 0%, ${team.color}00 50%)` }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: team.color }} />

            <div className="flex items-center gap-3 pl-2">
              <div className="flex flex-col items-center w-10 shrink-0">
                <span className={`text-xl font-black tabular-nums ${i < 3 ? 'text-accent' : 'text-foreground-muted/40'}`}>
                  {team.rank.toString().padStart(2, '0')}
                </span>
                {i < 3 && <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] mt-1" />}
              </div>

              <div className="w-12 h-12 shrink-0">
                <img src={team.logo} alt={team.team} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-base font-bold tracking-tight text-foreground block truncate">{team.fullName}</span>
                <span className="text-xs text-foreground-muted font-mono uppercase tracking-widest block truncate">{team.manager}</span>
              </div>

              <div className="text-right shrink-0">
                <span className="text-4xl font-black text-white tabular-nums">{team.points}</span>
                <span className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest block">pts</span>
              </div>
            </div>

            <div className="flex items-center gap-5 mt-3 pt-3 border-t border-white/[0.03] ml-16">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono text-foreground-muted uppercase tracking-widest">P</span>
                <span className="text-base font-bold text-foreground-subtle tabular-nums">{team.played}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono text-foreground-muted uppercase tracking-widest">W</span>
                <span className="text-base font-bold text-emerald-400 tabular-nums">{team.won}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono text-foreground-muted uppercase tracking-widest">L</span>
                <span className="text-base font-bold text-red-400/60 tabular-nums">{team.lost}</span>
              </div>
              <span className={`ml-auto text-xs font-mono px-2.5 py-1 rounded border ${
                team.nrr.startsWith('+') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/[0.03] border-white/5 text-foreground-muted'
              }`}>
                {team.nrr}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white/[0.02] border border-white/[0.03] rounded-[2rem] overflow-hidden">
        <div className="grid grid-cols-[60px_1fr_50px_50px_50px_90px_90px] gap-4 px-10 py-6 border-b border-white/5 text-[10px] font-mono uppercase tracking-[0.2em] text-foreground-muted bg-white/[0.01]">
          <span>Rank</span>
          <span>Franchise</span>
          <span className="text-center">P</span>
          <span className="text-center">W</span>
          <span className="text-center">L</span>
          <span className="text-center">NRR</span>
          <span className="text-right pr-4">Points</span>
        </div>

        <div className="flex flex-col">
          {STANDINGS.map((team, i) => (
            <motion.div
              key={team.team}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: EASE }}
              className="grid grid-cols-[60px_1fr_50px_50px_50px_90px_90px] gap-4 px-10 py-6 items-center border-b border-white/[0.02] last:border-0 hover:bg-white/[0.03] transition-all group relative"
              style={{ background: i < 3 ? `linear-gradient(to right, ${team.color}18, transparent 40%)` : undefined }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: team.color }} />

              <div className="flex items-center gap-4">
                <span className={`text-xl font-bold tracking-tight ${i < 3 ? 'text-accent' : 'text-foreground-muted/40'} group-hover:scale-110 transition-transform`}>
                  {team.rank.toString().padStart(2, '0')}
                </span>
                {i < 3 && <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />}
              </div>

              <div className="flex items-center gap-5 min-w-0">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                  <img src={team.logo} alt={team.team} className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <span className="text-xl font-bold tracking-tight text-foreground block truncate">{team.team}</span>
                  <span className="text-[10px] text-foreground-muted font-mono uppercase tracking-widest block truncate mt-0.5">{team.manager}</span>
                </div>
              </div>

              <span className="text-base font-bold text-foreground-subtle text-center tabular-nums">{team.played}</span>
              <span className="text-base font-bold text-emerald-400 text-center tabular-nums">{team.won}</span>
              <span className="text-base font-bold text-red-400/60 text-center tabular-nums">{team.lost}</span>
              <div className="flex justify-center">
                <span className={`text-[11px] font-mono px-2.5 py-1 rounded-md border ${
                  team.nrr.startsWith('+') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/[0.03] border-white/5 text-foreground-muted'
                }`}>
                  {team.nrr}
                </span>
              </div>
              <div className="text-right pr-4">
                <span className="text-3xl font-black text-white group-hover:text-accent transition-colors tabular-nums">{team.points}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend & Info */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-4 md:px-10">
        <div className="flex items-center gap-4 text-[10px] font-mono text-foreground-muted uppercase tracking-widest">
          <Info className="w-4 h-4 text-accent" />
          <span>Top 3 teams qualify for playoffs</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">Win (+2)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">Loss (0)</span>
          </div>
        </div>
      </div>

    </div>
  )
}
