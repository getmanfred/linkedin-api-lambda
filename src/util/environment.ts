/* eslint-disable no-process-env */
import { bool, cleanEnv, num, str } from 'envalid';
import { LinkedinProfileRequest } from '../contracts/linkedin-profile.request';
import { EnvironmentType } from '../domain/logger-context';
import { setContextLogger } from './logger';

export class Environment {
  public readonly MAX_RETRIES: number;
  public readonly LOGGER_CONSOLE: boolean;
  public readonly LOCAL_LINKEDIN_API_TOKEN?: string;
  public readonly AWS_REGION: string;
  public readonly AWS_SQS_ENDPOINT?: string;
  public readonly AWS_QUEUE_URL?: string;
  public readonly AWS_RESULT_QUEUE_URL?: string;

  private constructor(envName: EnvironmentType) {
    try {
      const env = cleanEnv(process.env, {
        MAX_RETRIES: num({ default: 3 }),
        LOGGER_CONSOLE: bool({ default: false }),
        LOCAL_LINKEDIN_API_TOKEN: str({ default: undefined }),
        AWS_REGION: str({ default: 'eu-west-1' }),
        AWS_SQS_ENDPOINT: str({ default: undefined }),
        AWS_QUEUE_URL_STAGE: str({ default: undefined }),
        AWS_RESULT_QUEUE_URL_STAGE: str({ default: undefined }),
        AWS_QUEUE_URL_PRO: str({ default: undefined }),
        AWS_RESULT_QUEUE_URL_PRO: str({ default: undefined })
      });

      this.MAX_RETRIES = env.MAX_RETRIES;
      this.LOGGER_CONSOLE = env.LOGGER_CONSOLE;
      this.LOCAL_LINKEDIN_API_TOKEN = env.LOCAL_LINKEDIN_API_TOKEN ?? undefined;

      this.AWS_REGION = env.AWS_REGION;
      this.AWS_SQS_ENDPOINT = env.AWS_SQS_ENDPOINT;
      this.AWS_QUEUE_URL = envName === 'pro' ? env.AWS_QUEUE_URL_PRO : env.AWS_QUEUE_URL_STAGE;
      this.AWS_RESULT_QUEUE_URL = envName === 'pro' ? env.AWS_QUEUE_URL_PRO : env.AWS_RESULT_QUEUE_URL_STAGE;
    } catch (error: unknown) {
      throw new Error(`🔧 [Environment] Invalid environment variables: ${(error as Error)?.message}`);
    }
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
