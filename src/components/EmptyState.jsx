import React from 'react'
import { Inbox } from 'lucide-react'

export function Empty({ title = 'No data', description = '' }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-6">
      <div className="p-4 rounded-full bg-white/40 backdrop-blur-sm border border-white/10 mb-4">
        <Inbox className="w-8 h-8 text-slate-500" />
      </div>
      <div className="text-lg font-semibold">{title}</div>
      {description ? <div className="text-sm text-slate-500 mt-2">{description}</div> : null}
    </div>
  )
}

export default Empty
