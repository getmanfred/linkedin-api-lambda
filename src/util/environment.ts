/* eslint-disable no-process-env */
import { bool, cleanEnv, str } from 'envalid';
import { LinkedinProfileRequest } from '../contracts/linkedin-profile.request';
import { EnvironmentType } from '../domain/logger-context';
import { setContextLogger } from './logger';

export class Environment {
  public readonly LOGGER_CONSOLE: boolean;
  public readonly LOCAL_LINKEDIN_API_TOKEN?: string;

  private constructor(_envName: EnvironmentType) {
    const env = cleanEnv(process.env, {
      LOGGER_CONSOLE: bool({ default: false }),
      LOCAL_LINKEDIN_API_TOKEN: str({ default: undefined })
    });

    this.LOGGER_CONSOLE = env.LOGGER_CONSOLE;
    this.LOCAL_LINKEDIN_API_TOKEN = env.LOCAL_LINKEDIN_API_TOKEN ?? undefined;
  }

  public static setupEnvironment(request: LinkedinProfileRequest): Environment {
    const environment = new Environment(request.env);
    setContextLogger({
      messageId: request.messageId,
      contextId: request.contextId,
      profileId: request.profileId,
      env: request.env
    });
    return environment;
  }
}
