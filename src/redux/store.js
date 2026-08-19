import { configureStore } from '@reduxjs/toolkit'
import employeeReducer from './employeeSlice'
import attendanceReducer from './attendanceSlice'

const PERSIST_KEY = 'attendflow_state_v1'

function isoOffset(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const defaultEmployees = [
  { id: 'EMP-1001', name: 'Aarav Sharma', phone: '9876543210', email: 'aarav@attendflow.com', department: 'Engineering', designation: 'Frontend Developer', joiningDate: '2024-01-15' },
  { id: 'EMP-1002', name: 'Nisha Verma', phone: '9812345678', email: 'nisha@attendflow.com', department: 'HR', designation: 'HR Manager', joiningDate: '2023-08-20' },
  { id: 'EMP-1003', name: 'Rahul Mehta', phone: '9988776655', email: 'rahul@attendflow.com', department: 'Sales', designation: 'Sales Executive', joiningDate: '2024-06-10' },
]

const defaultAttendance = [
  { id: 'att-1001', employeeId: 'EMP-1001', name: 'Aarav Sharma', department: 'Engineering', date: isoOffset(-1), status: 'Present', checkIn: '09:10', checkOut: '18:00', timestamp: new Date().toISOString() },
  { id: 'att-1002', employeeId: 'EMP-1002', name: 'Nisha Verma', department: 'HR', date: isoOffset(-1), status: 'Absent', checkIn: '', checkOut: '', timestamp: new Date().toISOString() },
  { id: 'att-1003', employeeId: 'EMP-1003', name: 'Rahul Mehta', department: 'Sales', date: isoOffset(-1), status: 'Leave', checkIn: '', checkOut: '', timestamp: new Date().toISOString() },
  { id: 'att-1004', employeeId: 'EMP-1001', name: 'Aarav Sharma', department: 'Engineering', date: isoOffset(0), status: 'Present', checkIn: '09:12', checkOut: '18:10', timestamp: new Date().toISOString() },
  { id: 'att-1005', employeeId: 'EMP-1002', name: 'Nisha Verma', department: 'HR', date: isoOffset(0), status: 'Present', checkIn: '09:20', checkOut: '17:50', timestamp: new Date().toISOString() },
  { id: 'att-1006', employeeId: 'EMP-1003', name: 'Rahul Mehta', department: 'Sales', date: isoOffset(0), status: 'Absent', checkIn: '', checkOut: '', timestamp: new Date().toISOString() },
]

function loadState() {
  try {
    const raw = localStorage.getItem(PERSIST_KEY)
    if (!raw) {
      return {
        employees: { list: defaultEmployees },
        attendance: { daily: defaultAttendance },
      }
    }
    const parsed = JSON.parse(raw)
    return {
      employees: { list: parsed.employees?.list?.length ? parsed.employees.list : defaultEmployees },
      attendance: { daily: parsed.attendance?.daily?.length ? parsed.attendance.daily : defaultAttendance },
    }
  } catch (err) {
    return {
      employees: { list: defaultEmployees },
      attendance: { daily: defaultAttendance },
    }
  }
}

function saveState(state) {
  try {
    const toSave = {
      employees: { list: state.employees?.list || [] },
      attendance: { daily: state.attendance?.daily || [] },
    }
    localStorage.setItem(PERSIST_KEY, JSON.stringify(toSave))
  } catch (err) {
    // ignore write errors (e.g., quota)
  }
}

const preloadedState = loadState()

const store = configureStore({
  reducer: {
    employees: employeeReducer,
    attendance: attendanceReducer,
  },
  preloadedState,
  devTools: process.env.NODE_ENV !== 'production',
})

// throttle saves to once per 500ms window
let saveTimeout = null
store.subscribe(() => {
  if (saveTimeout) return
  saveTimeout = setTimeout(() => {
    saveState(store.getState())
    saveTimeout = null
  }, 500)
})

export default store
