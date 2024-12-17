/* eslint-disable @typescript-eslint/no-require-imports */
import { SQSClient } from '@aws-sdk/client-sqs';
import { createMockedLinkedinProfileRequest, createMockedLinkedinProfileResponse } from '../test/mocks/linkedin-profile.mocks';
import { Environment } from '../util/environment';
import { QueueClient } from './queue.client';

jest.mock('@aws-sdk/client-sqs');

describe('QueueClient', () => {
  const mockSend = jest.fn();
  const mockEnvironment: Environment = {
    AWS_RESULT_QUEUE_URL: 'https://sqs.fake/result-queue',
    AWS_QUEUE_URL: 'https://sqs.fake/queue',
    AWS_REGION: 'us-east-1',
    AWS_SQS_ENDPOINT: 'http://localhost:4566',
    MAX_RETRIES: 3,
    LOGGER_CONSOLE: true
  };

  beforeAll(() => {
    (SQSClient as jest.Mock).mockImplementation(() => ({
      send: mockSend
    }));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send a message to the result queue', async () => {
    const response = createMockedLinkedinProfileResponse();

    const spySendMessageCommand = jest.spyOn(require('@aws-sdk/client-sqs'), 'SendMessageCommand');

    await QueueClient.sendToResultQueue(response, mockEnvironment);

    expect(spySendMessageCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        MessageBody: JSON.stringify(response),
        QueueUrl: mockEnvironment.AWS_RESULT_QUEUE_URL,
        MessageGroupId: expect.any(String),
        MessageDeduplicationId: expect.any(String)
      })
    );
  });

  it('should resend a message to the queue', async () => {
    const request = createMockedLinkedinProfileRequest();
    const spySendMessageCommand = jest.spyOn(require('@aws-sdk/client-sqs'), 'SendMessageCommand');

    await QueueClient.resendMessage(request, mockEnvironment);

    expect(spySendMessageCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        MessageBody: JSON.stringify({ ...request, attempt: 2 }),
        QueueUrl: mockEnvironment.AWS_QUEUE_URL,
        MessageGroupId: expect.any(String),
        MessageDeduplicationId: expect.any(String),
        DelaySeconds: 120
      })
    );
  });
});
