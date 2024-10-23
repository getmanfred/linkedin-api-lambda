import axios, { AxiosError } from 'axios';
import { logger } from '../util/logger';

export type LinkedinDomain = 'PROFILE' | 'SKILLS' | 'POSITIONS' | 'EDUCATION';
export type LinkedinDomainResponseType = 'OBJECT' | 'ARRAY';

export class LinkedinAPIClient {
  public constructor() {}

  public async fetchProfileDomainData<A>(token: string, domain: LinkedinDomain, responseType: LinkedinDomainResponseType): Promise<A> {
    const url = `https://api.linkedin.com/rest/memberSnapshotData?q=criteria&domain=${domain}`;
    const isArrayData = responseType === 'ARRAY';

    logger.debug(`🔍 [LinkedinAPIClient] Fetching ${domain} domain profile data ...`);
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'LinkedIn-Version': '202312'
      };

      const response = await axios.get(url, { headers });

      const data = isArrayData ? response.data.elements[0].snapshotData : response.data.elements[0].snapshotData[0];
      return data;
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 404) return (isArrayData ? [] : {}) as A;
      if (error instanceof AxiosError) {
        const responseData = JSON.stringify(error.response?.data);
        logger.error(`🚨 [LinkedinAPIClient] Error fetching ${domain} profile data: ${responseData}`, error.stack);
      }
      throw new Error(`Error fetching ${domain} profile data`);
    }
  }
}
