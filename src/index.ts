import { Handler, SQSEvent } from 'aws-lambda';
import 'reflect-metadata';
import { LinkedinProfileResponse } from './contracts/linkedin-profile.response';
import { InvalidMacError } from './domain/errors/invalid-mac.error';
import { MaxRetriesError } from './domain/errors/max-retries.error';
import { LinkedinProfileRequestMapper } from './mappers/linkedin-profile.request.mapper';
import { LinkedinProfileResponseMapper } from './mappers/linkedin-profile.response.mapper';
import { LinkedinProfileService } from './services/linkedin-profile.service';
import { QueueClient } from './services/queue.client';
import { Environment } from './util/environment';
import { logger } from './util/logger';

export const handler: Handler = async (event: SQSEvent): Promise<LinkedinProfileResponse | undefined> => {
  const request = LinkedinProfileRequestMapper.toDomain(event);
  const env = Environment.setupEnvironment(request);

  try {
    logger.info(`⌛️ [handler] Starting Linkedin profile request for linkedinProfileUrl: ${request.linkedinProfileUrl}`);

    const { linkedinProfile, isEmptyProfile, timeElapsed } = await new LinkedinProfileService().getLinkedinProfile(request.linkedinApiToken);

    if (!isEmptyProfile && linkedinProfile) {
      const linkedinProfileResponse = LinkedinProfileResponseMapper.toResponse(linkedinProfile, request, timeElapsed);
      logger.info(`✅ [handler] Linkedin profile response with MAC: ${JSON.stringify(linkedinProfileResponse.profile)}`);
      await QueueClient.sendToResultQueue(linkedinProfileResponse, env);
      return linkedinProfileResponse;
    }

    logger.warn(`👻 [handler] Linkedin profile is not synced for linkedinProfileUrl: ${request.linkedinProfileUrl}`);
    if (request.attempt >= env.MAX_RETRIES) throw new MaxRetriesError(`Max attempts reached for Linkedin profile request: ${env.MAX_RETRIES}`);
    await QueueClient.resendMessage(request, env);

    return undefined;
  } catch (error: unknown) {
    const errorType = error instanceof MaxRetriesError ? 'expired' : error instanceof InvalidMacError ? 'invalid-mac' : 'unknown';
    const errorMessage = (error as Error)?.message || 'unknown error';

    logger.error(`❌ [handler] Error processing Linkedin profile request`, { error, errorType, errorMessage, event });
    const result = LinkedinProfileResponseMapper.toErrorResponse(errorType, errorMessage, request);
    await QueueClient.sendToResultQueue(result, env);
    throw error;
  }
};
