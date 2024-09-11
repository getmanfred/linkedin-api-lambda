export type Environment = 'local' | 'stage' | 'pro';
export interface SQSBody {
  contextId: string;
  environment: Environment;
}
