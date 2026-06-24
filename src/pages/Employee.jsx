import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addEmployee, deleteEmployee, updateEmployee } from '../redux/employeeSlice'
import EmployeeTable from '../components/EmployeeTable'

const defaultForm = {
  id: '',
  name: '',
  phone: '',
  email: '',
  department: '',
  designation: '',
  joiningDate: '',
}

export default function Employee() {
  const dispatch = useDispatch()
  const employees = useSelector((state) => state.employees.list)
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState('add')
  const [form, setForm] = useState(defaultForm)

  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return employees
    const query = search.toLowerCase()
    return employees.filter((employee) =>
      [employee.id, employee.name, employee.email, employee.phone, employee.department, employee.designation]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [employees, search])

  const openModal = (type, employee = defaultForm) => {
    setMode(type)
    setForm(employee)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setForm(defaultForm)
    setMode('add')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const employeePayload = {
      ...form,
      id: form.id || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
    }

    if (mode === 'edit') {
      dispatch(updateEmployee(employeePayload))
    } else {
      dispatch(addEmployee(employeePayload))
    }

    closeModal()
  }

  const handleDelete = (employeeId) => {
    if (window.confirm('Delete this employee permanently?')) {
      dispatch(deleteEmployee(employeeId))
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Employee Directory</h1>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500 max-w-2xl">
            Manage your CRM workforce with quick search, edit, and employee analytics.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal('add')}
          className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 w-full sm:w-auto"
        >
          Add Employee
        </button>
      </div>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl sm:rounded-3xl bg-white p-3 sm:p-5 shadow-soft">
          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs sm:text-sm text-slate-500">Employee count</div>
              <div className="mt-1 text-2xl sm:text-3xl font-semibold text-slate-900">{employees.length}</div>
            </div>
            <div className="w-full sm:w-auto">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:bg-white sm:w-80"
              />
            </div>
          </div>
        </div>
      </div>

      <EmployeeTable employees={filteredEmployees} onEdit={openModal} onDelete={handleDelete} />

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-3 sm:px-4 py-4 sm:py-6">
          <div className="w-full max-w-2xl sm:max-w-3xl rounded-xl sm:rounded-[2rem] bg-white p-4 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                  {mode === 'edit' ? 'Edit Employee' : 'Add Employee'}
                </h2>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500">
                  {mode === 'edit'
                    ? 'Update the employee profile and save changes.'
                    : 'Add a new employee to the CRM employee directory.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-slate-200 px-2 sm:px-3 py-1.5 sm:py-2 text-slate-500 transition hover:bg-slate-100 flex-shrink-0"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 sm:grid-cols-2">
              <label className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-slate-700">
                Employee ID
                <input
                  type="text"
                  name="id"
                  value={form.id}
                  onChange={handleChange}
                  placeholder="EMP-1234"
                  className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:bg-white"
                />
              </label>

              <label className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-slate-700">
                Full Name
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Sonia Verma"
                  className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:bg-white"
                />
              </label>

              <label className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-slate-700">
                Mobile Number
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="9876543210"
                  className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:bg-white"
                />
              </label>

              <label className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-slate-700">
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="sonia.verma@attendflow.com"
                  className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:bg-white"
                />
              </label>

              <label className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-slate-700">
                Department
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                  placeholder="Product"
                  className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:bg-white"
                />
              </label>

              <label className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-slate-700">
                Designation
                <input
                  type="text"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  required
                  placeholder="UX Designer"
                  className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:bg-white"
                />
              </label>

              <label className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-slate-700 sm:col-span-2">
                Joining Date
                <input
                  type="date"
                  name="joiningDate"
                  value={form.joiningDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:bg-white"
                />
              </label>

              <div className="sm:col-span-2 flex flex-col-reverse gap-2 sm:gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl sm:rounded-2xl bg-brand-600 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  {mode === 'edit' ? 'Save Changes' : 'Create Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
