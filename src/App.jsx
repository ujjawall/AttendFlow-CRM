import React from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employee from './pages/Employee'
import Attendance from './pages/Attendance'
import TailwindTest from './components/TailwindTest'
import RequireAuth from './components/RequireAuth'

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<Employee />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="tailwind-test" element={<TailwindTest />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
