import React from 'react'
import { useAuth } from '../firebase/AuthProvider'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-[#edf4ff] p-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">Profile</div>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em] text-slate-800">Account details</h1>
      </div>

      <div className="rounded-[2rem] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2f6df3] text-xl font-bold text-white">
            {(user?.displayName || user?.email || 'DU').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-2xl font-semibold text-slate-800">{user?.displayName || user?.email || 'Demo User'}</div>
            <div className="text-base text-slate-500">{user?.email || 'demo@attendflow.com'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
