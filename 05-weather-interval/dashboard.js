import React from 'react'
import blessed from 'blessed'
import { render } from 'react-blessed'
import {
  makeQueryCache,
  ReactQueryCacheProvider,
  setFocusHandler
} from 'react-query'
import Today from './components/Today'

const queryCache = makeQueryCache({ frozen: false })

const App = () => {
  const [degreeType, setDegreeType] = React.useState('F')
  React.useEffect(() => {
    screen.key(['d'], () => setDegreeType(degreeType === 'F' ? 'C' : 'F'))
  }, [])
  return <Today updateInterval={900000} degreeType={degreeType} />
}

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'Developer Dashboard'
})

screen.key(['escape', 'q', 'C-c'], () => process.exit(0))

setFocusHandler(handleFocus => {
  const intermediate = (...args) => {
    console.log('FOCUS')
    handleFocus(...args)
  }
  screen.on('focus', intermediate)
  return () => screen.off('focus', intermediate)
})

const component = render(
  <ReactQueryCacheProvider queryCache={queryCache}>
    <App />
  </ReactQueryCacheProvider>,
  screen
)
