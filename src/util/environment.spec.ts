/* eslint-disable no-process-env */
import { createMockedLinkedinProfileRequest } from '../test/mocks/linkedin-profile.mocks';
import { Environment } from './environment';

describe('Environment config', () => {
  const mockEnv = {
    MAX_RETRIES: '5',
    LOGGER_CONSOLE: 'true',
    LOCAL_LINKEDIN_API_TOKEN: 'mock-api-token',
    AWS_REGION: 'us-east-1',
    AWS_SQS_ENDPOINT: 'http://localhost:4566',
    AWS_QUEUE_URL_STAGE: 'https://sqs-stage.amazonaws.com/1234567890/stage-queue',
    AWS_RESULT_QUEUE_URL_STAGE: 'https://sqs-stage.amazonaws.com/1234567890/stage-result-queue',
    AWS_QUEUE_URL_PRO: 'https://sqs-pro.amazonaws.com/1234567890/pro-queue',
    AWS_RESULT_QUEUE_URL_PRO: 'https://sqs-pro.amazonaws.com/1234567890/pro-result-queue'
  };

  beforeEach(() => {
    process.env = { ...mockEnv };
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('should correctly load environment variables for "stage" environment and match snapshot', () => {
    const request = createMockedLinkedinProfileRequest({ env: 'stage' });

    const environment = Environment.setupEnvironment(request);

    expect(environment).toMatchSnapshot();
  });

  it('should correctly load environment variables for "pro" environment and match snapshot', () => {
    const request = createMockedLinkedinProfileRequest({ env: 'pro' });

    const environment = Environment.setupEnvironment(request);

    expect(environment).toMatchSnapshot();
  });

  it('should throw an error when environment variables are invalid', () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });

    process.env.MAX_RETRIES = 'invalid';

    const request = createMockedLinkedinProfileRequest({ env: 'pro' });

    expect(() => Environment.setupEnvironment(request)).toThrowErrorMatchingSnapshot();

    mockExit.mockRestore();
  });
});
