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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Total Present</div>
          <div className="mt-2 text-2xl font-semibold text-emerald-600">{totals.present}</div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Total Absent</div>
          <div className="mt-2 text-2xl font-semibold text-rose-600">{totals.absent}</div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Total Leave</div>
          <div className="mt-2 text-2xl font-semibold text-amber-600">{totals.leave}</div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white/60 backdrop-blur-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">Employee ID</th>
              <th className="px-4 py-3 text-left">Employee Name</th>
              <th className="px-4 py-3 text-left">Department</th>
              <th className="px-4 py-3 text-left">Present Days</th>
              <th className="px-4 py-3 text-left">Absent Days</th>
              <th className="px-4 py-3 text-left">Leave Days</th>
              <th className="px-4 py-3 text-left">Working Days</th>
              <th className="px-4 py-3 text-left">Attendance %</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {perEmployee.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-slate-500">No employee data for this month</td>
              </tr>
            ) : (
              perEmployee.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">{p.id}</td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3">{p.department}</td>
                  <td className="px-4 py-3 text-emerald-600">{p.present}</td>
                  <td className="px-4 py-3 text-rose-600">{p.absent}</td>
                  <td className="px-4 py-3 text-amber-600">{p.leave}</td>
                  <td className="px-4 py-3">{p.totalWorkingDays}</td>
                  <td className="px-4 py-3">{p.attendancePercent}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
