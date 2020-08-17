import path from 'path'
import file from './file'
const { isToday, differenceInMinutes, addMinutes } = require('date-fns')
import chalk from 'chalk'

const LOGS_PATH = path.join(process.env.HOME, '.dev.json')

const minutesToHours = mins => {
  const negative = mins < 0
  const hours = Math.abs(mins) / 60
  const rhours = Math.floor(hours)
  const minutes = (hours - rhours) * 60
  const rminutes = Math.round(minutes)
  return `${negative ? '-' : ' '}${rhours
    .toString()
    .padStart(2, '0')}:${rminutes.toString().padStart(2, '0')}`
}

const logs = file.readJSONFile(LOGS_PATH, '[]')
let today = logs.find(log => isToday(new Date(log.date)))
if (!today) {
  today = {
    date: new Date().toUTCString(),
    stamps: []
  }
  logs.push(today)
  file.writeJSONFile(LOGS_PATH, logs)
}

const api = {
  getLog() {
    const today = logs.find(log => isToday(new Date(log.date)))
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }
    if (today) {
      const logs = today.stamps.reduce((memo, stamp, index) => {
        memo += `${chalk.green('In'.padEnd(15))} ${new Date(stamp.in)
          .toLocaleTimeString('en-US', timeOptions)
          .padStart(8)}\n`
        memo +=
          stamp.out != null
            ? `${chalk.red('Out'.padEnd(15))} ${new Date(stamp.out)
                .toLocaleTimeString('en-US', timeOptions)
                .padStart(8)}\n`
            : `${chalk.blue('Now'.padEnd(15))} ${new Date()
                .toLocaleTimeString('en-US', timeOptions)
                .padStart(8)}\n`
        if (index < today.stamps.length - 1) {
          const nextStamp = today.stamps[index + 1]
          const difference = differenceInMinutes(
            new Date(nextStamp.in),
            new Date(stamp.out)
          )
          memo += `${chalk.gray('Break'.padEnd(14))} ${minutesToHours(
            difference
          ).padStart(4)} HR\n`
        }
        return memo
      }, '')
      const minutesWorkedToday = today.stamps.reduce((memo, item) => {
        const stamp = { ...item }
        if (!stamp.out) {
          stamp.out = new Date().toUTCString()
        }
        memo += differenceInMinutes(new Date(stamp.out), new Date(stamp.in))
        return memo
      }, 0)
      return {
        entries: `${logs}`,
        summary: `${chalk.yellow(
          `${minutesToHours(minutesWorkedToday)} HR`
        )} Total Worked
${chalk.yellow(`${minutesToHours(480 - minutesWorkedToday)} HR`)} Time Remaining
${chalk.yellow(
  addMinutes(new Date(), 480 - minutesWorkedToday)
    .toLocaleTimeString('en-US', timeOptions)
    .padStart(9, ' ')
)} Estimated End`
      }
    }
  },
  logIn() {
    const today = logs.find(log => isToday(new Date(log.date)))
    if (today) {
      const isAlreadyStarted = today.stamps.some(s => s.in && !s.out)
      if (!isAlreadyStarted) {
        today.stamps.push({ in: new Date().toUTCString() })
        file.writeJSONFile(LOGS_PATH, logs)
      }
    } else {
      logs.push({
        date: new Date().toUTCString(),
        stamps: [{ in: new Date().toUTCString() }]
      })
      file.writeJSONFile(LOGS_PATH, logs)
    }
  },
  logOut() {
    const today = logs.find(log => isToday(new Date(log.date)))
    if (today) {
      const entry = today.stamps.find(s => s.in && !s.out)
      if (entry) {
        entry.out = new Date().toUTCString()
        file.writeJSONFile(LOGS_PATH, logs)
      }
    }
  }
}

export default api
