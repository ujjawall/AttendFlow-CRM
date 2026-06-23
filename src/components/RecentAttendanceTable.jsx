import React from 'react'
import { Empty } from './EmptyState'

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="p-3"><div className="h-4 bg-slate-200 rounded w-28" /></td>
      <td className="p-3"><div className="h-4 bg-slate-200 rounded w-20" /></td>
      <td className="p-3"><div className="h-4 bg-slate-200 rounded w-16" /></td>
      <td className="p-3"><div className="h-4 bg-slate-200 rounded w-20" /></td>
      <td className="p-3"><div className="h-4 bg-slate-200 rounded w-20" /></td>
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
            <tr className="text-left text-xs text-slate-500 uppercase bg-white/50">
              <th className="p-3">Employee</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Check-in</th>
              <th className="p-3">Check-out</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            ) : rows && rows.length > 0 ? (
              rows.map((r) => (
                <tr key={r.id} className="border-t hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-medium">{r.name}</td>
                  <td className="p-3">{r.date}</td>
                  <td className="p-3">{r.status}</td>
                  <td className="p-3">{r.checkIn || '-'}</td>
                  <td className="p-3">{r.checkOut || '-'}</td>
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

