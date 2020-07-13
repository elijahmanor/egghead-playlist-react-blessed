import React from 'react'
import figlet from 'figlet'
import weather from 'weather-js'
import util from 'util'
import useInterval from '@use-it/interval'
import { isEqual } from 'lodash'
import chalk from 'chalk'
import gradient from 'gradient-string'
import useRequest from '../hooks/useRequest'

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

const random = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

const fetchWeather = options => {
  return new Promise(resolve =>
    setTimeout(() => {
      resolve([
        {
          location: { degreetype: options.degreeType },
          current: { temperature: random(50, 100), skytext: 'Normal' },
          forecast: [{}, { low: random(0, 50), high: random(50, 100) }]
        }
      ])
    }, 1000)
  )
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
  degreeType = 'F',
  ...rest
}) {
  const [now, setNow] = React.useState(new Date())
  const [fontIndex, setFontIndex] = React.useState(0)

  const { status, error, data } = useRequest(
    fetchWeather,
    { search, degreeType },
    updateInterval
  )

  useInterval(() => {
    setNow(new Date())
  }, 60000)

  const date = chalk.blue(
    now.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  )
  const time = gradient.atlas(
    figlet.textSync(
      now.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      {
        font: FONTS[fontIndex % FONTS.length]
      }
    )
  )

  return (
    <box
      label="🌤  Today"
      border={{ type: 'line' }}
      style={{
        border: { fg: 'blue' }
      }}
      {...rest}
    >
      <text top={0} right={1}>
        {date}
      </text>
      <text top="center" left="center">
        {time}
      </text>
      <text top="100%-3" left={1}>
        {status === 'loading'
          ? 'Loading...'
          : error
          ? 'Error!'
          : formatWeather(data)}
      </text>{' '}
    </box>
  )
}
