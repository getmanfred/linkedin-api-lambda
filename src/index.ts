import { Handler, SQSEvent } from 'aws-lambda';
import 'reflect-metadata';
import { LinkedinProfileResponse } from './contracts/linkedin-profile.response';
import { LinkedinProfileRequestMapper } from './mappers/linkedin-profile.request.mapper';
import { LinkedinProfileResponseMapper } from './mappers/linkedin-profile.response.mapper';
import { LinkedinProfileService } from './services/linkedin-profile.service';
import { Environment } from './util/environment';
import { logger } from './util/logger';

export const handler: Handler = async (event: SQSEvent): Promise<LinkedinProfileResponse> => {
  try {
    const linkedinProfileRequest = LinkedinProfileRequestMapper.toDomain(event);
    Environment.setupEnvironment(linkedinProfileRequest);
    logger.info(`⌛️ [handler] Starting Linkedin profile request for linkedinUrl: ${linkedinProfileRequest.linkedinUrl}`);

    const linkedinProfile = await new LinkedinProfileService().getLinkedinProfile(linkedinProfileRequest.profileApiToken);
    const linkedinProfileResponse = LinkedinProfileResponseMapper.toResponse(linkedinProfile);

    logger.info(`✅ [handler] Linkedin profile response with MAC: ${JSON.stringify(linkedinProfileResponse.mac)}`);

    // TODO: send response to SQS queue

    return linkedinProfileResponse;
  } catch (error) {
    throw error;
  }
};
