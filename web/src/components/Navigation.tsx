import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  PlusCircleIcon,
  ClockIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  ChatBubbleLeftRightIcon as ChatIconSolid,
  PlusCircleIcon as PlusIconSolid,
  ClockIcon as ClockIconSolid,
  Cog6ToothIcon as CogIconSolid
} from '@heroicons/react/24/solid'

type Page = 'dashboard' | 'workout' | 'log' | 'nutrition' | 'history' | 'progress' | 'settings'

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

const navItems: { id: Page; label: string; Icon: typeof HomeIcon; IconSolid: typeof HomeIconSolid }[] = [
  { id: 'dashboard', label: 'Home', Icon: HomeIcon, IconSolid: HomeIconSolid },
  { id: 'workout', label: 'Workout', Icon: ChatBubbleLeftRightIcon, IconSolid: ChatIconSolid },
  { id: 'log', label: 'Log', Icon: PlusCircleIcon, IconSolid: PlusIconSolid },
  { id: 'history', label: 'History', Icon: ClockIcon, IconSolid: ClockIconSolid },
  { id: 'settings', label: 'Settings', Icon: Cog6ToothIcon, IconSolid: CogIconSolid },
]

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-inset">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {navItems.map(({ id, label, Icon, IconSolid }) => {
          const isActive = currentPage === id
          const IconComponent = isActive ? IconSolid : Icon

          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                isActive
                  ? 'text-health-primary'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <IconComponent className="w-6 h-6" />
              <span className="text-xs mt-1">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
