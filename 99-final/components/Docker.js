import React from 'react'
import { exec } from 'shelljs'
import chalk from 'chalk'
import useRequest from '../hooks/useRequest'

const formatDocker = (lines, width) => {
  lines = lines.map(line => {
    let [, repo, status] = /^([\w-]+)\s+(.+)$/.exec(line) || []
    // status = status.replace('Restarting (1) ', 'Restarting: ')
    // status = status.replace('Less than', '<')
    // status = status.replace('seconds', 'secs')
    // status = status.replace('second', 'sec')
    // status = status.replace('minutes', 'mins')
    // status = status.replace('minute', 'min')
    if (status.includes('Restarting')) {
      status = chalk.blue(status)
    } else if (status.includes('Up')) {
      status = chalk.green(status)
    } else {
      status = chalk.gray(status)
    }
    return `${chalk.yellow(repo.padEnd(25))}\t${status}`
  })
  const docker = `${chalk.underline('NAMES')}${' '.repeat(24)}${chalk.underline(
    'STATUS'
  )}\n\n${lines.join('\n')}`
  return docker
}

const fetchDocker = ({ author, since }) => {
  return new Promise(resolve => {
    const lines = exec(
      `docker ps --format "table {{.Names}}  \t  {{.Status}}"`,
      { silent: true }
    )
      .trim()
      .split('\n')
      .filter(l => l)
    lines.shift()
    resolve(lines)
  })
}

/*
	const data = exec(
			`docker ps --format "table {{.Names}}  \t  {{.Status}}"`,
			{
				silent: true
			}
		).trim();
		let lines = data.split("\n");
		lines.shift();
		lines = lines.map(line => {
			let [, repo, status] = /^([\w-]+)\s+(.+)$/.exec(line) || [];
			status = status.replace("Restarting (1) ", "Restarting: ");
			status = status.replace("Less than", "<");
			status = status.replace("seconds", "secs");
			status = status.replace("second", "sec");
			status = status.replace("minutes", "mins");
			status = status.replace("minute", "min");
			if (status.includes("Restarting")) {
				status = chalk.blue(status);
			} else if (status.includes("Up")) {
				status = chalk.green(status);
			} else {
				status = chalk.gray(status);
			}
			return `${chalk.yellow(repo.padEnd(25))}\t${status}`;
		});
		const docker =
			`\n${chalk.underline("NAMES")}${" ".repeat(24)}${chalk.underline(
				"STATUS"
			)}\n\n${  lines.join("\n")}`;

		this.setState({ docker });
	}
*/

export default function Docker({
  screen,
  top,
  left,
  width,
  height,
  updateInterval = 900000
}) {
  const layout = {
    top,
    left,
    width,
    height
  }

  const { status, error, data } = useRequest(fetchDocker, {}, updateInterval)

  return (
    <box
      label="🐳  Docker"
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
          : formatDocker(data, Math.floor(screen.width / 2 - 25))
      }`}
    </box>
  )
}
