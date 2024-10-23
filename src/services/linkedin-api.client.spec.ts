import axios from 'axios';
import { createMockedLinkedinProfile } from '../test/mocks/linkedin-profile.mocks';
import { LinkedinAPIClient } from './linkedin-api.client';

const client = new LinkedinAPIClient();

jest.mock('axios');

describe('A linkedin api client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get a domain linkedin profile data using linkedin api', async () => {
    const expectedEducation = createMockedLinkedinProfile().education;

    const url = `https://api.linkedin.com/rest/memberSnapshotData?q=criteria&domain=EDUCATION`;
    const headers = {
      Authorization: `Bearer fake_token`,
      'LinkedIn-Version': '202312'
    };

    (axios.get as jest.Mock).mockImplementation(async (calledUrl, calledOptions) => {
      if (calledUrl === url && JSON.stringify(calledOptions.headers) === JSON.stringify(headers)) {
        return Promise.resolve({
          data: { elements: [{ snapshotData: expectedEducation }] }
        });
      }
      return undefined;
    });

    const education = await client.fetchProfileDomainData('fake_token', 'EDUCATION', 'ARRAY');

    expect(education).toEqual(expectedEducation);
  });
});
