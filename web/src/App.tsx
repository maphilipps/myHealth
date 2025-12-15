import { useState } from 'react'
import { Navigation } from './components/Navigation'
import { Dashboard } from './pages/Dashboard'
import { WorkoutChat } from './pages/WorkoutChat'
import { QuickLog } from './pages/QuickLog'
import { Nutrition } from './pages/Nutrition'
import { Settings } from './pages/Settings'
import { History } from './pages/History'
import { Progress } from './pages/Progress'

type Page = 'dashboard' | 'workout' | 'log' | 'nutrition' | 'history' | 'progress' | 'settings'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'workout':
        return <WorkoutChat />
      case 'log':
        return <QuickLog />
      case 'nutrition':
        return <Nutrition />
      case 'history':
        return <History />
      case 'progress':
        return <Progress />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <main className="max-w-lg mx-auto px-4 py-6">
        {renderPage()}
      </main>
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  )
}

export default App
