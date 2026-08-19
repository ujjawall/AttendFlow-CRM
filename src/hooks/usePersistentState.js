import { useEffect, useState } from 'react'

export default function usePersistentState(key, initialValue) {
  const resolveInitialValue = () => {
    const value = typeof initialValue === 'function' ? initialValue() : initialValue

    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return value
      return JSON.parse(raw)
    } catch (error) {
      return value
    }
  }

  const [value, setValue] = useState(resolveInitialValue)

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      // Ignore write errors when storage is unavailable.
    }
  }, [key, value])

  return [value, setValue]
}
