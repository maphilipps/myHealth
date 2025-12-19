import { useState } from 'react'
import { Navigation, type Page } from './components/Navigation'
import { Dashboard } from './pages/Dashboard'
import { WorkoutSession } from './pages/WorkoutSession'
import { QuickLog } from './pages/QuickLog'
import { Nutrition } from './pages/Nutrition'
import { Settings } from './pages/Settings'
import { History } from './pages/History'
import { Progress } from './pages/Progress'
import { CreatePlan } from './pages/CreatePlan'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />
      case 'workout':
        return <WorkoutSession />
      case 'create-plan':
        return <CreatePlan />
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
        return <Dashboard onNavigate={setCurrentPage} />
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
