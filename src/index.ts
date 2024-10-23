import { Handler, SQSEvent } from 'aws-lambda';
import 'reflect-metadata';
import { LinkedinProfileResponse } from './contracts/linkedin-profile.response';
import { LinkedinProfileRequestMapper } from './mappers/linkedin-profile.request.mapper';
import { LinkedinProfileResponseMapper } from './mappers/linkedin-profile.response.mapper';
import { LinkedinProfileService } from './services/linkedin-profile.service';
import { Environment } from './util/environment';
import { logger } from './util/logger';

export const handler: Handler = async (event: SQSEvent): Promise<LinkedinProfileResponse | undefined> => {
  try {
    const linkedinProfileRequest = LinkedinProfileRequestMapper.toDomain(event);
    Environment.setupEnvironment(linkedinProfileRequest);
    logger.info(`⌛️ [handler] Starting Linkedin profile request for linkedinUrl: ${linkedinProfileRequest.linkedinUrl}`, linkedinProfileRequest);

    const { linkedinProfile, isEmptyProfile } = await new LinkedinProfileService().getLinkedinProfile(linkedinProfileRequest.profileApiToken);

    if (isEmptyProfile) {
      logger.warn(`👻 [handler] Linkedin profile is not synced for linkedinUrl: ${linkedinProfileRequest.linkedinUrl}`, linkedinProfileRequest);
      // TODO: send response to SQS queue again if no max retries
      return undefined;
    }

    const linkedinProfileResponse = LinkedinProfileResponseMapper.toResponse(linkedinProfile);
    logger.info(`✅ [handler] Linkedin profile response with MAC: ${JSON.stringify(linkedinProfileResponse.mac)}`, linkedinProfileRequest);
    // TODO: send response to result SQS queue

    return linkedinProfileResponse;
  } catch (error) {
    logger.error(`❌ [handler] Error processing Linkedin profile request: ${error}`, error);
    throw error;
  }
};
