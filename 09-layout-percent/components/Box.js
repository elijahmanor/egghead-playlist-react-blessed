import React from 'react'

export default function Box({ label, top, left, width, height, children }) {
  return (
    <box
      label={label}
      top={top}
      left={left}
      width={width}
      height={height}
      border={{ type: 'line' }}
      style={{
        border: { fg: 'blue' }
      }}
    >
      {`${JSON.stringify({ top, left, width, height }, null, 2)}`}
      {children}
    </box>
  )
}
