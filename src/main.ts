import { Handler, SQSEvent } from 'aws-lambda';
import { logger } from './util/logging';

export const handler: Handler = async (event: SQSEvent): Promise<void> => {
  try {
    // TODO: Implement your logic here
    // validate env variables
    logger.debug('Event:', event);
  } catch (error) {
    throw error;
  }
};
