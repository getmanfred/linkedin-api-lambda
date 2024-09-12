import { mock, mockReset } from 'jest-mock-extended';
import { createMockedLinkedinProfile } from '../test/mocks/linkedin-profile.mocks';
import { LinkedinAPIClient } from './linkedin-api.client';
import { LinkedinProfileService } from './linkedin-profile.service';

const client = mock<LinkedinAPIClient>();
const service = new LinkedinProfileService();

jest.mock('./linkedin-api.client', () => ({
  LinkedinAPIClient: jest.fn(() => client)
}));

describe('A linkedin profile service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReset(client);
  });

  it('should get linkedin profile using client', async () => {
    const expectedProfile = createMockedLinkedinProfile();

    client.fetchProfileDomainData.calledWith('fake_token', 'PROFILE').mockResolvedValue(expectedProfile.profile);
    client.fetchProfileDomainData.calledWith('fake_token', 'SKILLS').mockResolvedValue(expectedProfile.skills);
    client.fetchProfileDomainData.calledWith('fake_token', 'POSITIONS').mockResolvedValue(expectedProfile.positions);
    client.fetchProfileDomainData.calledWith('fake_token', 'EDUCATION').mockResolvedValue(expectedProfile.education);

    const profile = await service.getLinkedinProfile('fake_token');

    expect(profile).toEqual(expectedProfile);
  });
});
