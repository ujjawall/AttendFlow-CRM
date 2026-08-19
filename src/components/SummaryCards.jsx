import React from 'react'
import { Users, CheckCircle, XCircle, Calendar } from 'lucide-react'

function SkeletonCard() {
  return (
    <div className="animate-pulse p-3 sm:p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/10">
      <div className="h-3 sm:h-4 w-3/4 bg-slate-200 rounded mb-3" />
      <div className="h-6 sm:h-8 w-1/3 bg-slate-200 rounded" />
    </div>
  )
}

export default function SummaryCards({ stats, loading = false }) {
  const items = [
    { id: 'total', label: 'Total Employees', value: stats.total ?? 0, icon: Users, tone: 'brand', accent: 'text-[#2f6df3]', iconWrap: 'bg-[#eaf2ff] text-[#2f6df3]' },
    { id: 'present', label: 'Present Today', value: stats.present ?? 0, icon: CheckCircle, tone: 'emerald', accent: 'text-[#1bbf7a]', iconWrap: 'bg-[#eafaf3] text-[#1bbf7a]' },
    { id: 'absent', label: 'Absent Today', value: stats.absent ?? 0, icon: XCircle, tone: 'rose', accent: 'text-[#ef5a67]', iconWrap: 'bg-[#ffedf0] text-[#ef5a67]' },
    { id: 'leave', label: 'Leave Today', value: stats.leave ?? 0, icon: Calendar, tone: 'amber', accent: 'text-[#e9ad2c]', iconWrap: 'bg-[#fff7e4] text-[#e9ad2c]' },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((it) => (
        <div
          key={it.id}
          className="flex items-center justify-between rounded-[1.75rem] border border-slate-200 bg-white/60 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
        >
          <div className="min-w-0 pr-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{it.label}</div>
            <div className={`mt-4 text-4xl font-semibold ${it.accent}`}>{it.value}</div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
              <span className="text-sm">↗</span>
              <span>vs last week</span>
            </div>
          </div>
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${it.iconWrap}`}>
            <it.icon className="h-6 w-6" />
          </div>
        </div>
      ))}
    </div>
  )
}
