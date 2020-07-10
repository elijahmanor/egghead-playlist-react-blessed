import React from 'react'

export default function Docker({
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

    return (
        <box
            label="Docker"
            {...layout}
            border={{ type: 'line' }}
            style={{
                border: { fg: 'blue' }
            }}
        >
            {``}
        </box>
    )
}