import React from 'react'
import Box from './Box'

export default function RecentCommits({
  updateInterval = 900000,
  top,
  left,
  width,
  height
}) {
  const layout = { top, left, width, height }
  return (
    <Box label="Pomodoro" {...layout}>
      <text>...</text>
    </Box>
  )
}
