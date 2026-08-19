import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectEmployees } from '../redux/employeeSlice'
import { selectDaily, makeSelectAttendanceForDate } from '../redux/attendanceSlice'
import DailyAttendance from '../components/DailyAttendance'
import MonthlySummary from '../components/MonthlySummary'
import usePersistentState from '../hooks/usePersistentState'

function formatDate(d) {
  return d
}

export default function Attendance() {
  const employees = useSelector(selectEmployees)
  const dailyAll = useSelector(selectDaily)

  const todayDefault = new Date().toISOString().slice(0, 10)
  const [activeTab, setActiveTab] = usePersistentState('attendflow_attendance_tab', 'daily')
  const [selectedDate, setSelectedDate] = usePersistentState('attendflow_attendance_date', todayDefault)
  const [selectedMonth, setSelectedMonth] = usePersistentState('attendflow_attendance_month', () => {
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
      <div className="flex flex-col gap-5 rounded-[2rem] bg-[#edf4ff] p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Operations workspace</div>
          <h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em] text-slate-800">Attendance</h1>
          <p className="mt-2 text-lg text-slate-500">Manage daily and monthly attendance with confidence.</p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-[#e5edff] p-1.5 text-right">
          <button
            onClick={() => setActiveTab('daily')}
            className={`rounded-full px-5 py-2.5 text-base font-semibold transition-all ${
              activeTab === 'daily'
                ? 'bg-[#2f6df3] text-white shadow-[0_12px_25px_rgba(47,109,243,0.25)]'
                : 'text-slate-600'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`rounded-full px-5 py-2.5 text-base font-semibold transition-all ${
              activeTab === 'monthly'
                ? 'bg-[#2f6df3] text-white shadow-[0_12px_25px_rgba(47,109,243,0.25)]'
                : 'text-slate-600'
            }`}
          >
            Monthly Summary
          </button>
        </div>
      </div>

      <div className="rounded-[2rem] bg-white/60 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        {activeTab === 'daily' && (
          <div className="mt-2">
            <DailyAttendance />
          </div>
        )}

        {activeTab === 'monthly' && (
          <div className="mt-2">
            <div className="flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-[#edf4ff]/50 p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <label className="text-base font-medium text-slate-700">Select month</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none transition focus:border-[#2f6df3]"
                />
              </div>
              <div className="text-base text-slate-600">
                Summary for <span className="font-semibold text-slate-700">{selectedMonth}</span>
              </div>
            </div>

            <MonthlySummary month={selectedMonth} />
          </div>
        )}
      </div>
    </div>
  )
}
