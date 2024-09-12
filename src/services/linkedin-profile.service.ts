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

  public async getLinkedinProfile(token: string): Promise<LinkedinProfile> {
    const profile = await this.client.fetchProfileDomainData<LinkedinProfileProfile>(token, 'PROFILE');
    const skills = await this.client.fetchProfileDomainData<LinkedinProfileSkill[]>(token, 'SKILLS');
    const positions = await this.client.fetchProfileDomainData<LinkedinProfilePosition[]>(token, 'POSITIONS');
    const education = await this.client.fetchProfileDomainData<LinkedinProfileEducation[]>(token, 'EDUCATION');

    const linkedinProfile = { profile, skills, positions, education };

    logger.debug(`🧐 [LinkedinProfileService] Linkedin profile retrieved: ${JSON.stringify(linkedinProfile)}`, { linkedinProfile });
    return linkedinProfile;
  }
}
