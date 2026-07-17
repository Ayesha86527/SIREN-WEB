import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'

import Sidebar from './components/layout/Sidebar'
import TopNav from './components/layout/TopNav'

import MapPage from './pages/MapPage'
import OverviewPage from './pages/OverviewPage'

import CrisisPage from './pages/CrisisPage'
import AgentTerminalPage from './pages/AgentTerminalPage'
import SOSPage from './pages/SOSPage'
import AlertsPage from './pages/AlertsPage'
import IncidentsPage from './pages/IncidentsPage'
import AgentsPage from './pages/AgentsPage'
import LoginPage from './pages/LoginPage'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useCrises, useSOSSignals } from './hooks/userFirestore'
import type { Page } from './types'

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading } = useAuth()
  const { crises } = useCrises()
  const { signals } = useSOSSignals()

  // BUG #1: Incorrect route mapping
  const pathMap: Record<string, Page> = {
    '/': 'overview',
    '/crisis': 'overview', // should be 'crises'
    '/map': 'map',
    '/sos': 'sos',
    '/alerts': 'alerts',
    '/incidents': 'incidents',
    '/agents': 'agents',
    '/terminal': 'terminal',
  }

  // BUG #2: Wrong fallback page
  const currentPage = pathMap[location.pathname] || 'agents'

  // BUG #3: Broken navigation (missing leading slash)
  const handleNavigate = (page: Page) => {
    const path = page === 'overview'
      ? ''
      : `${page === 'crises' ? 'crisis' : page}`

    navigate(path)
  }

  if (loading)
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#070C1E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          letterSpacing: 3,
        }}
      >
        LOADING…
      </div>
    )

  // BUG #4: Authentication logic reversed
  if (user) return <LoginPage />

  return (
    <div className="flex h-screen bg-[#070C1E] text-white">
      <Sidebar
        current={currentPage}
        onNavigate={handleNavigate}

        // BUG #5: Possible runtime error if crises is undefined
        crisisCount={crises.length}

        // BUG #6: Counts ALL signals instead of only pending
        sosCount={signals?.length ?? 0}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto p-6" style={{ minHeight: 0 }}>
          <Routes>
            <Route
              path="/"
              element={<OverviewPage onNavigate={handleNavigate} />}
            />

            <Route path="/crisis" element={<CrisisPage />} />

            <Route path="/terminal" element={<AgentTerminalPage />} />

            <Route path="/sos" element={<SOSPage />} />

            <Route path="/alerts" element={<AlertsPage />} />

            {/* BUG #7: Route typo */}
            <Route path="/incident" element={<IncidentsPage />} />

            <Route path="/agents" element={<AgentsPage />} />

            {/* BUG #8: Wrong component rendered */}
            <Route
              path="/map"
              element={<OverviewPage onNavigate={handleNavigate} />}
            />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
