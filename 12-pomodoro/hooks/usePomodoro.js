import React from 'react'
import chalk from 'chalk'
import { differenceInSeconds, addMinutes, addSeconds } from 'date-fns'

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
    case 'resume':
      if (timeLeftWhenPaused) {
        if (mode === 'work') {
          workDate = addSeconds(new Date(), timeLeftWhenPaused)
        } else {
          breakDate = addSeconds(new Date(), timeLeftWhenPaused)
        }
        timeLeftWhenPaused = 0
      } else {
        if (mode === 'work') {
          workDate = addMinutes(new Date(), workInterval)
        } else {
          breakDate = addMinutes(new Date(), breakInterval)
        }
      }
      instructions = `Press ${chalk.blue('s')} to ${chalk.blue(
        'pause'
      )},\n${' '.repeat(7)}${chalk.red('e')} to ${chalk.red('exit')}.`
      return {
        ...state,
        type: 'running',
        workDate,
        breakDate,
        instructions,
        timeLeftWhenPaused
      }
    case 'pause': {
      const date = workDate || breakDate
      const secondsLeft = differenceInSeconds(date, new Date())
      timeLeftWhenPaused = secondsLeft
      return { ...state, timeLeftWhenPaused, type: 'paused' }
    }
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
        } else {
          if (workDate) {
            completed += 1
            workDate = null
            breakDate = addMinutes(new Date(), breakInterval)
            mode = 'break'
          } else {
            breakDate = null
            workDate = addMinutes(new Date(), workInterval)
            mode = 'work'
          }
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
      return {
        ...state,
        status,
        percent,
        info,
        instructions,
        completed,
        mode,
        workDate,
        breakDate
      }
    case 'exit':
      return {
        ...state,
        type: 'stopped',
        percent: 100,
        timeLeftWhenPaused: 0,
        workDate: null,
        breakDate: null
      }
    case 'updateWorkInterval':
      return { ...state, workInterval: action.payload }
    case 'updateBreakInterval':
      return { ...state, breakInterval: action.payload }
    default:
      throw new Error()
  }
}

export default function usePomodoro({ workInterval, breakInterval }) {
  const [state, dispatch] = React.useReducer(
    reducer,
    { ...initialState, workInterval, breakInterval },
    init
  )

  if (workInterval !== state.workInterval) {
    dispatch({ type: 'updateWorkInterval', payload: workInterval })
  }
  if (breakInterval !== state.breakInterval) {
    dispatch({ type: 'updateBreakInterval', payload: breakInterval })
  }

  return { state, dispatch }
}
