import React from 'react'
import { Empty } from './EmptyState'
import { formatTo12Hour } from '../utils/timeFormatters'

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-t">
      <td className="p-2 sm:p-3"><div className="h-3 sm:h-4 bg-slate-200 rounded w-24" /></td>
      <td className="p-2 sm:p-3 hidden sm:table-cell"><div className="h-3 sm:h-4 bg-slate-200 rounded w-20" /></td>
      <td className="p-2 sm:p-3"><div className="h-3 sm:h-4 bg-slate-200 rounded w-16" /></td>
      <td className="p-2 sm:p-3 hidden md:table-cell"><div className="h-3 sm:h-4 bg-slate-200 rounded w-20" /></td>
      <td className="p-2 sm:p-3 hidden md:table-cell"><div className="h-3 sm:h-4 bg-slate-200 rounded w-20" /></td>
    </tr>
  )
}

export default function RecentAttendanceTable({ rows, loading = false }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[#edf4ff]/40">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
        <div>
          <h3 className="text-[1.6rem] font-semibold tracking-[-0.04em] text-slate-800">Recent attendance</h3>
          <p className="mt-1 text-base text-slate-500">Latest attendance records from your workspace</p>
        </div>
        <div className="inline-flex items-center rounded-full bg-[#eaf2ff] px-2.5 py-1.5 text-sm font-semibold text-[#2f6df3]">7 records</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead>
            <tr className="bg-[#edf4ff] text-left text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <th className="px-5 py-4">Employee</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Check-in</th>
              <th className="px-5 py-4">Check-out</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            ) : rows && rows.length > 0 ? (
              rows.map((r) => (
                <tr key={r.id} className="border-t border-slate-200 bg-white/70 transition-colors hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf2ff] text-xs font-bold text-[#2f6df3]">
                        {r.name
                          .split(' ')
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{r.date}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                      r.status === 'Present' ? 'bg-[#dff5ec] text-[#1caf6e]' :
                      r.status === 'Absent' ? 'bg-[#ffe1e5] text-[#eb5d69]' :
                      'bg-[#fff4d9] text-[#d39a1a]'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{r.checkIn ? formatTo12Hour(r.checkIn) : '-'}</td>
                  <td className="px-5 py-3 text-slate-600">{r.checkOut ? formatTo12Hour(r.checkOut) : '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8">
                  <Empty title="No recent attendance records" description="No attendance recorded yet. Mark attendance from the Attendance page." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

