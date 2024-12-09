import { Message, SQSClient } from '@aws-sdk/client-sqs';
import { Context, SQSEvent, SQSRecord } from 'aws-lambda';
import { Consumer } from 'sqs-consumer';

import { handler } from './index';
import { logger } from './util/logger';

/**
 * Test the SQS consumer locally using LocalStack queues
 */
const sqsClient = new SQSClient({ region: 'eu-west-1', endpoint: 'http://localhost:4566' });

const queueUrl = 'http://localhost:4566/000000000000/linkedin-api-import-profile-local.fifo';

const consumer = Consumer.create({
  queueUrl,
  handleMessage: async (message: Message) => {
    logger.info('👉  Message received:', message);

    try {
      const sqsRecord = {
        messageId: message.MessageId!,
        receiptHandle: message.ReceiptHandle!,
        body: message.Body!,
        attributes: message.Attributes || {},
        messageAttributes: message.MessageAttributes || {},
        md5OfBody: message.MD5OfBody || '',
        eventSource: 'aws:sqs',
        eventSourceARN: `arn:aws:sqs:eu-west-1:000000000000:linkedin-api-import-profile-local.fifo`,
        awsRegion: 'eu-west-1'
      } as unknown as SQSRecord;

      const event = { Records: [sqsRecord] } as SQSEvent;

      const response = await handler(event, {} as Context, () => {
        logger.info('✅  Executed handler');
      });

      return response;
    } catch (error) {
      logger.error('❌  Error handling message:', error);
    }
  },
  sqs: sqsClient
});

consumer.on('error', (err: Error) => {
  logger.error('❌  Consumer error:', err.message);
});

consumer.on('processing_error', (err: Error) => {
  logger.error('❌  Processing error:', err.message);
});

consumer.on('empty', () => {
  logger.info('🥱  Waiting for messages...');
});

logger.info(`🔄  Starting SQS consumer for ${queueUrl}...`);
consumer.start();
