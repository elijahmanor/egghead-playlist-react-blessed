import React from 'react'
import { Gauge } from 'react-blessed-contrib'
import useRequest from '../hooks/useRequest'
import chalk from 'chalk'
import { startCase } from 'lodash'
import useInterval from '@use-it/interval'
import notifier from 'node-notifier'
const {
  isToday,
  differenceInMinutes,
  differenceInSeconds,
  differenceInHours,
  distanceInWordsStrict,
  addMinutes,
  addSeconds,
  getDayOfYear,
  getDaysInYear
} = require('date-fns')

const minutesToHours = mins => {
  const negative = mins < 0
  const hours = Math.abs(mins) / 60
  const rhours = Math.floor(hours)
  const minutes = (hours - rhours) * 60
  const rminutes = Math.round(minutes)
  return `${negative ? '-' : ' '}${rhours
    .toString()
    .padStart(2, '0')}:${rminutes.toString().padStart(2, '0')}`
}

const initialState = {
  mode: 'work',
  type: 'stopped',
  status: 'Stopped',
  info: `${chalk.yellow('0')} completed today.`,
  instructions: `Press ${chalk.green('s')} to ${chalk.green('start')}.`,
  completed: 0,
  percent: 100,
  workDate: null,
  breakDate: null,
  timeLeftWhenPaused: 0,
  workInterval: 25,
  breakInterval: 5
}

const init = value => ({ ...initialState, ...value })

// mode work, break
// type running, paused, stopped
function reducer(state, action) {
  let {
    mode,
    type,
    status,
    timeLeftWhenPaused,
    workDate,
    workInterval,
    breakDate,
    breakInterval,
    percent,
    instructions,
    info,
    completed
  } = state
  switch (action.type) {
    case 'start':
      if (timeLeftWhenPaused) {
        workDate = addSeconds(new Date(), timeLeftWhenPaused)
        timeLeftWhenPaused = 0
      } else {
        workDate = addMinutes(new Date(), workInterval)
      }
      instructions = `Press ${chalk.blue('s')} to ${chalk.blue(
        'pause'
      )},\n${' '.repeat(7)}${chalk.red('e')} to ${chalk.red('exit')}.`
      return {
        ...state,
        type: 'running',
        workDate,
        instructions,
        timeLeftWhenPaused
      }
    case 'pause':
      return { ...state, type: 'paused' }
    case 'resume':
      return { ...state, type: 'running' }
    case 'ping':
      if (type === 'running') {
        const date = workDate || breakDate
        const secondsLeft = differenceInSeconds(date, new Date())
        if (secondsLeft >= 0) {
          status = `${
            mode === 'work' ? chalk.green('Working') : chalk.blue('Breaking')
          }... ${chalk.yellow(`${minutesToHours(secondsLeft)} left`)}`
          const totalSeconds =
            mode === 'work' ? workInterval * 60 : breakInterval * 60
          percent = (secondsLeft / totalSeconds) * 100
          percent = percent <= 1.1 ? 1.1 : percent // weird bug w/ control
        }
        info = `${chalk.yellow(completed)} completed today.`
        instructions = `Press ${chalk.blue('s')} to ${chalk.blue(
          'pause'
        )},\n${' '.repeat(7)}${chalk.red('e')} to ${chalk.red('exit')}.`
      } else if (type === 'paused') {
        instructions = `Press ${chalk.green('s')} to ${chalk.green(
          'resume'
        )},\n${' '.repeat(7)}${chalk.red('e')} to ${chalk.red('exit')}.`
        status = `${chalk.gray('Paused...')} ${chalk.gray(
          `${minutesToHours(timeLeftWhenPaused)} left`
        )}`
      } else if (type === 'stopped') {
        instructions = `Press ${chalk.green('s')} to ${chalk.green(
          'start'
        )},\n${' '.repeat(7)}${chalk.red('e')} to ${chalk.red('exit')}.`
        status = `${chalk.red('Stopped.')}`
      }
      return { ...state, status, percent, info, instructions }
    case 'exit':
      return { ...state, type: 'stopped' }
    default:
      throw new Error()
  }
}

const usePomodoro = ({ workInterval, breakInterval, updateInterval }) => {
  const [state, dispatch] = React.useReducer(
    reducer,
    { ...initialState, workInterval, breakInterval },
    init
  )

  return { state, dispatch }
}

export default function Pomodoro({
  screen,
  top,
  left,
  width,
  height,
  updateInterval,
  workInterval = 25,
  breakInterval = 5
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
  }, [state])

  useInterval(() => {
    dispatch({ type: 'ping' })
  }, updateInterval)

  return (
    <box
      label="🍅  Pomodoro"
      {...layout}
      border={{ type: 'line' }}
      style={{
        border: { fg: 'blue' }
      }}
    >
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
    </box>
  )
}
