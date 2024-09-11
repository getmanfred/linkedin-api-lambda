export interface Context {
  messageId: string;
  messageBody: object;
  contextId: string;
  profileId: string;
  environment: 'local' | 'stage' | 'pro';
  serviceName: string;
}
