import { useEffect, useState } from 'react'

const PREFIX = 'cah-webgame-'

export default function useLocalStorage(key: string, initialValue: any) {
  const prefixKey = PREFIX + key
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(prefixKey)
    if (jsonValue !== null) return JSON.parse(jsonValue)
    if (typeof initialValue === 'function') {
      return initialValue()
    } else {
      return initialValue
    }
  })

  useEffect(() => {
    localStorage.setItem(prefixKey, JSON.stringify(value))
  }, [prefixKey, value])

  return [value, setValue]
}