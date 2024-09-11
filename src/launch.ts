import { Context, SQSEvent } from 'aws-lambda';
import { handler } from './main';
import { SQSBody } from './models/sqs-body';
import { logger } from './util/logging';

// 👉 Fake manual execution without AWS: For local testing/debug
void (async (): Promise<void> => {
  const body: SQSBody = {
    contextId: '1234',
    environment: 'local',
  };

  const fakeEvent: SQSEvent = {
    Records: [
      {
        messageId: '059f36b4-87a3-44ab-83d2-661975830a7d',
        receiptHandle: 'AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...',
        body: JSON.stringify(body),
        attributes: {
          ApproximateReceiveCount: '1',
          SentTimestamp: '1545082649183',
          SenderId: 'AIDAIENQZJOLO23YVJ4VO',
          ApproximateFirstReceiveTimestamp: '1545082649185',
        },
        messageAttributes: {},
        md5OfBody: '098f6bcd4621d373cade4e832627b4f6',
        eventSource: 'aws:sqs',
        eventSourceARN: 'arn:aws:sqs:us-east-2:123456789012:my-queue',
        awsRegion: 'eu-west-1',
      },
    ],
  };

  logger.info('👉 Debugging lambda handler  ...');
  await handler(fakeEvent, {} as Context, () => {
    logger.info('✅ Executed handler');
  });
})();
