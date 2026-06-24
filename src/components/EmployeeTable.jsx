import React from 'react'

export default function EmployeeTable({ employees, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-xl sm:rounded-[2rem] bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">Employee ID</th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">Full Name</th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">Mobile</th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">Email</th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">Department</th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">Designation</th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">Joining Date</th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {employees.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-sm text-slate-500">
                  No matching employees found.
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">{employee.id}</td>
                  <td className="px-4 py-4 text-sm font-medium text-slate-900">{employee.name}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{employee.phone}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{employee.email}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{employee.department}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{employee.designation}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{employee.joiningDate}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit('edit', employee)}
                        className="rounded-full border border-brand-600 px-3 py-1 text-xs font-semibold text-brand-700 transition hover:bg-brand-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(employee.id)}
                        className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
