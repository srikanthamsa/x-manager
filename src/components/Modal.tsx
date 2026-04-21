import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, ChevronLeft } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1]

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  onBack?: () => void
  children: React.ReactNode
  fullScreen?: boolean
}

export default function Modal({ open, onClose, title, onBack, children, fullScreen = false }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const main = document.querySelector('main')
    if (main) {
      const prev = main.style.overflow
      main.style.overflow = 'hidden'
      return () => { main.style.overflow = prev }
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] flex items-end md:items-center justify-center"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.4, ease: EASE }}
            className={`relative w-full bg-[#08090a] border border-white/[0.08] flex flex-col overflow-hidden ${
              fullScreen
                ? 'h-[92vh] rounded-t-[2rem] md:rounded-[2rem] md:max-w-3xl md:h-[88vh]'
                : 'rounded-t-[2rem] md:rounded-[2rem] md:max-w-2xl max-h-[88vh]'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.05] bg-[#08090a]/95 backdrop-blur-xl shrink-0">
              {onBack && (
                <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] transition-colors shrink-0">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {title && <h2 className="text-base font-bold tracking-tight flex-1 truncate">{title}</h2>}
              <button onClick={onClose} className="ml-auto w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] transition-colors shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1" style={{ overscrollBehavior: 'contain' }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
