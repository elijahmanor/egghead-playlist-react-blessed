import React, { useState, useEffect, useRef } from 'react'
import figlet from 'figlet'
import weather from 'weather-js'
import util from 'util'
import fs from 'fs'
import path from 'path'
import useInterval from '@use-it/interval'
import { useQuery } from 'react-query'

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

const findWeather = util.promisify(weather.find)

const fetchWeather = (key, options) => findWeather(options)

const formatWeather = ([results]) => {
  const degreeType = results.location.degreetype
  const forecast = {
    temperature: `${results.current.temperature}°${degreeType}`,
    conditions: results.current.skytext,
    low: `${results.forecast[1].low}°${degreeType}`,
    high: `${results.forecast[1].high}°${degreeType}`
  }
  return `${forecast.temperature} and ${forecast.conditions} (${forecast.low} → ${forecast.high})`
}

export default function Today({
  updateInterval = 900000, // 15 mins
  city = 'Nashville',
  degreeType = 'F'
}) {
  const [fontIndex, setFontIndex] = useState(0)
  const [now, setNow] = useState(new Date())

  useInterval(() => {
    setNow(new Date())
    setFontIndex(fontIndex + 1)
  }, updateInterval)

  const time = figlet.textSync(
    now.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),
    {
      font: FONTS[fontIndex % FONTS.length]
    }
  )
  const date = now.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  const search = 'Nashville, TN'
  const { status, data, error } = useQuery(
    ['user', { search, degreeType: 'F' }],
    fetchWeather,
    {
      refetchInterval: 60000,
      retry: 3
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

${
  status === 'loading' ? 'Loading...' : error ? 'Error!' : formatWeather(data)
}`}
    </box>
  )
}
