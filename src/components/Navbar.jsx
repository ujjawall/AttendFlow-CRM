import React, { useState, useRef, useEffect } from 'react'
import { Bell, LogOut, User } from 'lucide-react'
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

export default function Navbar() {
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
    <header className="flex items-center justify-between p-3 sm:p-4 border-b bg-white/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="text-sm sm:text-lg font-semibold">AttendFlow CRM</div>
        <div className="hidden sm:block text-xs sm:text-sm text-slate-500">Attendance & HR</div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button aria-label="Notifications" className="p-2 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-700">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-md px-1.5 sm:px-2 py-1.5 hover:bg-slate-50"
            aria-expanded={open}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-700 flex-shrink-0">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="hidden sm:block text-xs sm:text-sm text-slate-700">
              <div className="font-medium truncate">{user?.displayName || user?.email || 'User'}</div>
            </div>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 sm:w-44 rounded-lg border bg-white shadow-lg z-50">
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    navigate('/profile')
                  }}
                  className="text-left px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm hover:bg-slate-50 transition-colors"
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-rose-600 hover:bg-slate-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
