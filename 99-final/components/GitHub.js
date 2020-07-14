import React from 'react'
import { Octokit } from '@octokit/rest'
import chalk from 'chalk'
import useRequest from '../hooks/useRequest'
import Color from 'color'

const truncate = (value, length) => {
  if (value.length > length) {
    return `${value.substring(0, length - 3)}…`
  }
  return value
}

const formatPulls = (pulls, width) => {
  let prs = pulls.map(p => {
    return {
      number: p.number,
      title: p.title,
      user: p.user.login,
      created: p.created_at,
      label: p.labels.length && p.labels[0]
    }
  })
  prs = prs.reduce((memo, { number, title, user, created, label }) => {
    const foreColor =
      label && Color.rgb(`#${label.color}`).isLight() ? '#000' : '#FFF'
    memo += `${chalk.yellow(number.toString().padEnd('5'))} ${chalk.green(
      truncate(title, width - 10)
    )}
${chalk.gray('╚═══'.padEnd('6'))}${chalk.gray('by')} ${chalk.magenta(
      user
    )} ${chalk.gray('at')} ${chalk.blue(
      new Date(created).toLocaleDateString('en-US')
    )} ${label ? chalk.bgHex(label.color).hex(foreColor)(label.name) : ''}\n`
    return memo
  }, '')
  return prs
}

const fetchPulls = async ({ token }) => {
  const octokit = new Octokit({ auth: token })
  const { data } = await octokit.pulls.list({
    owner: 'elijahmanor',
    repo: 'egghead-playlist-react-blessed',
    state: 'open',
    sort: 'created',
    direction: 'desc'
  })
  return data
}

export default function GitHub({
  screen,
  top,
  left,
  width,
  height,
  updateInterval,
  token
}) {
  const layout = {
    top,
    left,
    width,
    height
  }

  const { status, error, data } = useRequest(fetchPulls, { token }, updateInterval)

  return (
    <box
      label="🐙  GitHub"
      {...layout}
      border={{ type: 'line' }}
      style={{
        border: { fg: 'blue' }
      }}
      padding={{
        top: 1,
        left: 1,
        right: 1
      }}
    >
      {`${
        status === 'loading'
          ? 'Loading...'
          : error
            ? 'Error!'
            : formatPulls(data, Math.floor(screen.width / 2))
        }`}
    </box>
  )
}
