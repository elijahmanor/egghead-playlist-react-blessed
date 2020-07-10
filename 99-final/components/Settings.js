import React from 'react'
import { Sparkline } from 'react-blessed-contrib'

export default function Conditions({
    screen,
    top,
    left,
    width,
    height,
    updateFrequency,
    onClose
}) {
    const layout = {
        top,
        left,
        width,
        height
    }
    const [name, setName] = React.useState('Elijah')
    const [pomodoroTime, setPomodoroTime] = React.useState(25)
    const [breakTime, setBreakTime] = React.useState(5)

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
            onSubmit={text =>
                console.log(`form onSubmit "${text}"`)
            }
            onReset={() => console.log(`form onReset`)}
            {...layout}
            border={{ type: 'line' }}
            style={{ bg: 'black', border: { fg: 'blue' } }}
        >
            <box top={1} left={1} width={6} height={2}>
                {`Name: `}
            </box>
            <textbox
                top={1}
                onSubmit={text => setName(text)}
                left={7}
                height={2}
                keys
                mouse
                inputOnFocus
                width={10}
                value={name}
            />
            <box left={1} top={3} height={2}>
                {`Result: ${name}`}
            </box>
            <box top={5} left={1} width={22} height={2}>
                {`Pomodoro Interval: ${pomodoroTime}`}
            </box>
            <box left={23} top={4} height={3}>
                <button
                    mouse
                    border={{ type: 'line' }}
                    height={3}
                    width={3}
                    top={0}
                    left={0}
                    onPress={() => setPomodoroTime(pomodoroTime - 1)}
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
                    onPress={() => setPomodoroTime(pomodoroTime + 1)}
                >
                    +
        </button>
            </box>
            <box top={9} width={20} left="100%-23">
                <button
                    mouse
                    border={{ type: 'line' }}
                    height={3}
                    width={10}
                    top={0}
                    left={0}
                    onClick={onClose}
                >
                    {' Save '}
                </button>
                <button
                    mouse
                    border={{ type: 'line' }}
                    height={3}
                    width={10}
                    top={0}
                    left={10}
                    onClick={onClose}
                >
                    {' Cancel '}
                </button>
            </box>
        </form>
    )
}