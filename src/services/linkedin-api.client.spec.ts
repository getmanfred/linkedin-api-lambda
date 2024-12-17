import axios, { AxiosError, AxiosResponse } from 'axios';
import { createMockedLinkedinProfile } from '../test/mocks/linkedin-profile.mocks';
import { LinkedinAPIClient } from './linkedin-api.client';

const client = new LinkedinAPIClient();

jest.mock('axios', () => {
  const originalAxios = jest.requireActual('axios');
  return {
    ...originalAxios,
    get: jest.fn()
  };
});

describe('A linkedin api client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get a domain array linkedin profile data using linkedin api', async () => {
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

  it('should get a domain object linkedin profile data using linkedin api', async () => {
    const expectedProfile = createMockedLinkedinProfile().profile;

    const url = `https://api.linkedin.com/rest/memberSnapshotData?q=criteria&domain=PROFILE`;
    const headers = {
      Authorization: `Bearer fake_token`,
      'LinkedIn-Version': '202312'
    };

    (axios.get as jest.Mock).mockImplementation(async (calledUrl, calledOptions) => {
      if (calledUrl === url && JSON.stringify(calledOptions.headers) === JSON.stringify(headers)) {
        return Promise.resolve({
          data: { elements: [{ snapshotData: [expectedProfile] }] }
        });
      }
      return undefined;
    });

    const education = await client.fetchProfileDomainData('fake_token', 'PROFILE', 'OBJECT');

    expect(education).toEqual(expectedProfile);
  });

  describe('when handling linkedin api errors', () => {
    it('should handle error when fetching linkedin profile data', async () => {
      const url = `https://api.linkedin.com/rest/memberSnapshotData?q=criteria&domain=PROFILE`;
      const headers = {
        Authorization: `Bearer fake_token`,
        'LinkedIn-Version': '202312'
      };

      (axios.get as jest.Mock).mockImplementation(async (calledUrl, calledOptions) => {
        if (calledUrl === url && JSON.stringify(calledOptions.headers) === JSON.stringify(headers)) {
          return Promise.reject({ response: { data: { message: 'Error message' } } });
        }
        return undefined;
      });

      await expect(client.fetchProfileDomainData('fake_token', 'PROFILE', 'OBJECT')).rejects.toThrow('Error fetching PROFILE profile data');
    });

    it('should return an empty array for 404 responses when responseType is ARRAY', async () => {
      const mockResponse: AxiosResponse = {
        status: 404,
        data: null,
        headers: {},
        config: { headers: new axios.AxiosHeaders() },
        statusText: 'Not Found'
      };

      const mockError = new AxiosError('Not Found', 'ERR_BAD_REQUEST', undefined, null, mockResponse);
      Object.setPrototypeOf(mockError, AxiosError.prototype);

      (axios.get as jest.Mock).mockRejectedValueOnce(mockError);

      const result = await client.fetchProfileDomainData('fake_token', 'SKILLS', 'ARRAY');

      expect(result).toEqual([]);
    });
    it('should return an empty object for 404 responses when responseType is OBJECT', async () => {
      const mockResponse: AxiosResponse = {
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: { headers: new axios.AxiosHeaders() },
        data: null
      };

      const mockError = new AxiosError('Request failed with status code 404', 'ERR_BAD_REQUEST', undefined, null, mockResponse);

      Object.setPrototypeOf(mockError, AxiosError.prototype);

      (axios.get as jest.Mock).mockRejectedValueOnce(mockError);

      const result = await client.fetchProfileDomainData('fake_token', 'PROFILE', 'OBJECT');

      expect(result).toEqual({});
    });

    it('should throw an error for non-404 HTTP errors', async () => {
      (axios.get as jest.Mock).mockRejectedValueOnce({
        response: { status: 500, data: { error: 'Internal Server Error' } },
        stack: 'Mocked stack trace'
      });

      await expect(client.fetchProfileDomainData('fake_token', 'PROFILE', 'OBJECT')).rejects.toThrow('Error fetching PROFILE profile data');
    });

    it('should throw an error for unexpected response structure', async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce({
        data: { unexpectedKey: 'unexpectedValue' }
      });

      await expect(client.fetchProfileDomainData('fake_token', 'PROFILE', 'OBJECT')).rejects.toThrow('Error fetching PROFILE profile data');
    });
  });
});
