import React from 'react'

export default function TailwindTest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white/80 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-indigo-600">Tailwind v4 is working!</h1>
        <p className="mt-4 text-slate-700">If you see this styled component, Tailwind is configured correctly.</p>
      </div>
    </div>
  )
}
