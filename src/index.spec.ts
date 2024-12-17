/* eslint-disable no-process-env */
import { Context } from 'aws-lambda';
import { mock, mockReset } from 'jest-mock-extended';
import { InvalidMacError } from './domain/errors/invalid-mac.error';
import { MaxRetriesError } from './domain/errors/max-retries.error';
import { handler } from './index';
import { LinkedinProfileService } from './services/linkedin-profile.service';
import { QueueClient } from './services/queue.client';
import {
  createMockedLinkedinProfile,
  createMockedLinkedinProfileEmpty,
  createMockedLinkedinProfileRequest
} from './test/mocks/linkedin-profile.mocks';
import { createMockedSqsSEvent } from './test/mocks/sqs.mocks';

const linkedinProfileService = mock<LinkedinProfileService>();

jest.mock('./services/linkedin-profile.service', () => ({
  LinkedinProfileService: jest.fn(() => linkedinProfileService)
}));

jest.mock('./services/queue.client', () => ({
  QueueClient: {
    sendToResultQueue: jest.fn().mockResolvedValue(undefined),
    resendMessage: jest.fn().mockResolvedValue(undefined)
  }
}));

describe('Linkedin lambda handler', () => {
  beforeEach(() => {
    mockReset(linkedinProfileService);
    jest.clearAllMocks();

    process.env.AWS_QUEUE_URL = 'queue-url';
    process.env.AWS_RESULT_QUEUE_URL = 'result-queue-url';
  });

  describe('when handling a successful request', () => {
    it('should return a response with Linkedin Profile as Mac Profile', async () => {
      const event = createMockedSqsSEvent();
      const expectedLinkedinProfile = createMockedLinkedinProfile();

      linkedinProfileService.getLinkedinProfile.calledWith('fake-token').mockResolvedValue({
        linkedinProfile: expectedLinkedinProfile,
        isEmptyProfile: false,
        timeElapsed: 1000
      });

      const response = await handler(event, {} as Context, () => {});

      expect(response).toMatchSnapshot();
    });

    it('should send response to sqs result queue ', async () => {
      const event = createMockedSqsSEvent();
      const expectedLinkedinProfile = createMockedLinkedinProfile();

      linkedinProfileService.getLinkedinProfile.calledWith('fake-token').mockResolvedValue({
        linkedinProfile: expectedLinkedinProfile,
        isEmptyProfile: false,
        timeElapsed: 1000
      });

      const response = await handler(event, {} as Context, () => {});

      expect(QueueClient.sendToResultQueue).toHaveBeenCalledWith(response, expect.anything());
    });
  });

  describe('when handling a failed request', () => {
    it('should throw an error if number of messages is not 1', async () => {
      const event = createMockedSqsSEvent();
      event.Records = [{ ...event.Records[0] }, { ...event.Records[0] }];

      await expect(handler(event, {} as Context, () => {})).rejects.toThrow(
        new Error('[LinkedinProfileRequestMapper] Batch size must be configured to 1')
      );
    });

    it('should throw an error if message is not a valid LinkedinProfileRequest', async () => {
      const request = createMockedLinkedinProfileRequest();
      request.linkedinApiToken = undefined as unknown as string; // missing required field
      const event = createMockedSqsSEvent(request);
      const expectedErrorString =
        '[LinkedinProfileRequestMapper] Validation failed: ["property: linkedinApiToken errors: linkedinApiToken must be a string"]';

      await expect(handler(event, {} as Context, () => {})).rejects.toThrow(new Error(expectedErrorString));
    });
  });

  describe('when handling an empty response', () => {
    it('should resend message to sqs queue if empty response and no reached max retries ', async () => {
      const event = createMockedSqsSEvent();
      const expectedLinkedinProfile = createMockedLinkedinProfileEmpty();

      linkedinProfileService.getLinkedinProfile.calledWith('fake-token').mockResolvedValue({
        linkedinProfile: expectedLinkedinProfile,
        isEmptyProfile: true,
        timeElapsed: 1000
      });

      await handler(event, {} as Context, () => {});
      expect(QueueClient.resendMessage).toHaveBeenCalled();
    });

    it('should throw an error if max retries reached', async () => {
      const request = createMockedLinkedinProfileRequest({ attempt: 3 });
      const event = createMockedSqsSEvent(request);
      const expectedLinkedinProfile = createMockedLinkedinProfileEmpty();

      linkedinProfileService.getLinkedinProfile.calledWith('fake-token').mockResolvedValue({
        linkedinProfile: expectedLinkedinProfile,
        isEmptyProfile: true,
        timeElapsed: 1000
      });

      await expect(handler(event, {} as Context, () => {})).rejects.toThrow(MaxRetriesError);
    });
  });

  describe('when handling a failed response', () => {
    it('should throw an error if response is not a valid LinkedinProfileResponse', async () => {
      const event = createMockedSqsSEvent();
      const expectedLinkedinProfile = createMockedLinkedinProfileEmpty();
      const expectedErrorString =
        '[LinkedinProfileResponseMapper] MAC Validation failed: ["property: profile.aboutMe.profile.title errors: title should not be empty"]';

      linkedinProfileService.getLinkedinProfile.calledWith('fake-token').mockResolvedValue({
        linkedinProfile: expectedLinkedinProfile,
        isEmptyProfile: false,
        timeElapsed: 1000
      });

      await expect(handler(event, {} as Context, () => {})).rejects.toThrow(new InvalidMacError(expectedErrorString));
    });

    it('should send response to sqs result queue ', async () => {
      const event = createMockedSqsSEvent();
      const expectedLinkedinProfile = createMockedLinkedinProfileEmpty();
      const expectedErrorString =
        '[LinkedinProfileResponseMapper] MAC Validation failed: ["property: profile.aboutMe.profile.title errors: title should not be empty"]';

      linkedinProfileService.getLinkedinProfile.calledWith('fake-token').mockResolvedValue({
        linkedinProfile: expectedLinkedinProfile,
        isEmptyProfile: false,
        timeElapsed: 1000
      });

      await expect(handler(event, {} as Context, () => {})).rejects.toThrow(new Error(expectedErrorString));
      expect(QueueClient.sendToResultQueue).toHaveBeenCalled();
    });

    it('should handle unknown errors and send to result queue', async () => {
      const event = createMockedSqsSEvent();

      jest.spyOn(linkedinProfileService, 'getLinkedinProfile').mockRejectedValue(new Error());

      await expect(handler(event, {} as Context, () => {})).rejects.toThrow();

      expect(QueueClient.sendToResultQueue).toHaveBeenCalledWith(
        expect.objectContaining({
          errorType: 'unknown',
          errorMessage: 'unknown error'
        }),
        expect.anything()
      );
    });
  });
});
