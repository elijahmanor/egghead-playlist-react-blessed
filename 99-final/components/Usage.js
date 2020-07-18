import React from 'react'
import { Donut } from 'react-blessed-contrib'
import osu from 'node-os-utils'
import useRequest from '../hooks/useRequest'
import terminalImage from 'terminal-image';

const fetchServer = async options => {
  return await terminalImage.file('super-mario.jpg'); //, {width: 20, height: 20, preserveAspectRatio: false})
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
  const { status, error, data } = useRequest(fetchServer, {}, 60000)

  const donutRef = React.useRef()

  console.log( data )

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
      {data}
      {/* <Donut
        ref={donutRef}
        data={data}
        remainColor="white"
        radius={16}
        arcWidth={3}
        yPadding={4}
        height="100%"
        width="100%"
      /> */}
    </box>
  )
}
