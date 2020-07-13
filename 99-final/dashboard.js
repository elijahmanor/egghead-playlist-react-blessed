import React, { Fragment } from 'react'
import blessed from 'blessed'
import { render } from 'react-blessed'
import { Grid } from 'react-blessed-contrib'
import Today from './components/Today'
import RecentCommits from './components/RecentCommits'
import TimeLog from './components/TimeLog'
import Pomodoro from './components/Pomodoro'
import Docker from './components/Docker'
import GitHub from './components/GitHub'
import Usage from './components/Usage'
import Settings from './components/Settings'
import toMilliseconds from '@sindresorhus/to-milliseconds'

const App = () => {
  const [degreeType, setDegreeType] = React.useState('F')
  React.useEffect(() => {
    const handleKey = () => setDegreeType(type => (type === 'F' ? 'C' : 'F'))
    screen.key('d', handleKey)
    return () => screen.removeKey('d', handleKey)
  }, [])
  React.useEffect(() => {
    const handleTab = tab => {
      if (tab === '1' || tab === '2') {
        setTabIndex(+tab - 1)
      } else {
        setIsSettingsOpen(true)
      }
    }
    screen.key(['1', '2', '3'], handleTab)
    return () => screen.removeKey(['1', '2', '3'], handleTab)
  }, [])
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [tabIndex, setTabIndex] = React.useState(0)
  return (
    <Fragment>
      <Grid rows={12} cols={12} hideBorder>
        <Today
          screen={screen}
          row={0}
          col={0}
          rowSpan={4}
          colSpan={6}
          updateInterval={toMilliseconds({ minutes: 1 })}
        />
        <TimeLog
          screen={screen}
          row={4}
          col={0}
          rowSpan={7}
          colSpan={3}
          updateInterval={toMilliseconds({ minutes: 1 })}
        />
        <Pomodoro
          screen={screen}
          row={4}
          col={3}
          rowSpan={7}
          colSpan={3}
          updateInterval={toMilliseconds({ seconds: 1 })}
        />
        {tabIndex === 0 ? (
          <RecentCommits
            screen={screen}
            row={0}
            col={6}
            rowSpan={6}
            colSpan={6}
            updateInterval={toMilliseconds({ minutes: 5 })}
          />
        ) : (
          <Docker
            screen={screen}
            row={0}
            col={6}
            rowSpan={6}
            colSpan={6}
            updateInterval={toMilliseconds({ seconds: 5 })}
          />
        )}
        {tabIndex === 0 ? (
          <GitHub
            screen={screen}
            row={6}
            col={6}
            rowSpan={6}
            colSpan={6}
            updateInterval={toMilliseconds({ minutes: 15 })}
          />
        ) : (
          <Usage
            screen={screen}
            row={6}
            col={6}
            rowSpan={6}
            colSpan={6}
            updateInterval={toMilliseconds({ seconds: 1 })}
          />
        )}
        <box row={11} rowSpan={1} col={0} colSpan={6}>
          <button
            mouse
            border={{ type: 'line' }}
            height={3}
            width={15}
            top={'100%-2'}
            left={0}
            style={{
              border: {
                fg: !isSettingsOpen && tabIndex === 0 ? 'yellow' : 'white'
              }
            }}
            onClick={() => setTabIndex(0)}
          >
            {' 1: Git '}
          </button>
          <button
            mouse
            border={{ type: 'line' }}
            height={3}
            width={15}
            top={'100%-2'}
            left={16}
            style={{
              border: { fg: tabIndex === 1 ? 'yellow' : 'white' }
            }}
            onClick={() => setTabIndex(1)}
          >
            {' 2: Server '}
          </button>
          <button
            mouse
            border={{ type: 'line' }}
            height={3}
            width={15}
            top={'100%-2'}
            left={32}
            style={{
              border: { fg: isSettingsOpen ? 'yellow' : 'white' }
            }}
            onClick={() => setIsSettingsOpen(true)}
          >
            {' 3: Settings '}
          </button>
        </box>
      </Grid>
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
    </Fragment>
  )
}

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  dockBorders: true,
  fullUnicode: true,
  forceUnicode: true,
  title: 'Developer Dashboard'
})

screen.key(['escape', 'q', 'C-c'], () => process.exit(0))

render(<App />, screen)
