import React, { Fragment } from 'react'
import timeLog from '../utils/timeLog'
import useRequest from '../hooks/useRequest'

const fetchTimeLog = async () => {
  return new Promise(resolve => {
    const { entries, summary } = timeLog.getLog()
    resolve({ entries, summary })
  })
}

export default function TimeLog({
  screen,
  top,
  left,
  width,
  height,
  updateInterval
}) {
  const layout = {
    top,
    left,
    width,
    height
  }
  const { status, error, data, refetch } = useRequest(
    fetchTimeLog,
    {},
    updateInterval
  )

  React.useEffect(() => {
    const handleKey = key => {
      if (key === 'i') {
        timeLog.logIn()
      } else if (key === 'o') {
        timeLog.logOut()
      }
      refetch()
    }
    screen.key(['i', 'o'], handleKey)
    return () => screen.removeKey(['i', 'o'], handleKey)
  }, [])

  return (
    <box
      label="⏳  Time Log (i/o)"
      {...layout}
      border={{ type: 'line' }}
      style={{
        border: { fg: 'blue' }
      }}
      padding={{
        top: 1,
        left: 1,
        right: 1
      }}
    >
      {status === 'loading' ? (
        'Loading...'
      ) : error ? (
        'Error!'
      ) : (
        <Fragment>
          {data.entries}
          <text top="100%-6" left={'0%'}>
            {data.summary}
          </text>
        </Fragment>
      )}
    </box>
  )
}
