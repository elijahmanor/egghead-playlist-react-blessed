import React, { Fragment } from 'react'
import blessed from 'blessed'
import { render } from 'react-blessed'
import Today from './components/Today'
import Box from './components/Box'

const App = () => {
  return (
    <Fragment>
      <Today
        top={0}
        left={0}
        height="35%"
        width="50%"
        updateInterval={900000}
      />
      <Box label="Time Log" top="35%" left={0} height="65%" width="25%"></Box>
      <Box label="Pomodoro" top="35%" left="25%" height="65%" width="25%"></Box>
      <Box
        label="Recent Commits"
        top={0}
        left="50%"
        height="50%"
        width="50%"
      ></Box>
      <Box label="GitHub" top="50%" left="50%" height="50%" width="50%"></Box>
    </Fragment>
  )
}

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'Developer Dashboard'
})

screen.key(['escape', 'q', 'C-c'], () => process.exit(0))

render(<App />, screen)
