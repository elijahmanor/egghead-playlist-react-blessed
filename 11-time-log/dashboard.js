import React from 'react'
import blessed from 'blessed'
import { render } from 'react-blessed'
import Today from './components/Today'
import Box from './components/Box'
import TimeLog from './components/TimeLog'
import { Grid } from 'react-blessed-contrib'

const App = () => {
  return (
    <Grid rows={12} cols={12}>
      <Today updateInterval={900000} row={0} col={0} rowSpan={4} colSpan={6} />
      <TimeLog row={4} col={0} rowSpan={8} colSpan={3} screen={screen} />
      <Box label="Pomodoro" row={4} col={3} rowSpan={8} colSpan={3} />
      <Box label="Recent Commits" row={0} col={6} rowSpan={6} colSpan={6} />
      <Box label="GitHub" row={6} col={6} rowSpan={6} colSpan={6} />
    </Grid>
  )
}

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'Developer Dashboard'
})

screen.key(['escape', 'q', 'C-c'], () => process.exit(0))

render(<App />, screen)
