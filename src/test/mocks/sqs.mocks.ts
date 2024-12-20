import { SQSEvent } from 'aws-lambda';
import { LinkedinProfileRequest } from '../../contracts/linkedin-profile.request';
import { createMockedLinkedinProfileRequest } from './linkedin-profile.mocks';

export const createMockedSqsSEvent = (customRequest?: Partial<LinkedinProfileRequest>): SQSEvent => {
  const request = customRequest ?? createMockedLinkedinProfileRequest();
  const event = {
    Records: [
      {
        messageId: '059f36b4-87a3-44ab-83d2-661975830a7d',
        receiptHandle: 'AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...',
        body: JSON.stringify(request),
        attributes: {
          ApproximateReceiveCount: '1',
          SentTimestamp: '1545082649183',
          SenderId: 'AIDAIENQZJOLO23YVJ4VO',
          ApproximateFirstReceiveTimestamp: '1545082649185'
        },
        messageAttributes: {},
        md5OfBody: '098f6bcd4621d373cade4e832627b4f6',
        eventSource: 'aws:sqs',
        eventSourceARN: 'arn:aws:sqs:us-east-2:123456789012:my-queue',
        awsRegion: 'eu-west-1'
      }
    ]
  };
  return event;
};
