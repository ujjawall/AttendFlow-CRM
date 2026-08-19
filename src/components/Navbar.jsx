import React, { useState, useRef, useEffect } from 'react'
import { Bell, LogOut, Menu, User, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../firebase/AuthProvider'
import toast from 'react-hot-toast'

function useOutsideClick(ref, handler) {
  useEffect(() => {
    function onDocument(e) {
      if (!ref.current || ref.current.contains(e.target)) return
      handler()
    }
    document.addEventListener('mousedown', onDocument)
    return () => document.removeEventListener('mousedown', onDocument)
  }, [ref, handler])
}

export default function Navbar({ onToggleMenu, isMenuOpen }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const menuRef = useRef(null)
  useOutsideClick(menuRef, () => setOpen(false))

  const { logout, user } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Signed out')
      setTimeout(() => navigate('/login', { replace: true }), 200)
    } catch (err) {
      toast.error(err?.message || 'Sign out failed')
      navigate('/login', { replace: true })
    }
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-[#edf4ff]/80 px-3 py-4 backdrop-blur-sm sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={onToggleMenu}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 md:hidden"
        >
          {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        <div className="text-sm text-slate-500 sm:text-base">
          <span>Workspace</span>
          <span className="mx-2 text-slate-300">/</span>
          <span className="font-semibold text-slate-700">Dashboard</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <button aria-label="Notifications" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50">
          <Bell className="h-4 w-4" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition hover:bg-slate-50"
            aria-expanded={open}
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#2f6df3] text-xs font-bold text-white">
              DU
            </div>
            <div className="hidden min-w-0 text-left sm:block">
              <div className="truncate text-sm font-medium text-slate-700">
                {user?.displayName || user?.email || 'Demo User'}
              </div>
            </div>
          </button>

          {open && (
            <div className="absolute right-0 z-50 mt-2 w-40 rounded-lg border border-slate-200 bg-white shadow-lg sm:w-44">
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    navigate('/profile')
                  }}
                  className="px-3 py-2 text-left text-xs transition hover:bg-slate-50 sm:px-4 sm:py-2.5 sm:text-sm"
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-left text-xs text-rose-600 transition hover:bg-slate-50 sm:px-4 sm:py-2.5 sm:text-sm"
                >
                  <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
