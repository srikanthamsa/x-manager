import { motion } from 'motion/react'
import { MapPin, CheckCircle2, Clock } from 'lucide-react'
import type { Match } from '../../data/matches'
import { TEAM_PLAYERS } from '../../data/matches'

const EASE = [0.16, 1, 0.3, 1]

interface Props { match: Match }

const DUMMY_BATTING: Record<string, { name: string; runs: number; balls: number; fours: number; sixes: number }[]> = {
  KKR: [
    { name: 'Shreyas Iyer', runs: 58, balls: 34, fours: 5, sixes: 3 },
    { name: 'Andre Russell', runs: 47, balls: 22, fours: 3, sixes: 4 },
    { name: 'Rinku Singh', runs: 38, balls: 26, fours: 2, sixes: 2 },
    { name: 'Venkatesh Iyer', runs: 24, balls: 18, fours: 2, sixes: 1 },
  ],
  SRH: [
    { name: 'Travis Head', runs: 62, balls: 38, fours: 7, sixes: 2 },
    { name: 'Abhishek Sharma', runs: 44, balls: 28, fours: 4, sixes: 2 },
    { name: 'Harry Brook', runs: 31, balls: 24, fours: 3, sixes: 1 },
    { name: 'Heinrich Klaasen', runs: 22, balls: 16, fours: 2, sixes: 1 },
  ],
  RCB: [
    { name: 'Faf du Plessis', runs: 72, balls: 48, fours: 8, sixes: 2 },
    { name: 'Virat Kohli', runs: 35, balls: 29, fours: 4, sixes: 0 },
    { name: 'Glenn Maxwell', runs: 28, balls: 16, fours: 2, sixes: 2 },
    { name: 'Dinesh Karthik', runs: 18, balls: 9, fours: 1, sixes: 1 },
  ],
  CSK: [
    { name: 'Devon Conway', runs: 54, balls: 42, fours: 5, sixes: 1 },
    { name: 'Ruturaj Gaikwad', runs: 40, balls: 32, fours: 3, sixes: 1 },
    { name: 'MS Dhoni', runs: 28, balls: 18, fours: 2, sixes: 2 },
    { name: 'Shivam Dube', runs: 22, balls: 14, fours: 1, sixes: 2 },
  ],
  MI: [
    { name: 'Rohit Sharma', runs: 68, balls: 45, fours: 7, sixes: 3 },
    { name: 'Suryakumar Yadav', runs: 55, balls: 32, fours: 4, sixes: 4 },
    { name: 'Tim David', runs: 34, balls: 21, fours: 2, sixes: 3 },
    { name: 'Hardik Pandya', runs: 28, balls: 20, fours: 2, sixes: 2 },
  ],
}

export default function MatchDetailScreen({ match }: Props) {
  if (match.status !== 'completed') {
    return (
      <div className="p-6 space-y-6 pb-10">
        <div className="flex items-center gap-3 text-[11px] font-mono text-foreground-muted uppercase tracking-widest">
          <MapPin className="w-3 h-3" />
          <span>{match.venue}</span>
          <Clock className="w-3 h-3 ml-2" />
          <span>Match {match.id}</span>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between gap-4">
          {[match.home, match.away].map((team, i) => (
            <div key={team.team} className={`flex flex-col items-center gap-3 flex-1 ${i === 1 ? 'items-end' : 'items-start'}`}>
              {team.logo ? <img src={team.logo} alt={team.team} className="w-16 h-16 object-contain" /> : null}
              <div className={i === 1 ? 'text-right' : 'text-left'}>
                <p className="font-bold">{team.fullName}</p>
                <p className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">{team.manager}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-2xl p-5 text-center space-y-2">
          <p className="text-sm font-semibold">Match Preview</p>
          <p className="text-[11px] text-foreground-muted font-mono">This match hasn't been played yet. Check back after the match for the full scorecard.</p>
        </div>

        {/* Probable XIs preview */}
        <div className="grid grid-cols-2 gap-3">
          {[match.home, match.away].map(team => {
            const players = TEAM_PLAYERS[team.team] ?? []
            return (
              <div key={team.team} className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: team.color }}>{team.team}</p>
                {players.map(p => (
                  <p key={p.name} className="text-xs text-foreground-subtle truncate">{p.name}</p>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const homeBatting = DUMMY_BATTING[match.home.team] ?? []
  const awayBatting = DUMMY_BATTING[match.away.team] ?? []

  return (
    <div className="p-6 space-y-6 pb-10">
      {/* Result banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: EASE }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="text-sm font-semibold text-emerald-300">{match.result}</span>
      </motion.div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-3">
        {[{ team: match.home, score: match.homeScore }, { team: match.away, score: match.awayScore }].map(({ team, score }) => (
          <div key={team.team} className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              {team.logo && <img src={team.logo} alt={team.team} className="w-6 h-6 object-contain" />}
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: team.color }}>{team.team}</span>
              {match.winner === team.team && <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">WON</span>}
            </div>
            <p className="text-3xl font-black tabular-nums">{score ?? '–'}</p>
            <p className="text-[9px] font-mono text-foreground-muted uppercase">20 overs</p>
          </div>
        ))}
      </div>

      {/* Batting scorecards */}
      {[
        { team: match.home, batting: homeBatting },
        { team: match.away, batting: awayBatting },
      ].map(({ team, batting }) => (
        <div key={team.team} className="space-y-3">
          <h3 className="text-sm font-bold flex items-center gap-2">
            {team.logo && <img src={team.logo} alt={team.team} className="w-5 h-5 object-contain" />}
            {team.fullName} — Batting
          </h3>
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl overflow-hidden">
            <div className="grid grid-cols-[1fr_40px_40px_40px_40px] gap-2 px-4 py-2 border-b border-white/[0.04] text-[9px] font-mono text-foreground-muted uppercase tracking-widest">
              <span>Batter</span><span className="text-right">R</span><span className="text-right">B</span><span className="text-right">4s</span><span className="text-right">6s</span>
            </div>
            {batting.map(p => (
              <div key={p.name} className="grid grid-cols-[1fr_40px_40px_40px_40px] gap-2 px-4 py-2.5 border-b border-white/[0.02] last:border-0 text-sm">
                <span className="font-medium truncate">{p.name}</span>
                <span className="text-right font-bold tabular-nums">{p.runs}</span>
                <span className="text-right text-foreground-muted tabular-nums">{p.balls}</span>
                <span className="text-right text-foreground-muted tabular-nums">{p.fours}</span>
                <span className="text-right text-foreground-muted tabular-nums">{p.sixes}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <p className="text-[10px] text-center font-mono text-foreground-muted/40 uppercase tracking-widest">Showing top batters · Bowling cards coming soon</p>
    </div>
  )
}
