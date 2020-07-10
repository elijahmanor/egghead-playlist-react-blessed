import React from 'react'
import useInterval from '@use-it/interval'
import { isEqual } from "lodash"
import { exec } from "shelljs"

const random = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

const fetchCommits = ({ author, since }) => {
    return new Promise(resolve =>
        setTimeout(() => {
            const commits = exec(
                `git --no-pager log --all --no-merges --since="${since}" --author="${author}" --abbrev-commit --oneline --color --pretty=format:'%h - %s (%cd)' --date=relative`,
                {
                    silent: true
                }
            ).trim().split("\n").filter(l => l).reduce((memo, commit) => {
                memo += `${commit}\n`
                return memo;
            }, "")
            resolve(commits)
        }, 1000)
    )
    return Promise.resolve([
        {
            location: { degreetype: 'F' },
            current: { temperature: random(50, 100), skytext: 'Normal' },
            forecast: [{}, { low: random(0, 50), high: random(50, 100) }]
        }
    ])
    // return findWeather(options)
}

const formatWeather = ([results]) => {
    const { location, current, forecast } = results
    const degreeType = location.degreetype
    const temperature = `${current.temperature}°${degreeType}`
    const conditions = current.skytext
    const low = `${forecast[1].low}°${degreeType}`
    const high = `${forecast[1].high}°${degreeType}`

    return `${temperature} and ${conditions} (${low} → ${high})`
}

const useRequest = (promise, options, interval = null) => {
    const [state, setState] = React.useState({
        status: 'loading',
        error: null,
        data: null
    })
    const prevOptions = React.useRef(null)

    const request = async options => {
        let data
        try {
            setState({ status: 'loading', error: null, data: null })
            data = await promise(options)
            setState({ status: 'complete', error: null, data })
        } catch (exception) {
            setState({ status: 'error', error: exception, data: null })
        }
    }
    React.useEffect(() => {
        if (!isEqual(prevOptions.current, options)) {
            request(options)
        }
    })
    useInterval(() => {
        request(options)
    }, interval)
    React.useEffect(() => {
        prevOptions.current = options;
    })

    return state
}

export default function RecentCommits({
    updateInterval = 900000, // 15 mins
    author = "Elijah Manor",
    since = "1 week ago"
}) {
    const { status, error, data } = useRequest(
        fetchCommits,
        { author, since },
        12000
    )

    return (
        <box
            top="50%"
            left="center"
            width="65%"
            height="45%"
            border={{ type: 'line' }}
            style={{
                border: { fg: 'blue' }
            }}
        >
            {`${
                status === 'loading' ? 'Loading...' : error ? 'Error!' : data
                }`}
        </box>
    )
}
