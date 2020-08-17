import React from 'react'

export default function Box(props) {
  const { children, ...boxProps } = props

  return (
    <box
      border={{ type: 'line' }}
      style={{
        border: { fg: 'blue' }
      }}
      {...boxProps}
    >
      {children}
    </box>
  )
}
