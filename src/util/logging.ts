import winston from 'winston';
import { Context } from '../models/context';

//const isConsoleLoggerEnabled = process.env.LOGGER_CONSOLE === 'true';
const isConsoleLoggerEnabled = true;

let messageId = '';
let contextId = '';
let profileId = '';
let serviceName = '';
let environment: 'local' | 'stage' | 'pro' = 'local';
let messageBody = {};

const addContext: winston.Logform.TransformFunction = (info): winston.Logform.TransformableInfo => {
  info.message = `[${serviceName}] ${info.message}`;
  info.messageId = messageId;
  info.contextId = contextId;
  info.profileId = profileId;
  info.environment = environment;
  info.serviceName = serviceName;
  info.messageBody = messageBody;
  return info;
};

const consoleLogger = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.printf((info) => `[${[serviceName]}] ${info.message}`)
  ),
});

const jsonLogger = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.uncolorize(),
    winston.format(addContext)(),
    winston.format.splat(),
    winston.format.simple(),
    winston.format.json()
  ),
  level: 'debug',
});

const transports = isConsoleLoggerEnabled ? consoleLogger : jsonLogger;

// -- Exports ---
export const logger = winston.createLogger({ transports });

export const setContext = (config: Context): void => {
  messageId = config.messageId;
  contextId = config.contextId;
  profileId = config.profileId;
  environment = config.environment;
  serviceName = config.serviceName;
  messageBody = config.messageBody;
};

export const getContext = (): Context => {
  return {
    messageId,
    contextId,
    profileId,
    environment,
    serviceName,
    messageBody,
  };
};
