import { SQSEvent, SQSRecord } from 'aws-lambda';
import { validateSync } from 'class-validator';
import { LinkedinProfileRequest } from '../contracts/linkedin-profile.request';
import { ValidationUtilities } from '../util/validation';

export class LinkedinProfileRequestMapper {
  public static toDomain(event: SQSEvent): LinkedinProfileRequest {
    const message = this.getMessage(event);
    const messageBody = JSON.parse(message.body);

    const request = new LinkedinProfileRequest();
    request.messageId = message.messageId;
    request.contextId = messageBody.contextId;
    request.env = messageBody.env;
    request.profileId = messageBody.profileId;
    request.profileApiToken = messageBody.profileApiToken;
    request.linkedinUrl = messageBody.linkedinUrl;
    request.attempt = messageBody.attempt;

    this.validate(request);

    return request;
  }

  private static getMessage(event: SQSEvent): SQSRecord {
    if (event.Records.length !== 1) throw Error(`[LinkedinProfileRequestMapper] Batch size must be configured to 1`);
    return event.Records[0];
  }

  private static validate(request: LinkedinProfileRequest): void {
    const errors = validateSync(request);
    if (errors.length > 0) {
      const formattedErrors = ValidationUtilities.formatErrors(errors);
      throw new Error(`[LinkedinProfileRequestMapper] Validation failed: ${JSON.stringify(formattedErrors)}`);
    }
  }
}
