import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Users, CalendarCheck, Settings, HelpCircle } from 'lucide-react'

function LinkItem({ to, icon: Icon, children, onClick, className = '' }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-base font-medium transition-all ${className} ${
          isActive
            ? 'bg-[#2f6df3] text-white shadow-[0_8px_20px_rgba(47,109,243,0.25)]'
            : 'text-slate-700 hover:bg-white/70'
        }`
      }
    >
      {Icon && (
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          className.includes('text-white') ? 'bg-white/15 text-white' : 'bg-white text-[#2f6df3] shadow-sm'
        }`}>
          <Icon className="h-4 w-4 flex-shrink-0" />
        </span>
      )}
      <span className="truncate">{children}</span>
    </NavLink>
  )
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-slate-900/30" onClick={onClose} />
          <div className="absolute left-0 top-0 flex h-full w-[82vw] max-w-[330px] flex-col overflow-hidden bg-[#edf4ff] shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-lg font-bold text-white">A</div>
              <div>
                <div className="text-lg font-semibold text-slate-900">AttendFlow CRM</div>
                <div className="text-xs text-slate-500">Attendance & HR</div>
              </div>
            </div>

            <div className="flex-1 px-3 py-4">
              <nav className="flex flex-col gap-2">
                <LinkItem to="/dashboard" icon={Home} onClick={onClose} className="!text-slate-700">Dashboard</LinkItem>
                <LinkItem to="/employees" icon={Users} onClick={onClose} className="!text-slate-700">Employees</LinkItem>
                <LinkItem to="/attendance" icon={CalendarCheck} onClick={onClose} className="!text-slate-700">Attendance</LinkItem>
              </nav>
            </div>
          </div>
        </div>
      )}

      <aside className="hidden min-h-screen w-[260px] flex-col border-r border-slate-200 bg-[#edf4ff] md:flex">
        <div className="flex items-center gap-3 px-4 pt-6 pb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-xl font-bold text-white shadow-lg shadow-blue-200">A</div>
          <div className="min-w-0">
            <div className="text-2xl font-bold tracking-tight text-slate-800">AttendFlow</div>
            <div className="text-xs font-medium text-slate-500">CRM workspace</div>
          </div>
        </div>

        <div className="mt-6 px-4">
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Workspace</div>
          <nav className="space-y-2">
            <LinkItem to="/dashboard" icon={Home}>Dashboard</LinkItem>
            <LinkItem to="/employees" icon={Users}>Employees</LinkItem>
            <LinkItem to="/attendance" icon={CalendarCheck}>Attendance</LinkItem>
          </nav>
        </div>

        <div className="mt-10 px-4">
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Manage</div>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-white/70">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#2f6df3] shadow-sm">
              <Settings className="h-4 w-4" />
            </span>
            <span>Settings</span>
          </div>
        </div>

        <div className="mt-auto border-t border-slate-200 p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-3 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf2ff] text-[#2f6df3]">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-800">Need a hand?</div>
              <div className="text-xs text-slate-500">Visit our help center</div>
            </div>
            <div className="text-lg text-slate-400">↗</div>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-xl bg-white/80 p-2.5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2f6df3] text-sm font-bold text-white">DU</div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-800">Demo User</div>
              <div className="text-[11px] text-slate-500">Administrator</div>
            </div>
            <div className="text-slate-400">•••</div>
          </div>
        </div>
      </aside>
    </>
  )
}
