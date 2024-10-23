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

    client.fetchProfileDomainData.calledWith('fake_token', 'PROFILE', 'OBJECT').mockResolvedValue(expectedProfile.profile);
    client.fetchProfileDomainData.calledWith('fake_token', 'SKILLS', 'ARRAY').mockResolvedValue(expectedProfile.skills);
    client.fetchProfileDomainData.calledWith('fake_token', 'POSITIONS', 'ARRAY').mockResolvedValue(expectedProfile.positions);
    client.fetchProfileDomainData.calledWith('fake_token', 'EDUCATION', 'ARRAY').mockResolvedValue(expectedProfile.education);

    const { linkedinProfile, isEmptyProfile } = await service.getLinkedinProfile('fake_token');
    expect(linkedinProfile).toEqual(expectedProfile);
    expect(isEmptyProfile).toBe(false);
  });

  it('should return empty profile flag', async () => {
    client.fetchProfileDomainData.calledWith('fake_token', 'PROFILE', 'OBJECT').mockResolvedValue({});
    client.fetchProfileDomainData.calledWith('fake_token', 'SKILLS', 'ARRAY').mockResolvedValue([]);
    client.fetchProfileDomainData.calledWith('fake_token', 'POSITIONS', 'ARRAY').mockResolvedValue([]);
    client.fetchProfileDomainData.calledWith('fake_token', 'EDUCATION', 'ARRAY').mockResolvedValue([]);

    const { isEmptyProfile } = await service.getLinkedinProfile('fake_token');
    expect(isEmptyProfile).toBe(true);
  });
});
