import { configureStore } from '@reduxjs/toolkit'
import employeeReducer from './employeeSlice'
import attendanceReducer from './attendanceSlice'

const PERSIST_KEY = 'attendflow_state_v1'

function loadState() {
  try {
    const raw = localStorage.getItem(PERSIST_KEY)
    if (!raw) return undefined
    const parsed = JSON.parse(raw)
    return {
      employees: { list: parsed.employees?.list || [] },
      attendance: { daily: parsed.attendance?.daily || [] },
    }
  } catch (err) {
    // ignore and fallback to defaults
    return undefined
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
