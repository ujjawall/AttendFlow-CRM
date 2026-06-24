import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectEmployees } from '../redux/employeeSlice'
import { selectDaily } from '../redux/attendanceSlice'

function safePercent(n, d) {
  if (!d) return '0%'
  return `${Math.round((n / d) * 100)}%`
}

export default function MonthlySummary({ month }) {
  const employees = useSelector(selectEmployees)
  const dailyAll = useSelector(selectDaily)

  const prefix = month || new Date().toISOString().slice(0, 7)

  const { perEmployee, totals, totalWorkingDays } = useMemo(() => {
    // filter records for the month
    const rows = dailyAll.filter((r) => r.date && r.date.startsWith(prefix))

    // compute distinct dates with records
    const dateSet = new Set(rows.map((r) => r.date))
    const totalWorkingDays = dateSet.size

    const perEmployee = employees.map((emp) => {
      const empRows = rows.filter((r) => r.employeeId === emp.id)
      const present = empRows.filter((r) => (r.status || '').toLowerCase() === 'present').length
      const absent = empRows.filter((r) => (r.status || '').toLowerCase() === 'absent').length
      const leave = empRows.filter((r) => (r.status || '').toLowerCase() === 'leave').length
      const total = present + absent + leave
      const percentage = totalWorkingDays ? Math.round((present / totalWorkingDays) * 100) : 0
      return {
        id: emp.id,
        name: emp.name,
        department: emp.department,
        present,
        absent,
        leave,
        totalWorkingDays,
        attendancePercent: `${percentage}%`,
      }
    })

    const totals = perEmployee.reduce(
      (acc, cur) => {
        acc.present += cur.present
        acc.absent += cur.absent
        acc.leave += cur.leave
        return acc
      },
      { present: 0, absent: 0, leave: 0 },
    )

    return { perEmployee, totals, totalWorkingDays }
  }, [employees, dailyAll, prefix])

  return (
    <div className="mt-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-lg bg-white p-3 sm:p-4 shadow-sm">
          <div className="text-xs sm:text-sm text-slate-500">Total Present</div>
          <div className="mt-2 text-xl sm:text-2xl font-semibold text-emerald-600">{totals.present}</div>
        </div>
        <div className="rounded-lg bg-white p-3 sm:p-4 shadow-sm">
          <div className="text-xs sm:text-sm text-slate-500">Total Absent</div>
          <div className="mt-2 text-xl sm:text-2xl font-semibold text-rose-600">{totals.absent}</div>
        </div>
        <div className="rounded-lg bg-white p-3 sm:p-4 shadow-sm">
          <div className="text-xs sm:text-sm text-slate-500">Total Leave</div>
          <div className="mt-2 text-xl sm:text-2xl font-semibold text-amber-600">{totals.leave}</div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white/60 backdrop-blur-sm">
        <table className="min-w-full text-xs sm:text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-2 sm:px-4 py-3 text-left font-semibold text-xs sm:text-sm hidden sm:table-cell">Employee ID</th>
              <th className="px-2 sm:px-4 py-3 text-left font-semibold text-xs sm:text-sm">Name</th>
              <th className="px-2 sm:px-4 py-3 text-left font-semibold text-xs sm:text-sm hidden md:table-cell">Department</th>
              <th className="px-2 sm:px-4 py-3 text-left font-semibold text-xs sm:text-sm">Present</th>
              <th className="px-2 sm:px-4 py-3 text-left font-semibold text-xs sm:text-sm">Absent</th>
              <th className="px-2 sm:px-4 py-3 text-left font-semibold text-xs sm:text-sm hidden sm:table-cell">Leave</th>
              <th className="px-2 sm:px-4 py-3 text-left font-semibold text-xs sm:text-sm hidden md:table-cell">Working Days</th>
              <th className="px-2 sm:px-4 py-3 text-left font-semibold text-xs sm:text-sm">Attendance %</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {perEmployee.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-2 sm:px-4 py-6 sm:py-8 text-center text-xs sm:text-sm text-slate-500">No employee data for this month</td>
              </tr>
            ) : (
              perEmployee.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors border-t">
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">{p.id}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm">{p.name}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden md:table-cell">{p.department}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-emerald-600 font-semibold text-xs sm:text-sm">{p.present}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-rose-600 font-semibold text-xs sm:text-sm">{p.absent}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-amber-600 font-semibold text-xs sm:text-sm hidden sm:table-cell">{p.leave}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden md:table-cell">{p.totalWorkingDays}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-xs sm:text-sm text-brand-600">{p.attendancePercent}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
