import { useEffect, useRef, useState, type ComponentType, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import DashboardPage from './pages/DashboardPage'
import GroupsPage from './pages/GroupsPage'
import AddExpensePage from './pages/AddExpensePage'
import BalancesPage from './pages/BalancesPage'
import LoanPage from './pages/LoanPage'
import HistoryPage from './pages/HistoryPage'
import ReviewPage from './pages/ReviewPage'
import SupportPage from './pages/SupportPage'

const clean = (t?: string | null) => (t ?? '').replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\s+/g, ' ').trim()

const pages: Record<string, ComponentType> = {
  Dashboard: DashboardPage,
  'Groups & Trips': GroupsPage,
  'Add Expense & Split Studio': AddExpensePage,
  'Balances & Settle': BalancesPage,
  Loan: LoanPage,
  'Expense History': HistoryPage,
  Analytics: ReviewPage,
  'Settings And Support': SupportPage,
}

// Text-triggered prototype links from inside page content
const shortcuts: Record<string, string> = {
  'Add Expense': 'Add Expense & Split Studio',
  'Settle Up': 'Balances & Settle',
  'View Ledger': 'Expense History',
  'View full audit ledger': 'Expense History',
  'Audit Selected': 'Analytics',
  'Goa Trip 2025': 'Groups & Trips',
}

export default function App() {
  const [page, setPage] = useState('Dashboard')
  const [toast, setToast] = useState<string | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const Page = pages[page]

  useEffect(() => {
    root.current?.querySelectorAll('[data-name="Nav"] > [data-name="Link"]').forEach((el) => {
      el.classList.toggle('is-active', clean(el.textContent) === page)
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const onClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const nav = target.closest('[data-name="Nav"] > [data-name="Link"]')
    if (nav) {
      const label = clean(nav.textContent)
      if (pages[label]) setPage(label)
      return
    }
    const btn = target.closest('[data-name="Button"], [data-name="Button:shadow"], [data-name="Link"]')
    if (!btn) return
    const label = clean(btn.textContent)
    const dest = Object.keys(shortcuts).find((k) => label.startsWith(k))
    if (dest && shortcuts[dest] !== page) setPage(shortcuts[dest])
    else if (label) setToast(label.length > 40 ? label.slice(0, 40) + '…' : label)
  }

  return (
    <div ref={root} className="app min-h-dvh w-full" onClick={onClick}>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() =>
            root.current?.querySelectorAll('[data-name="Nav"] > [data-name="Link"]').forEach((el) => {
              el.classList.toggle('is-active', clean(el.textContent) === page)
            })
          }
        >
          <Page />
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#0f1f14] px-5 py-3 text-sm text-white shadow-2xl"
            style={{ fontFamily: '"Plus Jakarta Sans:Medium", sans-serif' }}
          >
            <span className="mr-2 inline-block size-2 rounded-full bg-[#7ee39a] align-middle" />
            {toast} — done
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
