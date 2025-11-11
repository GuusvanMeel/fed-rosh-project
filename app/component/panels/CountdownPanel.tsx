import React, { useState, useEffect } from 'react'


export function CountdownPanel({ targetTime }: { targetTime: Date }) {

  const calculateTimeLeft = () => {
    const now = new Date()
    const difference = targetTime.getTime() - now.getTime()
    return difference > 0 ? difference : 0
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (new Date(Date.now()) >= targetTime){
        setIsCompleted(true);
    }

    const timerId = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timerId)
  }, [timeLeft, targetTime])

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
  if(isCompleted){
    return <div className="w-full h-full flex items-center justify-center text-2xl text font-bold rounded select-none">Event Has Ended</div>

  }else return (
    <div className="w-full h-full flex items-center justify-center text-2xl font-bold rounded select-none">
      {formatTime(timeLeft)}
    </div>
  )
}
