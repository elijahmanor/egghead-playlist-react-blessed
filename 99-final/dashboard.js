import React, { Fragment } from 'react'
import blessed from 'blessed'
import { render } from 'react-blessed'
import Today from './components/Today'
import RecentCommits from "./components/RecentCommits"
import TimeLog from './components/TimeLog'
import Pomodoro from './components/Pomodoro'
import Docker from './components/Docker'
import GitHub from './components/GitHub'
import ActivityMonitor from './components/ActivityMonitor'
import Settings from './components/Settings'

const App = () => {
  const [degreeType, setDegreeType] = React.useState('F')
  React.useEffect(() => {
    const handleKey = () => setDegreeType(type => type === 'F' ? 'C' : 'F');
    screen.key('d', handleKey);
    return () => screen.removeKey('d', handleKey);
  }, [])
  const [
    isSettingsOpen,
    setIsSettingsOpen
  ] = React.useState(false)
  return <Fragment>
    <Today
      screen={screen}
      top={0}
      left={0}
      width={57}
      height={9}
      updateInterval={1000}
    />
    <button
      hoverText="Settings"
      mouse
      top={1}
      left={2}
      height={1}
      width={3}
      onClick={() => setIsSettingsOpen(true)}
    >
      {'⚙️'}
    </button>
    <TimeLog
      screen={screen}
      top={0}
      left={57}
      width={29}
      height={9}
      updateInterval={1000}
    />
    <Pomodoro
      screen={screen}
      top={0}
      left={86}
      width={29}
      height={9}
      updateInterval={1000}
    />
    <Docker
      screen={screen}
      top={9}
      left={0}
      width={57}
      height={9}
      updateInterval={1000}
    />
    <RecentCommits
      screen={screen}
      top={9}
      left={57}
      width={58}
      height={9}
      updateInterval={1000}
    />
    <GitHub
      screen={screen}
      top={18}
      left={0}
      width={57}
      height={9}
      updateInterval={1000}
    />
    <ActivityMonitor
      screen={screen}
      top={18}
      left={57}
      width={58}
      height={9}
      updateInterval={1000}
    />
    {isSettingsOpen && (
      <Settings
        screen={screen}
        left="25%"
        top="15%"
        width="50%"
        height={15}
        onClose={() => setIsSettingsOpen(false)}
      />
    )}
  </Fragment>;
}

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  dockBorders: true,
  fullUnicode: true,
  title: 'Developer Dashboard'
})

screen.key(['escape', 'q', 'C-c'], () => process.exit(0))

render(
  <App />,
  screen
)
