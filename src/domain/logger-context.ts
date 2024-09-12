export type EnvironmentType = 'local' | 'stage' | 'pro';

export interface LoggerContext {
  messageId: string;
  contextId: string;
  profileId: number;
  env: EnvironmentType;
}
