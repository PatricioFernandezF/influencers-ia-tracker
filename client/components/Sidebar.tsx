import { Link, useLocation } from 'react-router-dom'

interface NavItem {
  icon: string
  label: string
  path: string
}

type SidebarProps = {
  onConnect?: () => void
}

export default function Sidebar({ onConnect }: SidebarProps) {
  const location = useLocation()

  const navItems: NavItem[] = [
    { icon: 'dashboard', label: 'Dashboard', path: '/' },
    { icon: 'analytics', label: 'Analytics', path: '/analytics' },
    { icon: 'group', label: 'Creators', path: '/creators' },
    { icon: 'newspaper', label: 'Newsletter', path: '/newsletter' },
    { icon: 'settings', label: 'Settings', path: '/settings' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 flex flex-col justify-between p-4 sticky top-0 h-screen">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-blue-500 rounded-lg p-1.5 text-white">
            <span className="material-symbols-outlined text-2xl">monitoring</span>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">PostTracker</h1>
            <p className="text-slate-500 text-xs font-medium">Influencer Pro</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-500/10 text-blue-500'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-2">PRO PLAN</p>
          <p className="text-sm font-semibold mb-3">85% of monthly limit used</p>
          <div className="w-full bg-slate-300 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[85%]"></div>
          </div>
        </div>

        <button
          onClick={onConnect}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          Connect Account
        </button>
      </div>
    </aside>
  )
}
