import React from 'react'
import figlet from 'figlet'
import weather from 'weather-js'
import util from 'util'
import fs from 'fs'
import path from 'path'
import useInterval from '@use-it/interval'
import { useQuery } from 'react-query'
import chalk from 'chalk'
import gradient from 'gradient-string'

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

const centerFiglet = (text, width) => {
  const lines = text.split('\n')
  const longestLine = lines.reduce((memo, line) => {
    memo = line.length > memo ? line.length : memo
    return memo
  }, 0)
  const surroundingPadding = width - longestLine
  const leftPadding = Math.floor(surroundingPadding / 2)
  const centered =
    leftPadding >= 0
      ? lines.map(line => `${' '.repeat(leftPadding)}${line}`).join('\n')
      : text.replace(/[\n\s]+$/, '')
  console.log({ width, longestLine, surroundingPadding, leftPadding })
  return centered
}

const findWeather = util.promisify(weather.find)

const random = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

const fetchWeather = (key, options) => {
  return Promise.resolve([
    {
      location: { degreetype: 'F' },
      current: { temperature: random(50, 100), skytext: 'Normal' },
      forecast: [{}, { low: random(0, 50), high: random(50, 100) }]
    }
  ])
  // return findWeather(options)
}

const formatWeather = ([results]) => {
  const { location, current, forecast } = results
  const degreeType = location.degreetype
  const temperature = `${current.temperature}°${degreeType}`
  const conditions = current.skytext
  const low = `${forecast[1].low}°${degreeType}`
  const high = `${forecast[1].high}°${degreeType}`

  return `${chalk.yellow(temperature)} and ${chalk.green(
    conditions
  )} (${chalk.blue(low)} → ${chalk.red(high)})`
}

export default function Today({
  updateInterval = 900000, // 15 mins
  search = 'Nashville, TN',
  degreeType = 'F'
}) {
  const boxRef = React.useRef()
  const [now, setNow] = React.useState(new Date())
  const [fontIndex, setFontIndex] = React.useState(0)
  const [width, setWidth] = React.useState(100)

  useInterval(() => {
    setNow(new Date())
  }, 60000) // 1 min

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

  const date = chalk.blue(
    now.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  )

  const { status, data, error } = useQuery(
    ['weather', { search, degreeType }],
    fetchWeather,
    { refetchInterval: 5000 } //updateInterval }
  )

  React.useEffect(() => {
    setWidth(boxRef.current.width)
  }, [now])

  return (
    <box
      ref={boxRef}
      top="center"
      left="center"
      width="65%"
      height="65%"
      border={{ type: 'line' }}
      style={{
        border: { fg: 'blue' }
      }}
    >
      <text top={0} right={0}>
        {date}
      </text>
      <text top="center">{gradient.atlas(centerFiglet(time, width))}</text>
      {/* <text top="center" left="center">
        {gradient.atlas(time)}
      </text> */}
      <text top="100%-3" left={0}>
        {status === 'loading'
          ? 'Loading...'
          : error
          ? 'Error!'
          : formatWeather(data)}
      </text>
    </box>
  )
}
