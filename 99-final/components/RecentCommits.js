import React from 'react'
import useInterval from '@use-it/interval'
import { isEqual } from 'lodash'
import { cd, exec } from 'shelljs'
import chalk from 'chalk'
import useRequest from '../hooks/useRequest'

const truncate = (value, length) => {
  if (value.length > length) {
    return `${value.substring(0, length - 3)}…`
  }
  return value
}

const formatProjects = (projects, width) => {
  return projects.reduce((memo, project) => {
    if (project.commits.length) {
      memo += `${chalk.yellow.underline.bold(project.name)}\n`
      const commits = project.commits
        .map(commit => {
          const [, hash, message, date] =
            /^([\w\d]{4,8}) - (.*) \((.*)\)$/.exec(commit) || []
          return `${chalk.red(hash)} - ${chalk.cyan(
            truncate(message, width)
          )} (${chalk.gray(date)})`
        })
        .reduce((memo, commit) => {
          memo += `${commit}\n`
          return memo
        }, '')
      memo += `${commits}\n\n`
    }
    return memo
  }, '')
}

const fetchProjects = ({ repos, author, since }) => {
  return new Promise(resolve => {
    let projects = []
    repos.forEach(repo => {
      cd(repo)
      const commits = exec(
        `git --no-pager log --all --no-merges --since="${since}" --author="${author}" --abbrev-commit --oneline --color --pretty=format:'%h - %s (%cd)' --date=relative`,
        {
          silent: true
        }
      )
        .trim()
        .split('\n')
        .filter(l => l)
      projects.push({
        name: repo.substr(repo.lastIndexOf('/') + 1),
        commits
      })
    })
    resolve(projects)
  })
}

export default function RecentCommits({
  updateInterval = 900000, // 15 mins
  author = 'Elijah Manor',
  since = '1 week ago',
  screen,
  top,
  left,
  width,
  height,
  repos = ['~/github/egghead-playlist-react-blessed']
}) {
  const boxRef = React.useRef(null)
  const layout = {
    top,
    left,
    width,
    height
  }
  const { status, error, data } = useRequest(
    fetchProjects,
    { repos, author, since },
    updateInterval
  )

  return (
    <box
      label="📝  Recent Commits"
      {...layout}
      scrollable={true}
      keys={true}
      vi={true}
      alwaysScroll={true}
      mouse={true}
      border={{ type: 'line' }}
      style={{ border: { fg: 'blue' } }}
      ref={boxRef}
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
          ? `Error!: ${error}`
          : formatProjects(data, Math.floor(screen.width / 2 - 25))
      }`}
    </box>
  )
}
