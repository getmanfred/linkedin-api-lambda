import { DeleteMessageCommand, SendMessageCommand, SendMessageCommandInput, SQSClient } from '@aws-sdk/client-sqs';
import { v4 as uuid } from 'uuid';
import { LinkedinProfileRequest } from '../contracts/linkedin-profile.request';
import { LinkedinProfileResponse } from '../contracts/linkedin-profile.response';
import { Environment } from '../util/environment';
import { logger } from '../util/logger';

export class QueueClient {
  public static async sendToResultQueue(result: LinkedinProfileResponse, environment: Environment): Promise<void> {
    const queueUrl = environment.AWS_RESULT_QUEUE_URL;
    const region = environment.AWS_REGION;
    const endpoint = environment.AWS_SQS_ENDPOINT;
    const messageClient = new SQSClient({ region, endpoint });

    const message: SendMessageCommandInput = {
      MessageBody: JSON.stringify(result),
      QueueUrl: queueUrl,
      MessageGroupId: uuid(),
      MessageDeduplicationId: uuid()
    };

    if (queueUrl) {
      logger.info(`💌 [QueueClient] Sending message to result queue: ${queueUrl}`, message);
      const messageCommand = new SendMessageCommand(message);
      await messageClient.send(messageCommand);
    } else {
      logger.warn(`💌 [QueueClient] Sending message to result queue: no queue provided`, message);
    }
  }

  public static async resendMessage(request: LinkedinProfileRequest, environment: Environment): Promise<void> {
    const attempt = request.attempt + 1;

    const queueUrl = environment.AWS_QUEUE_URL;
    const region = environment.AWS_REGION;
    const endpoint = environment.AWS_SQS_ENDPOINT;
    const messageClient = new SQSClient({ region, endpoint });

    const message: SendMessageCommandInput = {
      MessageBody: JSON.stringify({ ...request, attempt }),
      QueueUrl: queueUrl,
      MessageGroupId: uuid(),
      MessageDeduplicationId: uuid()
    };

    if (queueUrl) {
      logger.info(`💌 [QueueClient] Sending message again to queue (attempt: ${attempt}): ${queueUrl}`, message);
      const messageCommand = new SendMessageCommand(message);
      await messageClient.send(messageCommand);
    } else {
      logger.warn(`💌 [QueueClient] Sending message again to queue: no queue provided`, message);
    }
  }

  public static async removeMessage(receiptHandle: string, environment: Environment): Promise<void> {
    const queueUrl = environment.AWS_QUEUE_URL;
    const region = environment.AWS_REGION;
    const endpoint = environment.AWS_SQS_ENDPOINT;
    const messageClient = new SQSClient({ region, endpoint });

    if (queueUrl) {
      logger.info(`💌 [QueueClient] Remove message with receiptHandle: ${receiptHandle} from queue: ${queueUrl}`);
      await messageClient.send(new DeleteMessageCommand({ QueueUrl: queueUrl, ReceiptHandle: receiptHandle }));
    } else {
      logger.warn(`💌 [QueueClient] Remove message with receiptHandle: ${receiptHandle} from queue: no queue provided`);
    }
  }
}
