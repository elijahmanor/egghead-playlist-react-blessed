import React from 'react'
import { Donut } from 'react-blessed-contrib'
import osu from 'node-os-utils'
import useRequest from '../hooks/useRequest'

const fetchServer = options => {
  return new Promise(async resolve => {
    const cpuUsage = await osu.cpu.usage()
    const memUsed = await osu.mem.used()
    resolve([
      { percent: cpuUsage, label: 'CPU', color: 'green' },
      {
        percent: (memUsed.usedMemMb / memUsed.totalMemMb) * 100,
        label: 'Memory',
        color: 'green'
      }
    ])
  })
}

export default function Usage({
  screen,
  top,
  left,
  width,
  height,
  updateInterval
}) {
  const layout = {
    top,
    left,
    width,
    height
  }
  const { status, error, data } = useRequest(fetchServer, {}, updateInterval)

  const donutRef = React.useRef()

  return (
    <box
      label="Usage"
      {...layout}
      border={{ type: 'line' }}
      style={{
        border: { fg: 'blue' }
      }}
      scrollable={true}
    >
      {`Hi`}
      <Donut
        ref={donutRef}
        data={data}
        remainColor="white"
        radius={16}
        arcWidth={3}
        yPadding={4}
        height="100%"
        width="100%"
      />
    </box>
  )
}
