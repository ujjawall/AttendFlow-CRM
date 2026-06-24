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
    <div className="mt-6 bg-white/60 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden shadow">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Recent Attendance</h3>
        <p className="text-sm text-slate-500">Latest attendance records</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="text-left text-xs sm:text-xs uppercase bg-white/50 font-semibold">
              <th className="p-2 sm:p-3 text-xs sm:text-sm">Employee</th>
              <th className="p-2 sm:p-3 text-xs sm:text-sm hidden sm:table-cell">Date</th>
              <th className="p-2 sm:p-3 text-xs sm:text-sm">Status</th>
              <th className="p-2 sm:p-3 text-xs sm:text-sm hidden md:table-cell">Check-in</th>
              <th className="p-2 sm:p-3 text-xs sm:text-sm hidden md:table-cell">Check-out</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            ) : rows && rows.length > 0 ? (
              rows.map((r) => (
                <tr key={r.id} className="border-t hover:bg-slate-50 transition-colors">
                  <td className="p-2 sm:p-3 font-medium text-xs sm:text-sm">{r.name}</td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm hidden sm:table-cell">{r.date}</td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      r.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                      r.status === 'Absent' ? 'bg-rose-100 text-rose-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm hidden md:table-cell">{r.checkIn ? formatTo12Hour(r.checkIn) : '-'}</td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm hidden md:table-cell">{r.checkOut ? formatTo12Hour(r.checkOut) : '-'}</td>
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

