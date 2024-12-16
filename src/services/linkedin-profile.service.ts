import {
  LinkedinProfile,
  LinkedinProfileEducation,
  LinkedinProfilePosition,
  LinkedinProfileProfile,
  LinkedinProfileSkill
} from '../domain/linkedin-profile';
import { logger } from '../util/logger';
import { LinkedinAPIClient } from './linkedin-api.client';

export class LinkedinProfileService {
  private readonly client = new LinkedinAPIClient();

  public constructor() {}

  public async getLinkedinProfile(token: string): Promise<{ linkedinProfile: LinkedinProfile; isEmptyProfile: boolean; timeElapsed: number }> {
    const startTime = Date.now();
    const profile = await this.client.fetchProfileDomainData<LinkedinProfileProfile>(token, 'PROFILE', 'OBJECT');
    const skills = await this.client.fetchProfileDomainData<LinkedinProfileSkill[]>(token, 'SKILLS', 'ARRAY');
    const positions = await this.client.fetchProfileDomainData<LinkedinProfilePosition[]>(token, 'POSITIONS', 'ARRAY');
    const education = await this.client.fetchProfileDomainData<LinkedinProfileEducation[]>(token, 'EDUCATION', 'ARRAY');

    const linkedinProfile = { profile, skills, positions, education };
    const isEmptyProfile = this.isEmptyProfile(profile);
    const timeElapsed = Date.now() - startTime; // in milliseconds
    logger.debug(`🧐 [LinkedinProfileService] Linkedin profile retrieved: ${JSON.stringify(linkedinProfile)}`);

    return { linkedinProfile, isEmptyProfile, timeElapsed };
  }

  // --- 🔐 Private methods

  private isEmptyProfile(profile: LinkedinProfileProfile): boolean {
    const json = JSON.stringify(profile);
    return json === '{}';
  }
}
