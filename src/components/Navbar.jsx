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
    <header className="flex items-center justify-between p-4 border-b bg-white/60 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="text-lg font-semibold">AttendFlow CRM</div>
        <div className="text-sm text-slate-500">Attendance & HR</div>
      </div>

      <div className="flex items-center gap-4">
        <button aria-label="Notifications" className="p-2 rounded hover:bg-slate-100">
          <Bell />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-slate-50"
            aria-expanded={open}
          >
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-700">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-sm text-slate-700">
              <div className="font-medium">{user?.displayName || user?.email || 'User'}</div>
            </div>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg border bg-white shadow-lg">
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    navigate('/profile')
                  }}
                  className="text-left px-4 py-2 text-sm hover:bg-slate-50"
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-slate-50"
                >
                  <LogOut className="w-4 h-4" />
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
