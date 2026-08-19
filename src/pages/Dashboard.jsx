import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import SummaryCards from '../components/SummaryCards'
import RecentAttendanceTable from '../components/RecentAttendanceTable'
import { selectEmployees, selectEmployeeCount } from '../redux/employeeSlice'
import { makeSelectAttendanceCountsForDate, makeSelectRecentAttendance } from '../redux/attendanceSlice'

export default function Dashboard() {
  const navigate = useNavigate()
  const employees = useSelector(selectEmployees)
  const total = useSelector(selectEmployeeCount)

  const today = new Date().toISOString().slice(0, 10)
  const selectCountsForToday = useMemo(() => makeSelectAttendanceCountsForDate(), [])
  const selectRecentForLimit = useMemo(() => makeSelectRecentAttendance(), [])
  const counts = useSelector((state) => selectCountsForToday(state, today))
  const recentRows = useSelector((state) => selectRecentForLimit(state, 8))

  const stats = {
    total,
    present: counts.present || 0,
    absent: counts.absent || 0,
    leave: counts.leave || 0,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] bg-[#edf4ff] p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm text-slate-500">Wednesday, August 20, 2026</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-800">Good morning, Demo</h1>
          <p className="mt-2 text-base text-slate-500">Here's what's happening across your team today.</p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/attendance')}
          className="inline-flex items-center justify-center rounded-2xl bg-[#2f6df3] px-5 py-3 text-base font-semibold text-white shadow-[0_12px_25px_rgba(47,109,243,0.3)] transition hover:bg-[#255ed6]"
        >
          Mark attendance
        </button>
      </div>

      <SummaryCards stats={stats} />

      <RecentAttendanceTable rows={recentRows} />
    </div>
  )
}
