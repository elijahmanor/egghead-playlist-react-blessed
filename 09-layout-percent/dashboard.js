import React from 'react'
import blessed from 'blessed'
import { render } from 'react-blessed'
import Today from './components/Today'
import Box from './components/Box'
// import TimeLog from './components/TimeLog'
// import Pomodoro from './components/Pomodoro'
// import RecentCommits from './components/RecentCommits'
// import GitHub from './components/GitHub'

const App = () => {
  return (
    <React.Fragment>
      <Today
        updateInterval={900000}
        top={0}
        left={0}
        width="50%"
        height="35%"
      />
      <Box label="Time Log" top="35%" left={0} width="25%" height="65%" />
      <Box label="Pomodoro" top="35%" left="25%" width="25%" height="65%" />
      <Box label="Recent Commits" top={0} left="50%" width="50%" height="50%" />
      <Box label="GitHub" top="50%" left="50%" width="50%" height="50%" />
    </React.Fragment>
  )
}

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'Developer Dashboard'
})

screen.key(['escape', 'q', 'C-c'], () => process.exit(0))

render(<App />, screen)
