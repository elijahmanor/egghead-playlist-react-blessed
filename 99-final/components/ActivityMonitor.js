import React from 'react'
import { Sparkline } from 'react-blessed-contrib'

export default function ActivityMonitor({
    screen,
    top,
    left,
    width,
    height,
    updateFrequency
}) {
    const layout = {
        top,
        left,
        width,
        height
    }
    const sparkRef = React.useRef()
    const [cpu, setCpu] = React.useState([])
    const [memory, setMemory] = React.useState([])
    const timer = React.useRef()
    const sparkWidth = width - 2

    // React.useEffect(() => {
    //     timer.current = setTimeout(() => {
    //         setCpu([
    //             ...(cpu.length >= sparkWidth ? cpu.slice(1) : cpu),
    //             process.cpuUsage()
    //         ])
    //         setMemory([
    //             ...(memory.length >= sparkWidth
    //                 ? memory.slice(1)
    //                 : memory),
    //             process.memoryUsage()
    //         ])
    //     }, updateFrequency)
    //     return () => clearInterval(timer.current)
    // }, [cpu, memory])

    // React.useEffect(() => {
    //     sparkRef.current.widget.setData(
    //         [
    //             `CPU ${cpu[cpu.length - 1]?.user ?? ''}`,
    //             `Memory ${
    //             memory[memory.length - 1]?.heapUsed ?? ''
    //             }`
    //         ],
    //         [
    //             cpu.reduce((memo, c) => {
    //                 memo.push(c.user)
    //                 return memo
    //             }, []),
    //             memory.reduce((memo, m) => {
    //                 memo.push(m.heapUsed)
    //                 return memo
    //             }, [])
    //         ]
    //     )
    // }, [cpu, memory])

    return (
        <box
            label="Activity Monitor"
            {...layout}
            border={{ type: 'line' }}
            style={{
                border: { fg: 'blue' }
            }}
        >
            {`Hi`}
            {/* <Sparkline
                ref={sparkRef}
                {...{
                    tags: true,
                    width: sparkWidth,
                    style: {
                        fg: 'blue',
                        titleFg: 'white'
                    }
                }}
            /> */}
        </box>
    )
}