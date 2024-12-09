import { Context } from 'aws-lambda';
import { mock, mockReset } from 'jest-mock-extended';
import { handler } from './index';
import { LinkedinProfileService } from './services/linkedin-profile.service';
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

describe('Linkedin lambda handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReset(linkedinProfileService);
  });

  it('should handle message and return a response with Linkedin Profile as Mac Profile', async () => {
    const event = createMockedSqsSEvent();
    const expectedLinkedinProfile = createMockedLinkedinProfile();

    linkedinProfileService.getLinkedinProfile.calledWith('fake-token').mockResolvedValue({
      linkedinProfile: expectedLinkedinProfile,
      isEmptyProfile: false
    });

    const response = await handler(event, {} as Context, () => {});

    expect(response).toMatchSnapshot();
  });

  it('should throw an error if number of messages  is not 1', async () => {
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

  // TODO: Review this corner case: this should be valid?
  it('should throw an error if response is not a valid LinkedinProfileResponse', async () => {
    const event = createMockedSqsSEvent();
    const expectedLinkedinProfile = createMockedLinkedinProfileEmpty();
    const expectedErrorString =
      '[LinkedinProfileResponseMapper] MAC Validation failed: ["property: mac.aboutMe.profile.title errors: title should not be empty"]';

    linkedinProfileService.getLinkedinProfile.calledWith('fake-token').mockResolvedValue({
      linkedinProfile: expectedLinkedinProfile,
      isEmptyProfile: false
    });

    await expect(handler(event, {} as Context, () => {})).rejects.toThrow(new Error(expectedErrorString));
  });
});
