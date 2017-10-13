import winston from 'winston';


const log = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transport.Console(),
  ],
});

export default log;
