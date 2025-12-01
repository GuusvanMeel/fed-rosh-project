import React, { useState, useEffect, useCallback } from 'react'

export function CountdownPanel({ targetTime }: { targetTime: Date }) {
  const calculateTimeLeft = useCallback(() => {
    const now = new Date()
    const difference = targetTime.getTime() - now.getTime()
    return difference > 0 ? difference : 0
  }, [targetTime])

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (Date.now() >= targetTime.getTime()) {
      setIsCompleted(true)
    }

    const timerId = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)
      
      if (newTimeLeft === 0) {
        setIsCompleted(true)
      }
    }, 1000)

    return () => clearInterval(timerId)
  }, [calculateTimeLeft, targetTime])

  // Convert milliseconds to hh:mm:ss
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  if (isCompleted) {
    return (
      <div className="w-full h-full flex items-center justify-center text-2xl font-bold rounded select-none">
        Event Has Ended
      </div>
    )
  }
  
  return (
    <div className="w-full h-full flex items-center justify-center text-2xl font-bold rounded select-none">
      {formatTime(timeLeft)}
    </div>
  )
}