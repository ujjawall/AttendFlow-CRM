import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  makeSelectAttendanceForDate,
  addAttendance,
  updateAttendance,
} from '../redux/attendanceSlice'
import { selectEmployees } from '../redux/employeeSlice'
import Empty from './EmptyState'
import usePersistentState from '../hooks/usePersistentState'

function genId(empId) {
  return `att-${Date.now()}-${empId}`
}

export default function DailyAttendance() {
  const dispatch = useDispatch()
  const employees = useSelector(selectEmployees)
  const [selectedDate, setSelectedDate] = usePersistentState('attendflow_daily_selected_date', new Date().toISOString().slice(0, 10))

  // map of employeeId -> { id?, status }
  const [rows, setRows] = usePersistentState('attendflow_daily_rows', {})

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
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-[#edf4ff]/60 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <label className="text-base font-medium text-slate-700">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none transition focus:border-[#2f6df3]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-[#dff5ec] px-3 py-1.5 text-sm font-semibold text-[#1caf6e]">• Present {counts.present}</span>
          <span className="inline-flex items-center rounded-full bg-[#ffe1e5] px-3 py-1.5 text-sm font-semibold text-[#eb5d69]">• Absent {counts.absent}</span>
          <span className="inline-flex items-center rounded-full bg-[#fff4d9] px-3 py-1.5 text-sm font-semibold text-[#d39a1a]">• Leave {counts.leave}</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#edf4ff]">
              <tr className="text-left text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                <th className="px-4 py-4">Employee ID</th>
                <th className="px-4 py-4">Name</th>
                <th className="px-4 py-4">Department</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Check-in</th>
                <th className="px-4 py-4">Check-out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8">
                    <Empty title="No employees yet" description="Add employees from the Employee page to mark attendance." />
                  </td>
                </tr>
              ) : (
                employees.map((emp) => {
                  const rec = rows[emp.id] || { status: '', checkIn: '', checkOut: '' }
                  return (
                    <tr key={emp.id} className="bg-white transition-colors hover:bg-slate-50">
                      <td className="px-4 py-4 text-slate-700">{emp.id}</td>
                      <td className="px-4 py-4 font-semibold text-slate-800">{emp.name}</td>
                      <td className="px-4 py-4 text-slate-600">{emp.department}</td>
                      <td className="px-4 py-4">
                        <select
                          value={rec.status || ''}
                          onChange={(e) => handleStatusChange(emp.id, e.target.value)}
                          className="w-full rounded-full border border-slate-200 bg-[#fff8f8] px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-[#2f6df3]"
                        >
                          <option value="">--</option>
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Leave">Leave</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="time"
                          value={rec.checkIn || ''}
                          onChange={(e) => handleCheckInChange(emp.id, e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#2f6df3]"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="time"
                          value={rec.checkOut || ''}
                          onChange={(e) => handleCheckOutChange(emp.id, e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#2f6df3]"
                        />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-[#2f6df3] px-5 py-3 text-base font-semibold text-white shadow-[0_12px_25px_rgba(47,109,243,0.3)] transition hover:bg-[#255ed6]"
      >
        Save attendance
      </button>
    </div>
  )
}

