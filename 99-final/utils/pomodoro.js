import path from 'path'
import file from '../utils/file'
import { isEmpty } from 'lodash'
import notifier from 'node-notifier'
const {
  isToday,
  differenceInMinutes,
  differenceInSeconds,
  differenceInHours,
  distanceInWordsStrict,
  addMinutes,
  addSeconds,
  getDayOfYear,
  getDaysInYear
} = require('date-fns')
import chalk from 'chalk'

const LOGS_PATH = path.join(process.env.HOME, '.dev.json')

const logs = file.readJSONFile(LOGS_PATH, '[]')
let today = logs.find(log => isToday(new Date(log.date)))
if (!today) {
  today = {
    date: new Date().toUTCString(),
    pomodoro: { completed: 0 }
  }
  logs.push(today)
  file.writeJSONFile(LOGS_PATH, logs)
}

export default api
/*
			pomodoro: {
				info: `\n${chalk.yellow(
					today.pomodoro.completed
				)} completed today.`,
				mode: "work", // "work", "break"
				type: "stopped", // "stopped", "running", "paused"
				status: "Stopped",
				instructions: `Press ${chalk.green("s")} to ${chalk.green(
					"start"
				)}.`,
				workDate: null,
				breakDate: null,
				percent: 100,
				completed: today.pomodoro.completed,
				timeLeftWhenPaused: 0,
				workInterval: 20,
				breakInterval: 5,
				prs: ""
      },
      
      startPomodoro() {
        // if going to paused... capture time left and add back that time
        let {
          pomodoro: {
            type,
            workDate,
            breakDate,
            mode,
            workInterval,
            breakInterval,
            timeLeftWhenPaused,
            info,
            completed,
            instructions
          }
        } = this.state;
        const newType = type === "running" ? "paused" : "running";
        if (mode === "work") {
          if (newType === "running") {
            if (timeLeftWhenPaused) {
              workDate = addSeconds(new Date(), timeLeftWhenPaused);
              timeLeftWhenPaused = 0;
            } else {
              workDate = addMinutes(new Date(), workInterval);
            }
            instructions = `Press ${chalk.blue("s")} to ${chalk.blue(
              "pause"
            )},\n${" ".repeat(6)}${chalk.red("e")} to ${chalk.red(
              "exit"
            )}.`;
          } else if (newType === "paused") {
            const date = workDate || breakDate;
            timeLeftWhenPaused = differenceInSeconds(date, new Date());
            instructions = `Press ${chalk.green("s")} to ${chalk.green(
              "resume"
            )},\n${" ".repeat(6)}${chalk.red("e")} to ${chalk.red(
              "exit"
            )}.`;
          }
        } else if (mode === "break") {
          if (newType === "running") {
            if (timeLeftWhenPaused) {
              breakDate = addSeconds(new Date(), timeLeftWhenPaused);
              timeLeftWhenPaused = 0;
            } else {
              breakDate = addMinutes(new Date(), breakInterval);
            }
            instructions = `Press ${chalk.blue("s")} to ${chalk.blue(
              "pause"
            )},\n${" ".repeat(6)}${chalk.red("e")} to ${chalk.red(
              "exit"
            )}.`;
          } else if (newType === "paused") {
            const date = workDate || breakDate;
            timeLeftWhenPaused = differenceInSeconds(date, new Date());
            instructions = `Press ${chalk.green("s")} to ${chalk.green(
              "resume"
            )},\n${" ".repeat(6)}${chalk.red("e")} to ${chalk.red(
              "exit"
            )}.`;
          }
        }
        const state = {
          pomodoro: {
            ...this.state.pomodoro,
            type: newType,
            workDate,
            breakDate,
            timeLeftWhenPaused,
            instructions
          }
        };
        this.setState(state);
      }
    
      exitPomodoro() {
        const state = {
          pomodoro: {
            ...this.state.pomodoro,
            workDate: null,
            breakDate: null,
            mode: "work",
            type: "stopped",
            percent: 100,
            instructions: `Press ${chalk.green("s")} to ${chalk.green(
              "resume"
            )}`
          }
        };
        this.setState(state);
      }
    
      updatePomodoro() {
        let {
          pomodoro: {
            mode,
            type,
            info,
            status,
            workDate,
            breakDate,
            completed,
            percent,
            workInterval,
            breakInterval,
            timeLeftWhenPaused,
            instructions
          }
        } = this.state;
    
        if (type === "running") {
          const date = workDate || breakDate;
          const secondsLeft = differenceInSeconds(date, new Date());
          if (secondsLeft >= 0) {
            status = `${
              mode === "work"
                ? chalk.green("Working")
                : chalk.blue("Breaking")
            }... ${chalk.yellow(`${minutesToHours(secondsLeft)} left`)}`;
            const totalSeconds =
              mode === "work" ? workInterval * 60 : breakInterval * 60;
            percent = (secondsLeft / totalSeconds) * 100;
            percent = percent <= 1.1 ? 1.1 : percent; // weird bug w/ control
          }
          if (secondsLeft <= 0) {
            if (mode === "work") {
              completed += 1;
              mode = "break";
              workDate = null;
              breakDate = addMinutes(new Date(), breakInterval);
              percent = 100;
              notifier.notify({
                title: "Pomodoro Alert",
                message: "Break Time!",
                sound: true,
                timeout: 30
              });
            } else if (mode === "break") {
              mode = "work";
              workDate = addMinutes(new Date(), workInterval);
              breakDate = null;
              percent = 100;
              notifier.notify({
                title: "Pomodoro Alert",
                message: "Work Time!",
                sound: true,
                timeout: 30
              });
            }
          }
          info = `\n${chalk.yellow(completed)} completed today.`;
          instructions = `Press ${chalk.blue("s")} to ${chalk.blue(
            "pause"
          )},\n${" ".repeat(6)}${chalk.red("e")} to ${chalk.red("exit")}.`;
        } else if (type === "paused") {
          instructions = `Press ${chalk.green("s")} to ${chalk.green(
            "resume"
          )},\n${" ".repeat(6)}${chalk.red("e")} to ${chalk.red("exit")}.`;
          status = `${chalk.gray(
            `${mode === "work" ? "Working" : "Breaking"}...`
          )} ${chalk.gray(`${minutesToHours(timeLeftWhenPaused)} left`)}`;
        } else if (type === "stopped") {
          instructions = `Press ${chalk.green("s")} to ${chalk.green(
            "start"
          )},\n${" ".repeat(6)}${chalk.red("e")} to ${chalk.red("exit")}.`;
          status = `${chalk.red("Stopped.")}`;
        }
    
        const state = {
          pomodoro: {
            ...this.state.pomodoro,
            mode,
            info,
            status,
            percent,
            workDate,
            breakDate,
            completed,
            instructions
          }
        };
    
        const today = logs.find(log => isToday(new Date(log.date)));
        today.pomodoro.completed = this.state.pomodoro.completed;
        utils.writeJSONFile(LOGS_PATH, logs);
    
        this.setState(state);
      }
      */
