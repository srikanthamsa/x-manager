import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check, ChevronRight } from 'lucide-react'
import { TEAMS } from '../../data/teams'
import { TEAM_PLAYERS } from '../../data/matches'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

// Logged-in user is Srikant / RCB
const MY_TEAM = TEAMS.RCB

const OTHER_TEAMS = Object.values(TEAMS).filter(t => t.shortName !== MY_TEAM.shortName)

type Step = 'selectTeam' | 'selectOffer' | 'selectRequest' | 'confirm' | 'sent'

interface Props { onClose: () => void }

export default function InitiateTradeModal({ onClose }: Props) {
  const [step, setStep] = useState<Step>('selectTeam')
  const [targetTeam, setTargetTeam] = useState<typeof TEAMS.RCB | null>(null)
  const [offerPlayer, setOfferPlayer] = useState<string | null>(null)
  const [requestPlayer, setRequestPlayer] = useState<string | null>(null)

  const myPlayers = TEAM_PLAYERS[MY_TEAM.shortName] ?? []
  const theirPlayers = targetTeam ? (TEAM_PLAYERS[targetTeam.shortName] ?? []) : []

  const handleSend = () => setStep('sent')

  return (
    <AnimatePresence mode="wait">
      {step === 'selectTeam' && (
        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ ease: EASE }} className="p-6 space-y-4 pb-10">
          <p className="text-[11px] font-mono text-foreground-muted uppercase tracking-widest">Step 1 of 3 · Select the team you want to trade with</p>
          <div className="space-y-2">
            {OTHER_TEAMS.map(team => (
              <button
                key={team.shortName}
                onClick={() => { setTargetTeam(team); setStep('selectOffer') }}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.08] transition-all group"
                style={{ background: `linear-gradient(to right, ${team.color}12, transparent 60%)` }}
              >
                <img src={team.logo} alt={team.shortName} className="w-12 h-12 object-contain" />
                <div className="text-left flex-1">
                  <p className="font-bold text-sm">{team.name}</p>
                  <p className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">{team.manager}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-foreground-muted/30 group-hover:text-accent transition-colors" />
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {step === 'selectOffer' && (
        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ ease: EASE }} className="p-6 space-y-4 pb-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep('selectTeam')} className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest hover:text-accent transition-colors">← Back</button>
          </div>
          <p className="text-[11px] font-mono text-foreground-muted uppercase tracking-widest">Step 2 of 3 · Which player are you offering?</p>
          <div className="flex items-center gap-2 mb-2">
            <img src={MY_TEAM.logo} alt={MY_TEAM.shortName} className="w-6 h-6 object-contain" />
            <span className="text-xs font-bold" style={{ color: MY_TEAM.color }}>{MY_TEAM.shortName} Squad</span>
          </div>
          <div className="space-y-1.5">
            {myPlayers.map(p => (
              <button
                key={p.name}
                onClick={() => { setOfferPlayer(p.name); setStep('selectRequest') }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                  offerPlayer === p.name
                    ? 'bg-accent/10 border-accent/30 text-accent'
                    : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]'
                }`}
              >
                <div className="text-left">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-[9px] font-mono text-foreground-muted uppercase tracking-widest">{p.role}</p>
                </div>
                {offerPlayer === p.name && <Check className="w-4 h-4 text-accent" />}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {step === 'selectRequest' && targetTeam && (
        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ ease: EASE }} className="p-6 space-y-4 pb-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep('selectOffer')} className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest hover:text-accent transition-colors">← Back</button>
          </div>
          <p className="text-[11px] font-mono text-foreground-muted uppercase tracking-widest">Step 3 of 3 · Which player do you want in return?</p>
          <div className="flex items-center gap-2 mb-2">
            <img src={targetTeam.logo} alt={targetTeam.shortName} className="w-6 h-6 object-contain" />
            <span className="text-xs font-bold" style={{ color: targetTeam.color }}>{targetTeam.shortName} Squad</span>
          </div>
          <div className="space-y-1.5">
            {theirPlayers.map(p => (
              <button
                key={p.name}
                onClick={() => { setRequestPlayer(p.name); setStep('confirm') }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                  requestPlayer === p.name
                    ? 'bg-accent/10 border-accent/30 text-accent'
                    : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]'
                }`}
              >
                <div className="text-left">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-[9px] font-mono text-foreground-muted uppercase tracking-widest">{p.role}</p>
                </div>
                {requestPlayer === p.name && <Check className="w-4 h-4 text-accent" />}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {step === 'confirm' && targetTeam && (
        <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ ease: EASE }} className="p-6 space-y-6 pb-10">
          <button onClick={() => setStep('selectRequest')} className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest hover:text-accent transition-colors">← Back</button>
          <h3 className="text-xl font-bold tracking-tight">Confirm Trade</h3>

          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-1 text-center">
                <img src={MY_TEAM.logo} alt={MY_TEAM.shortName} className="w-10 h-10 object-contain mx-auto" />
                <p className="text-[10px] font-mono text-foreground-muted uppercase">{MY_TEAM.shortName} Offers</p>
                <p className="text-base font-bold">{offerPlayer}</p>
              </div>
              <div className="text-xl font-black text-foreground-muted/20">⇌</div>
              <div className="flex-1 space-y-1 text-center">
                <img src={targetTeam.logo} alt={targetTeam.shortName} className="w-10 h-10 object-contain mx-auto" />
                <p className="text-[10px] font-mono text-foreground-muted uppercase">{targetTeam.shortName} Sends</p>
                <p className="text-base font-bold">{requestPlayer}</p>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-foreground-muted text-center font-mono">This will send a trade proposal to {targetTeam.manager}. They can accept or reject.</p>

          <button
            onClick={handleSend}
            className="w-full py-4 bg-accent text-white rounded-2xl text-sm font-bold tracking-tight hover:bg-accent/90 transition-colors"
          >
            Send Trade Proposal
          </button>
        </motion.div>
      )}

      {step === 'sent' && (
        <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ease: EASE }} className="p-10 flex flex-col items-center gap-6 text-center pb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center"
          >
            <Check className="w-8 h-8 text-emerald-400" />
          </motion.div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Proposal Sent</h3>
            <p className="text-sm text-foreground-muted">Your trade proposal has been sent. You'll be notified when {targetTeam?.manager} responds.</p>
          </div>
          <button onClick={onClose} className="px-8 py-3 bg-white/[0.06] border border-white/[0.08] rounded-full text-sm font-bold hover:bg-white/[0.1] transition-colors">
            Done
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
