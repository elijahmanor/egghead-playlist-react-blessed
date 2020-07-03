import React, { useState, useEffect, useRef } from 'react'
import figlet from 'figlet'
import useInterval from '@use-it/interval'

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

export default function Today({ updateInterval = 1000 }) {
  const [fontIndex, setFontIndex] = useState(0)
  const [now, setNow] = useState(new Date())

  useInterval(() => {
    setNow(new Date())
    setFontIndex(fontIndex + 1)
  }, updateInterval)

  const time = figlet.textSync(
    now.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),
    {
      font: FONTS[fontIndex % FONTS.length]
    }
  )
  const date = now.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

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
