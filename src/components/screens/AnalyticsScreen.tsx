import { motion } from 'motion/react'
import { TrendingUp, Zap, Target } from 'lucide-react'
import type { Match } from '../../data/matches'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface Props { match: Match }

interface StatRow { label: string; home: number | string; away: number | string; unit?: string }

const DUMMY_STATS: Record<string, StatRow[]> = {
  KKR_SRH: [
    { label: 'Run Rate', home: 9.35, away: 8.75 },
    { label: 'Boundaries', home: 22, away: 18 },
    { label: 'Sixes', home: 9, away: 7 },
    { label: 'Dot Balls', home: 48, away: 54 },
    { label: 'Extras', home: 8, away: 12 },
    { label: 'Wickets', home: 5, away: 8 },
  ],
  CSK_RCB: [
    { label: 'Run Rate', home: 7.80, away: 7.85 },
    { label: 'Boundaries', home: 14, away: 16 },
    { label: 'Sixes', home: 5, away: 6 },
    { label: 'Dot Balls', home: 62, away: 55 },
    { label: 'Extras', home: 6, away: 4 },
    { label: 'Wickets', home: 8, away: 4 },
  ],
  SRH_MI: [
    { label: 'Run Rate', home: 9.90, away: 9.70 },
    { label: 'Boundaries', home: 24, away: 22 },
    { label: 'Sixes', home: 10, away: 9 },
    { label: 'Dot Balls', home: 42, away: 45 },
    { label: 'Extras', home: 10, away: 8 },
    { label: 'Wickets', home: 4, away: 7 },
  ],
}

function getStatsKey(match: Match) {
  return `${match.home.team}_${match.away.team}`
}

function StatBar({ homeVal, awayVal, homeColor, awayColor }: { homeVal: number; awayVal: number; homeColor: string; awayColor: string }) {
  const total = homeVal + awayVal || 1
  const homePct = (homeVal / total) * 100
  return (
    <div className="h-1.5 rounded-full overflow-hidden flex">
      <div className="rounded-l-full transition-all duration-700" style={{ width: `${homePct}%`, backgroundColor: homeColor }} />
      <div className="rounded-r-full flex-1" style={{ backgroundColor: awayColor }} />
    </div>
  )
}

export default function AnalyticsScreen({ match }: Props) {
  const statsKey = getStatsKey(match)
  const stats = DUMMY_STATS[statsKey]

  return (
    <div className="p-6 space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-accent" />
        </div>
        <div>
          <p className="font-bold text-sm">{match.home.team} vs {match.away.team}</p>
          <p className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">Match {match.id} · Analytics</p>
        </div>
      </div>

      {match.status !== 'completed' ? (
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6 text-center space-y-3">
          <Target className="w-8 h-8 text-foreground-muted/20 mx-auto" />
          <p className="text-sm font-semibold">Analytics Unavailable</p>
          <p className="text-[11px] text-foreground-muted font-mono">Analytics will be available after this match is played.</p>
        </div>
      ) : (
        <>
          {/* Score summary */}
          <div className="grid grid-cols-2 gap-3">
            {[{ team: match.home, score: match.homeScore }, { team: match.away, score: match.awayScore }].map(({ team, score }) => (
              <div key={team.team} className="rounded-2xl p-4 border border-white/[0.05] space-y-1"
                style={{ background: `linear-gradient(135deg, ${team.color}18, transparent)` }}>
                <div className="flex items-center gap-2">
                  {team.logo && <img src={team.logo} alt={team.team} className="w-5 h-5 object-contain" />}
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: team.color }}>{team.team}</span>
                </div>
                <p className="text-2xl font-black">{score}</p>
              </div>
            ))}
          </div>

          {/* Comparative stats */}
          {stats ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ease: EASE }}
              className="space-y-4"
            >
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-accent/60" />
                Match Stats
              </h3>
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl overflow-hidden">
                {/* Legend */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: match.home.color }} />
                    <span className="text-[10px] font-bold" style={{ color: match.home.color }}>{match.home.team}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold" style={{ color: match.away.color }}>{match.away.team}</span>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: match.away.color }} />
                  </div>
                </div>
                {stats.map((row) => (
                  <div key={row.label} className="px-4 py-3.5 space-y-2 border-b border-white/[0.03] last:border-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold tabular-nums">{row.home}</span>
                      <span className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">{row.label}</span>
                      <span className="text-sm font-bold tabular-nums">{row.away}</span>
                    </div>
                    <StatBar
                      homeVal={Number(row.home)}
                      awayVal={Number(row.away)}
                      homeColor={match.home.color}
                      awayColor={match.away.color}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <p className="text-center text-sm text-foreground-muted font-mono">Detailed stats not available for this match</p>
          )}
        </>
      )}
    </div>
  )
}
