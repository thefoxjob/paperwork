#!/usr.bin.env node
/* eslint-disable no-console */

require('@babel/register');
const chalk = require('chalk');
const command = require('./commands');

require('pretty-error').start();

process.stdout.write(chalk.green('-'.repeat(120)));
process.stdout.write('\x1B[2J\n\x1B[0f\u001b[0;0H');
process.on('unhandledRejection', error => console.error(error));


const run = (module, options) => {
  const task = typeof module.default === 'undefined' ? module : module.default;
  const promise = task(options, {
    watch: process.argv.includes('--watch'),
    verbose: true,
  });

  if (promise && promise.catch) {
    promise.catch(error => console.error(error));
  }
};

// eslint-disable-next-line no-underscore-dangle
delete require.cache[__filename];
let name = process.argv[2];

if (! name || name.startsWith('--')) {
  name = 'start';
}

switch (name.toLowerCase()) {
  case 'start':
    process.env.NODE_ENV = 'development';
    run(command.start);

    break;
  default:
    if (name in command) {
      run(command[name]);
    } else {
      throw new Error(`Command "${ name }" not found.`);
    }
}
