import React from 'react'
import figlet from 'figlet'
import weather from 'weather-js'
import util from 'util'
import useInterval from '@use-it/interval'
import { isEqual } from "lodash"

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

const fetchWeather = (options) => {
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

  return `${temperature} and ${conditions} (${low} → ${high})`
}

const useRequest = (promise, options, interval = null) => {
  const [state, setState] = React.useState({
    status: 'loading',
    error: null,
    data: null
  })
  const prevOptions = React.useRef(null)

  const request = async options => {
    let data
    try {
      setState({ status: 'loading', error: null, data: null })
      data = await promise(options)
      setState({ status: 'complete', error: null, data })
    } catch (exception) {
      setState({ status: 'error', error: exception, data: null })
    }
  }
  React.useEffect(() => {
    if (!isEqual(prevOptions.current, options)) {
      request(options)
    }
  })
  useInterval(() => {
    request(options)
  }, interval)
  React.useEffect(() => {
    prevOptions.current = options;
  })

  return state
}

export default function Today({
  updateInterval = 900000, // 15 mins
  search = 'Nashville, TN',
  degreeType = 'F'
}) {
  const [now, setNow] = React.useState(new Date())
  // const [weather, setWeather] = React.useState({
  //   status: 'loading',
  //   error: null,
  //   data: null
  // })
  const [fontIndex, setFontIndex] = React.useState(0)

  const { status, error, data } = useRequest(
    fetchWeather,
    { search, degreeType },
    12000
  )

  /*
  const fetchData = async () => {
    setWeather({ status: "loading", error: null, data: null });
    const data = await fetchWeather({ search, degreeType });
    // const data = await findWeather({ search, degreeType });
    setWeather({ status: "complete", error: null, data });
  };
  */

  useInterval(() => {
    setNow(new Date())
  }, 60000) // 1 min

  /*
  useEffect(() => {
    fetchData();
  }, []);

  useInterval(() => {
    fetchData();
  }, 12000) // updateInterval
  */

  const date = now.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
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
