import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import SummaryCards from '../components/SummaryCards'
import RecentAttendanceTable from '../components/RecentAttendanceTable'
import { selectEmployees, selectEmployeeCount } from '../redux/employeeSlice'
import { makeSelectAttendanceCountsForDate, makeSelectRecentAttendance } from '../redux/attendanceSlice'

export default function Dashboard() {
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="text-sm text-slate-500">Welcome back — here's the summary</div>
      </div>

      <SummaryCards stats={stats} />

      <RecentAttendanceTable rows={recentRows} />
    </div>
  )
}
