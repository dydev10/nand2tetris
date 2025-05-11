import { Link } from '@tanstack/react-router'
import { ReactNode, useState, useEffect } from 'react'
import { Menu, Home, Info, Hammer, Settings, LogOut, ImagePlay } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      // Auto-collapse sidebar on mobile
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      }
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col border-r border-gray-700`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700 bg-gray-900">
          {isSidebarOpen ? (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-md bg-indigo-600 flex items-center justify-center mr-3">
                <span className="font-bold text-white">N2T</span>
              </div>
              <h1 className="text-lg font-bold text-white">Tools</h1>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-10 h-10 rounded-md bg-indigo-600 flex items-center justify-center">
                <span className="font-bold text-white">N2T</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/" 
                className="flex items-center px-4 py-3 hover:bg-gray-700 hover:text-white transition-colors"
                activeProps={{ className: "bg-gray-700 text-white" }}
              >
                <Home size={20} />
                {isSidebarOpen && <span className="ml-4">Home</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/assembler" 
                className="flex items-center px-4 py-3 hover:bg-gray-700 hover:text-white transition-colors"
                activeProps={{ className: "bg-gray-700 text-white" }}
              >
                <Hammer size={20} />
                {isSidebarOpen && <span className="ml-4">Assembler</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/gates" 
                className="flex items-center px-4 py-3 hover:bg-gray-700 hover:text-white transition-colors"
                activeProps={{ className: "bg-gray-700 text-white" }}
              >
                <ImagePlay size={20} />
                {isSidebarOpen && <span className="ml-4">Gates</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className="flex items-center px-4 py-3 hover:bg-gray-700 hover:text-white transition-colors"
                activeProps={{ className: "bg-gray-700 text-white" }}
              >
                <Info size={20} />
                {isSidebarOpen && <span className="ml-4">About</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-700 p-4">
          <ul className="space-y-2">
            <li>
              <a 
                href="#" 
                className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md transition-colors"
              >
                <Settings size={20} />
                {isSidebarOpen && <span className="ml-4">Settings</span>}
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md transition-colors"
              >
                <LogOut size={20} />
                {isSidebarOpen && <span className="ml-4">Logout</span>}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full bg-gray-900">
        {/* Top Header */}
        <header className="bg-gray-800 shadow-md border-b border-gray-700 h-16 flex items-center px-6">
          <button 
            onClick={toggleSidebar} 
            className="mr-4 p-2 rounded-md hover:bg-gray-100 focus:outline-none"
          >
            <Menu size={20} className="text-gray-100" />
          </button>
          <h2 className="text-xl font-semibold text-gray-100">Page Title Placeholder</h2>
          <div className="ml-auto flex items-center space-x-4">
            <div className="relative">
              <button className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="font-medium text-gray-200">U</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-900 w-full">
          <div className="w-full">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 border-t border-gray-700 py-4 px-6">
          <div className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} N2T Tools. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  )
}