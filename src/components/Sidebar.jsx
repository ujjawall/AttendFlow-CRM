import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Home, Users, CalendarCheck, Menu, X } from 'lucide-react'

function LinkItem({ to, icon: Icon, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-md transition-colors text-xs sm:text-sm ${
          isActive ? 'bg-sky-50 text-sky-600 font-medium' : 'text-slate-700 hover:bg-slate-50'
        }`
      }
    >
      {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
      <span className="truncate">{children}</span>
    </NavLink>
  )
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    // close mobile menu on navigation
    setOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile top bar with hamburger */}
      <div className="md:hidden flex items-center justify-between p-2.5 sm:p-3 bg-white/80 backdrop-blur-sm border-b">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-brand-600 text-white rounded flex items-center justify-center font-semibold text-xs sm:text-sm">A</div>
          <div className="text-sm sm:text-lg font-semibold truncate">AttendFlow CRM</div>
        </div>
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="p-2 rounded-md hover:bg-slate-100 text-slate-600 flex-shrink-0"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Mobile overlay menu */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-60 sm:w-64 bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-brand-600 text-white rounded flex items-center justify-center font-semibold text-xs sm:text-sm">A</div>
                <div className="text-sm sm:text-lg font-semibold">AttendFlow CRM</div>
              </div>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-slate-100 flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              <LinkItem to="/dashboard" icon={Home} onClick={() => setOpen(false)}>Dashboard</LinkItem>
              <LinkItem to="/employees" icon={Users} onClick={() => setOpen(false)}>Employee</LinkItem>
              <LinkItem to="/attendance" icon={CalendarCheck} onClick={() => setOpen(false)}>Attendance</LinkItem>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-56 lg:w-64 bg-white/60 backdrop-blur-md border-r border-white/10 min-h-screen p-4 lg:p-5">
        <div className="flex items-center gap-2 lg:gap-3 mb-6">
          <div className="w-9 h-9 lg:w-10 lg:h-10 bg-brand-600 text-white rounded flex items-center justify-center font-semibold text-sm lg:text-base flex-shrink-0">A</div>
          <div className="min-w-0">
            <div className="text-sm lg:text-lg font-semibold truncate">AttendFlow CRM</div>
            <div className="text-xs text-slate-500">Attendance & HR</div>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <LinkItem to="/dashboard" icon={Home}>Dashboard</LinkItem>
          <LinkItem to="/employees" icon={Users}>Employee</LinkItem>
          <LinkItem to="/attendance" icon={CalendarCheck}>Attendance</LinkItem>
        </nav>
      </aside>
    </>
  )
}
