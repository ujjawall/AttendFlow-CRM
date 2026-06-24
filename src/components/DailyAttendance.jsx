import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  makeSelectAttendanceForDate,
  addAttendance,
  updateAttendance,
} from '../redux/attendanceSlice'
import { selectEmployees } from '../redux/employeeSlice'
import Empty from './EmptyState'
import { formatTo12Hour } from '../utils/timeFormatters'

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

  const handleCheckInChange = (empId, checkIn) => {
    setRows((prev) => ({ ...prev, [empId]: { ...(prev[empId] || {}), checkIn } }))
  }

  const handleCheckOutChange = (empId, checkOut) => {
    setRows((prev) => ({ ...prev, [empId]: { ...(prev[empId] || {}), checkOut } }))
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
        checkIn: data.checkIn || '',
        checkOut: data.checkOut || '',
        timestamp: new Date().toISOString(),
      }
      if (data.id) dispatch(updateAttendance(payload))
      else dispatch(addAttendance(payload))
    })
  }

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <label className="text-xs sm:text-sm text-slate-600">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-2xl border border-slate-200 px-3 py-2.5 text-sm"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2 md:gap-4">
          <div className="text-xs sm:text-sm text-slate-500">Present: <span className="font-semibold">{counts.present}</span></div>
          <div className="text-xs sm:text-sm text-slate-500">Absent: <span className="font-semibold">{counts.absent}</span></div>
          <div className="text-xs sm:text-sm text-slate-500">Leave: <span className="font-semibold">{counts.leave}</span></div>
          <button
            onClick={handleSave}
            className="rounded-2xl bg-brand-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
          >
            Save Attendance
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border bg-white/60 backdrop-blur-sm shadow-sm">
        <table className="min-w-full text-xs sm:text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold hidden sm:table-cell">Employee ID</th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold">Name</th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold hidden md:table-cell">Department</th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold">Status</th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold">Check-in</th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold hidden sm:table-cell">Check-out</th>
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
                const rec = rows[emp.id] || { status: '', checkIn: '', checkOut: '' }
                return (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors border-t">
                    <td className="px-2 sm:px-4 py-3 font-medium text-xs sm:text-sm hidden sm:table-cell">{emp.id}</td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm">{emp.name}</td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm hidden md:table-cell">{emp.department}</td>
                    <td className="px-2 sm:px-4 py-3">
                      <div className="inline-block">
                        <select
                          value={rec.status || ''}
                          onChange={(e) => handleStatusChange(emp.id, e.target.value)}
                          className="rounded-full border border-slate-200 px-2 sm:px-3 py-2 bg-white/80 text-xs sm:text-sm"
                        >
                          <option value="">--</option>
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Leave">Leave</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <input
                        type="time"
                        value={rec.checkIn || ''}
                        onChange={(e) => handleCheckInChange(emp.id, e.target.value)}
                        className="rounded border border-slate-200 px-2 py-2 text-xs sm:text-sm bg-white/80 w-full"
                      />
                      {rec.checkIn && <div className="text-xs text-slate-500 mt-1">{formatTo12Hour(rec.checkIn)}</div>}
                    </td>
                    <td className="px-2 sm:px-4 py-3 hidden sm:table-cell">
                      <input
                        type="time"
                        value={rec.checkOut || ''}
                        onChange={(e) => handleCheckOutChange(emp.id, e.target.value)}
                        className="rounded border border-slate-200 px-2 py-2 text-xs sm:text-sm bg-white/80 w-full"
                      />
                      {rec.checkOut && <div className="text-xs text-slate-500 mt-1">{formatTo12Hour(rec.checkOut)}</div>}
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

