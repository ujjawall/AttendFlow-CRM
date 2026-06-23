import { createSlice, createSelector } from '@reduxjs/toolkit'

const initialState = {
  daily: [],
}

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setDaily(state, action) {
      state.daily = action.payload
    },
    addAttendance(state, action) {
      state.daily.push(action.payload)
    },
    updateAttendance(state, action) {
      const idx = state.daily.findIndex((a) => a.id === action.payload.id)
      if (idx !== -1) state.daily[idx] = action.payload
    },
    deleteAttendance(state, action) {
      state.daily = state.daily.filter((a) => a.id !== action.payload)
    },
    // markAttendance will create or update a record for employee/date
    markAttendance(state, action) {
      const { employeeId, date, status, ...rest } = action.payload
      const idx = state.daily.findIndex((r) => r.employeeId === employeeId && r.date === date)
      const record = { id: action.payload.id || `${employeeId}-${date}`, employeeId, date, status, ...rest }
      if (idx !== -1) state.daily[idx] = { ...state.daily[idx], ...record }
      else state.daily.push(record)
    },
  },
})

export const { setDaily, addAttendance, updateAttendance, deleteAttendance, markAttendance } = attendanceSlice.actions

// Base selector
const selectAttendanceDaily = (state) => state.attendance.daily

// Memoized selectors
export const selectDaily = selectAttendanceDaily

// Factory functions for selectors with parameters
export const makeSelectAttendanceForDate = () =>
  createSelector([selectAttendanceDaily, (_, dateStr) => dateStr], (daily, dateStr) =>
    daily.filter((a) => a.date === dateStr),
  )

export const makeSelectAttendanceCountsForDate = () =>
  createSelector([makeSelectAttendanceForDate()], (forDate) =>
    forDate.reduce(
      (acc, cur) => {
        const st = (cur.status || '').toLowerCase()
        if (st === 'present') acc.present += 1
        else if (st === 'absent') acc.absent += 1
        else if (st === 'leave') acc.leave += 1
        return acc
      },
      { present: 0, absent: 0, leave: 0 },
    ),
  )

export const makeSelectRecentAttendance = () =>
  createSelector([selectAttendanceDaily, (_, limit = 8) => limit], (daily, limit) => {
    const copy = [...daily]
    copy.sort((a, b) => {
      const ta = a.timestamp || `${a.date}T00:00:00`
      const tb = b.timestamp || `${b.date}T00:00:00`
      return new Date(tb) - new Date(ta)
    })
    return copy.slice(0, limit)
  })

export const makeSelectMonthlySummary = () =>
  createSelector([selectAttendanceDaily, (_, monthPrefix) => monthPrefix], (daily, monthPrefix) => {
    // monthPrefix: 'YYYY-MM'
    const rows = daily.filter((r) => r.date && r.date.startsWith(monthPrefix))
    const dateSet = new Set(rows.map((r) => r.date))
    const totalWorkingDays = dateSet.size

    const map = rows.reduce((acc, r) => {
      const id = r.employeeId
      if (!acc[id]) acc[id] = { present: 0, absent: 0, leave: 0 }
      const st = (r.status || '').toLowerCase()
      if (st === 'present') acc[id].present += 1
      else if (st === 'absent') acc[id].absent += 1
      else if (st === 'leave') acc[id].leave += 1
      return acc
    }, {})

    const totals = Object.values(map).reduce(
      (acc, cur) => {
        acc.present += cur.present
        acc.absent += cur.absent
        acc.leave += cur.leave
        return acc
      },
      { present: 0, absent: 0, leave: 0 },
    )

    return { perEmployeeMap: map, totals, totalWorkingDays }
  })

export default attendanceSlice.reducer
