import React, { useState, useEffect, useRef } from 'react'
import blessed from 'blessed'
import { render } from 'react-blessed'
import figlet from 'figlet'

const FONTS = [
  'Straight',
  'ANSI Shadow',
  'Shimrod',
  'doom',
  'Big',
  'Ogre',
  'Small',
  'Standard',
  'Bigfig',
  'Mini',
  'Small Script',
  'Small Shadow'
]

const App = () => {
  const [count, setCount] = useState(0)
  const timer = useRef(null)
  useEffect(() => {
    timer.current = setTimeout(() => setCount(count + 1), 1000)
    return () => clearTimeout(timer.current)
  }, [count])

  let date = new Date().toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
  let time = figlet.textSync(
    new Date().toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),
    {
      font: FONTS[count % FONTS.length]
    }
  )

  return (
    <box
      top="center"
      left="center"
      width="65%"
      height="65%"
      border={{ type: 'line' }}
      style={{
        border: { fg: 'blue' }
      }}
    >
      {`${date}

${time}`}
    </box>
  )
}

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'Developer Dashboard'
})

screen.key(['escape', 'q', 'C-c'], () => process.exit(0))

render(<App />, screen)
