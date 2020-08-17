import React from 'react'
import { Gauge } from 'react-blessed-contrib'
import useInterval from '@use-it/interval'
import usePomodoro from '../hooks/usePomodoro'

export default function Pomodoro({
  top,
  left,
  width,
  height,
  screen,
  updateInterval = 1000,
  workInterval = 2, //25,
  breakInterval = 1 //5
}) {
  const layout = {
    top,
    left,
    width,
    height
  }
  const { state, dispatch } = usePomodoro({
    workInterval,
    breakInterval
  })

  React.useEffect(() => {
    const handleKey = key => {
      if (key === 's') {
        if (state.type === 'running') {
          dispatch({ type: 'pause' })
        } else if (state.type === 'paused') {
          dispatch({ type: 'resume' })
        } else if (state.type === 'stopped') {
          dispatch({ type: 'start' })
        }
      } else if (key === 'e') {
        dispatch({ type: 'exit' })
      }
    }
    screen.key(['s', 'e'], handleKey)
    return () => screen.removeKey(['s', 'e'], handleKey)
  }, [dispatch, screen, state.type])

  useInterval(() => {
    dispatch({ type: 'ping' })
  }, updateInterval)

  return (
    <box
      label="Pomodoro"
      {...layout}
      border={{ type: 'line' }}
      style={{
        border: { fg: 'blue' }
      }}
    >
      {/* 
      <text top={'0%'} left={'0%'}>
        {`\n ${state.info}`}
      </text>
      <text top={'25%'} left={'0%'}>
        {` ${state.instructions}`}
      </text>
      <Gauge
        left={0}
        top="100%-7"
        width="100%-2"
        fill="white"
        stroke="blue"
        label={state.status}
        showLabel={true}
        percent={state.percent}
        data={state.percent}
      />
      */}
      {JSON.stringify(state, null, 2)}
    </box>
  )
}
