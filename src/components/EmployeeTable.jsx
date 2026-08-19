import React from 'react'

export default function EmployeeTable({ employees, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/80 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-800">All employees</h2>
          <p className="mt-1 text-base text-slate-500">Keep your team information organized and up to date.</p>
        </div>
        <div className="inline-flex items-center rounded-full bg-[#eaf2ff] px-3 py-1.5 text-sm font-semibold text-[#2f6df3]">{employees.length} of {employees.length}</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full text-sm">
          <thead>
            <tr className="bg-[#edf4ff] text-left text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <th className="px-5 py-4">Employee ID</th>
              <th className="px-5 py-4">Full Name</th>
              <th className="px-5 py-4">Mobile</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Department</th>
              <th className="px-5 py-4">Designation</th>
              <th className="px-5 py-4">Joining Date</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-sm text-slate-500">
                  No matching employees found.
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee.id} className="border-t border-slate-200 bg-white hover:bg-slate-50">
                  <td className="px-5 py-4 text-slate-700">{employee.id}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf2ff] text-xs font-bold text-[#2f6df3]">
                        {employee.name
                          .split(' ')
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800">{employee.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{employee.phone}</td>
                  <td className="px-5 py-4 text-slate-600">{employee.email}</td>
                  <td className="px-5 py-4 text-slate-600">{employee.department}</td>
                  <td className="px-5 py-4 text-slate-600">{employee.designation}</td>
                  <td className="px-5 py-4 text-slate-600">{employee.joiningDate}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit('edit', employee)}
                        className="rounded-xl border border-[#2f6df3] bg-white px-3 py-2 text-sm font-semibold text-[#2f6df3] transition hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(employee.id)}
                        className="rounded-xl border border-[#ef5a67] bg-white px-3 py-2 text-sm font-semibold text-[#ef5a67] transition hover:bg-rose-50"
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
