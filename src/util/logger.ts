/* eslint-disable no-process-env */
import winston from 'winston';
import { LoggerContext } from '../domain/logger-context';

const isConsoleLoggerEnabled = process.env.LOGGER_CONSOLE === 'true';

let messageId = '';
let contextId = '';
let profileId = -999;
let env = 'local';

const addContext: winston.Logform.TransformFunction = (info): winston.Logform.TransformableInfo => {
  info.message = info.message;
  info.messageId = messageId;
  info.contextId = contextId;
  info.profileId = profileId;
  info.environment = env;
  return info;
};

const jsonLogger = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.uncolorize(),
    winston.format(addContext)(),
    winston.format.splat(),
    winston.format.simple(),
    winston.format.json()
  ),
  level: 'debug'
});

const consoleLogger = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.printf((info) => `${info.level}: ${info.message}`)
  ),
  level: 'debug'
});

const transports = isConsoleLoggerEnabled ? consoleLogger : jsonLogger;

// -- Exports ---
export const logger = winston.createLogger({ transports });

export const setContextLogger = (config: LoggerContext): void => {
  messageId = config.messageId;
  contextId = config.contextId;
  profileId = config.profileId;
  env = config.env;
};
