import React, {
  useState,
  useEffect,
  useRef
} from 'react'
import figlet from 'figlet'
import weather from 'weather-js'
import util from 'util'
import fs from 'fs'
import path from 'path'
import useInterval from '@use-it/interval'

const findWeather = util.promisify(
  weather.find
)

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

const getWeather = async (
  city,
  degreeType
) => {
  console.log('getting weather...')
  const [
    results
  ] = await findWeather({
    search: city,
    degreeType
  })
  const forecast = {
    temperature: `${results.current.temperature}°${degreeType}`,
    conditions:
      results.current.skytext,
    low: `${results.forecast[1].low}°${degreeType}`,
    high: `${results.forecast[1].high}°${degreeType}`
  }
  fs.appendFileSync(
    '.dev.debug',
    `\n${JSON.stringify(
      { results, forecast },
      null,
      2
    )}`,
    'utf-8'
  )
  return `${forecast.temperature} and ${forecast.conditions} (${forecast.low} → ${forecast.high})`
}

export default function Today({
  updateInterval = 900000, // 15 mins
  city = 'Nashville',
  degreeType = 'F'
}) {
  const [
    count,
    setCount
  ] = useState(0)
  const timer = useRef(null)
  useEffect(() => {
    timer.current = setTimeout(
      () => setCount(count + 1),
      60000 // 1 min
    )
    return () =>
      clearTimeout(timer.current)
  }, [count])

  const [
    weather,
    setWeather
  ] = useState('')

  // useInterval(() => {
  //   const fetchData = async () => {
  //     const current = await getWeather(
  //       city,
  //       degreeType
  //     )
  //     setWeather(current)
  //   }

  //   fetchData()
  // }, updateInterval)

  const weatherTimer = useRef(null)
  useEffect(() => {
    const fetchData = async () => {
      const current = await getWeather(
        city,
        degreeType
      )
      setWeather(current)
    }

    weatherTimer.current = setInterval(
      () => {
        fetchData()
      },
      updateInterval
    )

    fetchData()

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

${time}

${weather}`}
    </box>
  )
}
