import React, { Fragment } from 'react'
import Box from './Box'
import timeLog from '../apis/timeLog'
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
  updateInterval = 60000
}) {
  const layout = {
    top,
    left,
    width,
    height
  }
  const padding = { top: 1, right: 1, left: 1 }
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
  }, [screen, refetch])

  return (
    <Box label="Time Log (i/o)" {...layout} padding={padding}>
      {status === 'loading' ? (
        'Loading...'
      ) : error ? (
        'Error!'
      ) : (
        <Fragment>
          <text>{data.entries}</text>
          <text top="100%-6">{data.summary}</text>
        </Fragment>
      )}
    </Box>
  )
}
