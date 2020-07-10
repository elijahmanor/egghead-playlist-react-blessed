import React from 'react'
import blessed from 'blessed'
import { render } from 'react-blessed'
import Today from './components/Today'

const App = () => {
  const [degreeType, setDegreeType] = React.useState('F')
  React.useEffect(() => {
    const handleKey = () => setDegreeType(type => type === 'F' ? 'C' : 'F');
    screen.key('d', handleKey);
    return () => screen.removeKey('d', handleKey);
  }, [])
  return <Today updateInterval={900000} degreeType={degreeType} />
}

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'Developer Dashboard'
})

screen.key(['escape', 'q', 'C-c'], () => process.exit(0))

render(
  <App />,
  screen
)
