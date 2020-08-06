import React from 'react'

export default function Box({ label, top, left, width, height, children }) {
  const boxProps = { label, top, left, width, height }
  return (
    <box
      {...boxProps}
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
