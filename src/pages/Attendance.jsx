import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectEmployees } from '../redux/employeeSlice'
import { selectDaily, makeSelectAttendanceForDate } from '../redux/attendanceSlice'
import DailyAttendance from '../components/DailyAttendance'
import MonthlySummary from '../components/MonthlySummary'

function formatDate(d) {
  return d
}

export default function Attendance() {
  const employees = useSelector(selectEmployees)
  const dailyAll = useSelector(selectDaily)

  const todayDefault = new Date().toISOString().slice(0, 10)
  const [activeTab, setActiveTab] = useState('daily')
  const [selectedDate, setSelectedDate] = useState(todayDefault)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })

  const selectForDate = useMemo(() => makeSelectAttendanceForDate(), [])
  const dailyRows = useSelector((state) => selectForDate(state, selectedDate))

  const monthlySummary = useMemo(() => {
    const [year, month] = selectedMonth.split('-')
    if (!year || !month) return { total: 0, present: 0, absent: 0, leave: 0 }
    const prefix = `${year}-${month}`
    const rows = dailyAll.filter((r) => r.date && r.date.startsWith(prefix))
    const totals = rows.reduce(
      (acc, cur) => {
        const st = (cur.status || '').toLowerCase()
        acc.total += 1
        if (st === 'present') acc.present += 1
        else if (st === 'absent') acc.absent += 1
        else if (st === 'leave') acc.leave += 1
        return acc
      },
      { total: 0, present: 0, absent: 0, leave: 0 },
    )
    return totals
  }, [dailyAll, selectedMonth])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Attendance</h1>
        <div className="text-sm text-slate-500">Manage daily and monthly attendance</div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-4 py-2 rounded-2xl text-sm font-medium ${activeTab === 'daily' ? 'bg-brand-600 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            Daily Attendance
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-4 py-2 rounded-2xl text-sm font-medium ${activeTab === 'monthly' ? 'bg-brand-600 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            Monthly Attendance Summary
          </button>
        </div>

        {activeTab === 'daily' && (
          <div className="mt-6">
            <DailyAttendance />
          </div>
        )}

        {activeTab === 'monthly' && (
          <div className="mt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <label className="text-sm text-slate-600">Select month</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="rounded-2xl border border-slate-200 px-3 py-2"
                />
              </div>
              <div className="text-sm text-slate-500">Summary for <span className="font-medium">{selectedMonth}</span></div>
            </div>

            <MonthlySummary month={selectedMonth} />
          </div>
        )}
      </div>
    </div>
  )
}
