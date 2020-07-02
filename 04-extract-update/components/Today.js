import React, {
  useState,
  useEffect,
  useRef
} from 'react'
import figlet from 'figlet'

const FONTS = [
  'Straight',
  'ANSI Shadow',
  'Shimrod',
  'doom',
  'Big',
  'Ogre',
  'Small',
  'Standard',
  'Bigfig',
  'Mini',
  'Small Script',
  'Small Shadow'
]


export default function Today({
  updateInterval = 1000
}) {
  const [
    count,
    setCount
  ] = useState(0)
  const timer = useRef(null)
  useEffect(() => {
    timer.current = setTimeout(
      () => setCount(count + 1),
      updateInterval
    )
    return () =>
      clearTimeout(timer.current)
  }, [count])

  const [weather, setWeather] = useState("")
  const weatherTimer = useRef(null)
  useEffect(() => {
    console.log( "in weather useEffect")
    await fetchWeather()
    weatherTimer.current = setTimeout(
      () => {
        const current = await fetchWeather(city); 
        setWeather(current)
      },
      updateInterval
    )
    return () =>
      clearTimeout(
        weatherTimer.current
      )
  }, [])

  const time = figlet.textSync(
    new Date().toLocaleString(
      'en-US',
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
    ),
    {
      font:
        FONTS[count % FONTS.length]
    }
  )
  const date = new Date().toLocaleString(
    'en-US',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }
  )

  return (
    <box
      top="center"
      left="center"
      width="65%"
      height="65%"
      border={{ type: 'line' }}
      style={{
        border: { fg: 'blue' }
      }}
    >
      {`${date}

${time}`}
    </box>
  )
}
