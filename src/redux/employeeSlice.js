import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  list: [],
}

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setEmployees(state, action) {
      state.list = action.payload
    },
    addEmployee(state, action) {
      state.list.push(action.payload)
    },
    updateEmployee(state, action) {
      const idx = state.list.findIndex((e) => e.id === action.payload.id)
      if (idx !== -1) state.list[idx] = action.payload
    },
    deleteEmployee(state, action) {
      state.list = state.list.filter((e) => e.id !== action.payload)
    },
  },
})

export const { setEmployees, addEmployee, updateEmployee, deleteEmployee } = employeeSlice.actions

// Selectors
export const selectEmployees = (state) => state.employees.list
export const selectEmployeeById = (state, id) => state.employees.list.find((e) => e.id === id)
export const selectEmployeeCount = (state) => state.employees.list.length

export default employeeSlice.reducer
