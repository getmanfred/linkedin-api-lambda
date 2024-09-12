import axios, { AxiosError } from 'axios';
import { logger } from '../util/logger';

export type LinkedinDomain = 'PROFILE' | 'SKILLS' | 'POSITIONS' | 'EDUCATION';

export class LinkedinAPIClient {
  public constructor() {}

  /* TODO: 
    - refactor to not check for domain type
    - improve error handling: detect not provided data
  */
  public async fetchProfileDomainData<A>(token: string, domain: LinkedinDomain): Promise<A> {
    const url = `https://api.linkedin.com/rest/memberSnapshotData?q=criteria&domain=${domain}`;
    const isResponseArray = domain !== 'PROFILE';
    logger.debug(`🔍 [LinkedinAPIClient] Fetching ${domain} domain profile data ...`);
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'LinkedIn-Version': '202312'
      };

      const response = await axios.get(url, { headers });

      const data = isResponseArray ? response.data.elements[0].snapshotData : response.data.elements[0].snapshotData[0];
      return data;
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 404) return (isResponseArray ? [] : {}) as A;
      if (error instanceof AxiosError) {
        const responseData = JSON.stringify(error.response?.data);
        logger.error(`🚨 [LinkedinAPIClient] Error fetching ${domain} profile data: ${responseData}`, error.stack);
      }
      throw new Error(`Error fetching ${domain} profile data`);
    }
  }
}
