import React from 'react'
import { Sparkline } from 'react-blessed-contrib'

export default function Conditions({
  screen,
  top,
  left,
  width,
  height,
  updateFrequency,
  weather: _weather,
  workTime: _workTime,
  breakTime: _breakTime,
  onClose,
  onSave
}) {
  const layout = {
    top,
    left,
    width,
    height
  }
  const [weather, setWeather] = React.useState(_weather)
  const [workTime, setWorkTime] = React.useState(_workTime)
  const [breakTime, setBreakTime] = React.useState(_breakTime)
  const handleSave = () => {
    onSave({ weather, workTime, breakTime })
    onClose()
  }

  return (
    <form
      label="Settings"
      keys
      vi
      focused
      scrollable
      alwaysScroll
      mouse
      draggable
      onSubmit={text => console.log(`form onSubmit "${text}"`)}
      onReset={() => console.log(`form onReset`)}
      {...layout}
      border={{ type: 'line' }}
      style={{ bg: 'black', border: { fg: 'blue' } }}
    >
      <box top={1} left={1} width={8} height={2}>
        {`Weather: `}
      </box>
      <textbox
        top={1}
        onSubmit={text => setWeather(text)}
        left={10}
        height={2}
        keys
        mouse
        inputOnFocus
        width={20}
        value={weather}
      />
      <text top={3} left={1} height={2}>
        {`Pomodoro:`}
      </text>
      <box top={5} left={3} width={22} height={2}>
        {`Work Interval: ${workTime}`}
      </box>
      <box top={4} left={23} height={3}>
        <button
          mouse
          border={{ type: 'line' }}
          height={3}
          width={3}
          top={0}
          left={0}
          onPress={() => setWorkTime(workTime - 1)}
        >
          -
        </button>
        <button
          mouse
          border={{ type: 'line' }}
          height={3}
          width={3}
          top={0}
          left={3}
          onPress={() => setWorkTime(workTime + 1)}
        >
          +
        </button>
      </box>
      <box top={7} left={3} width={22} height={2}>
        {`Break Interval: ${breakTime}`}
      </box>
      <box top={6} left={23} height={3}>
        <button
          mouse
          border={{ type: 'line' }}
          height={3}
          width={3}
          top={0}
          left={0}
          onPress={() => setFreakTime(breakTime - 1)}
        >
          -
        </button>
        <button
          mouse
          border={{ type: 'line' }}
          height={3}
          width={3}
          top={0}
          left={3}
          onPress={() => setBreakTime(breakTime + 1)}
        >
          +
        </button>
      </box>
      <box top={10} width={20} left="100%-23">
        <button
          mouse
          border={{ type: 'line' }}
          height={3}
          width={10}
          top={0}
          left={0}
          onClick={onClose}
        >
          {' Cancel '}
        </button>
        <button
          mouse
          border={{ type: 'line' }}
          height={3}
          width={10}
          top={0}
          left={10}
          onClick={handleSave}
        >
          {' Save '}
        </button>
      </box>
    </form>
  )
}
