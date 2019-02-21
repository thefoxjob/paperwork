/* eslint-disable no-console */
import chalk from 'chalk';

export default {
  console,
  done: message => console.info(`${ chalk.bgGreen(' DONE ') } ${ message }`),
  error: message => console.error(`${ chalk.bgRed(' ERROR ') } ${ message }`),
  info: message => console.info(`${ chalk.bgGreen(' INFO ') } ${ message }`),
  log: console.log,
  warn: message => console.warn(`${ chalk.bgYellow(' WARN ') } ${ message }`),
};
