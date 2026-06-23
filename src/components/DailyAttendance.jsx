import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  makeSelectAttendanceForDate,
  addAttendance,
  updateAttendance,
} from '../redux/attendanceSlice'
import { selectEmployees } from '../redux/employeeSlice'
import Empty from './EmptyState'

function genId(empId) {
  return `att-${Date.now()}-${empId}`
}

export default function DailyAttendance() {
  const dispatch = useDispatch()
  const employees = useSelector(selectEmployees)
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10))

  // map of employeeId -> { id?, status }
  const [rows, setRows] = useState({})

  const attendanceDaily = useSelector((state) => state.attendance.daily)

  useEffect(() => {
    // initialize rows from employees and existing attendance
    const existing = attendanceDaily.filter((a) => a.date === selectedDate)
    const map = {}
    employees.forEach((emp) => {
      const rec = existing.find((r) => r.employeeId === emp.id)
      map[emp.id] = {
        id: rec?.id || null,
        status: rec?.status || '',
      }
    })
    setRows(map)
  }, [employees, selectedDate, attendanceDaily])

  const counts = useMemo(() => {
    let present = 0
    let absent = 0
    let leave = 0
    Object.values(rows).forEach((r) => {
      const s = (r.status || '').toLowerCase()
      if (s === 'present') present += 1
      else if (s === 'absent') absent += 1
      else if (s === 'leave') leave += 1
    })
    return { present, absent, leave }
  }, [rows])

  const handleStatusChange = (empId, status) => {
    setRows((prev) => ({ ...prev, [empId]: { ...(prev[empId] || {}), status } }))
  }

  const handleSave = () => {
    // iterate and dispatch adds/updates
    Object.entries(rows).forEach(([empId, data]) => {
      const emp = employees.find((e) => e.id === empId)
      if (!emp) return
      const payload = {
        id: data.id || genId(empId),
        employeeId: empId,
        name: emp.name,
        department: emp.department,
        date: selectedDate,
        status: data.status || 'Absent',
        timestamp: new Date().toISOString(),
      }
      if (data.id) dispatch(updateAttendance(payload))
      else dispatch(addAttendance(payload))
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-2xl border border-slate-200 px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-500">Present: <span className="font-semibold">{counts.present}</span></div>
          <div className="text-sm text-slate-500">Absent: <span className="font-semibold">{counts.absent}</span></div>
          <div className="text-sm text-slate-500">Leave: <span className="font-semibold">{counts.leave}</span></div>
          <button
            onClick={handleSave}
            className="ml-4 rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Save Attendance
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border bg-white/60 backdrop-blur-sm shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">Employee ID</th>
              <th className="px-4 py-3 text-left">Employee Name</th>
              <th className="px-4 py-3 text-left">Department</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {employees.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8">
                  <Empty title="No employees yet" description="Add employees from the Employee page to mark attendance." />
                </td>
              </tr>
            ) : (
              employees.map((emp) => {
                const rec = rows[emp.id] || { status: '' }
                return (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium">{emp.id}</td>
                    <td className="px-4 py-3">{emp.name}</td>
                    <td className="px-4 py-3">{emp.department}</td>
                    <td className="px-4 py-3">
                      <div className="inline-block">
                        <select
                          value={rec.status || ''}
                          onChange={(e) => handleStatusChange(emp.id, e.target.value)}
                          className="rounded-full border border-slate-200 px-3 py-2 bg-white/80"
                        >
                          <option value="">--</option>
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Leave">Leave</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

