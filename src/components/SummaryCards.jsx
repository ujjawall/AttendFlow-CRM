import React from 'react'
import { Users, CheckCircle, XCircle, Calendar } from 'lucide-react'

function SkeletonCard() {
  return (
    <div className="animate-pulse p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/10">
      <div className="h-4 w-3/4 bg-slate-200 rounded mb-3" />
      <div className="h-8 w-1/3 bg-slate-200 rounded" />
    </div>
  )
}

export default function SummaryCards({ stats, loading = false }) {
  const items = [
    { id: 'total', label: 'Total Employees', value: stats.total ?? 0, icon: Users, color: 'from-sky-50 to-sky-100 text-sky-600' },
    { id: 'present', label: 'Present Today', value: stats.present ?? 0, icon: CheckCircle, color: 'from-emerald-50 to-emerald-100 text-emerald-600' },
    { id: 'absent', label: 'Absent Today', value: stats.absent ?? 0, icon: XCircle, color: 'from-rose-50 to-rose-100 text-rose-600' },
    { id: 'leave', label: 'Leave Today', value: stats.leave ?? 0, icon: Calendar, color: 'from-amber-50 to-amber-100 text-amber-600' },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((it) => (
        <div
          key={it.id}
          className="p-4 rounded-xl bg-white/60 backdrop-blur-md border border-white/10 shadow-md flex items-center justify-between hover:scale-[1.02] transition-transform duration-200"
        >
          <div>
            <div className="text-sm text-slate-500">{it.label}</div>
            <div className={`mt-2 text-2xl font-semibold ${it.color.split(' ').pop()}`}>{it.value}</div>
          </div>
          <div className={`p-3 rounded-full bg-gradient-to-br ${it.color}`}>
            <it.icon className="w-6 h-6 opacity-90" />
          </div>
        </div>
      ))}
    </div>
  )
}
