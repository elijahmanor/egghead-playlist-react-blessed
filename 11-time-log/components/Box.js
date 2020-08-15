import React from 'react'

export default function Box(props) {
  const { children, ...boxProps } = props
  const { top, left, width, height } = boxProps
  return (
    <box
      border={{ type: 'line' }}
      style={{
        border: { fg: 'blue' }
      }}
      {...boxProps}
    >
      {`${JSON.stringify({ top, left, width, height }, null, 2)}`}
      {children}
    </box>
  )
}
