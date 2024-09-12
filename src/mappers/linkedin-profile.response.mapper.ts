import { validateSync } from 'class-validator';
import {
  LinkedinProfileResponse,
  LinkedinProfileResponseMac,
  LinkedinProfileResponseMacCompetence,
  LinkedinProfileResponseMacExperience,
  LinkedinProfileResponseMacExperienceJobChallenge,
  LinkedinProfileResponseMacJob,
  LinkedinProfileResponseMacJobRole,
  LinkedinProfileResponseMacKnowledge,
  LinkedinProfileResponseMacPerson,
  LinkedinProfileResponseMacPublicEntity,
  LinkedinProfileResponseMacSkill,
  LinkedinProfileResponseMacStudy
} from '../contracts/linkedin-profile.response';
import {
  LinkedinProfile,
  LinkedinProfileEducation,
  LinkedinProfilePosition,
  LinkedinProfileProfile,
  LinkedinProfileSkill
} from '../domain/linkedin-profile';
import { DateUtilities } from '../util/date';
import { logger } from '../util/logger';
import { ValidationUtilities } from '../util/validation';

export class LinkedinProfileResponseMapper {
  public static toResponse(linkedinProfile: LinkedinProfile): LinkedinProfileResponse {
    const response = new LinkedinProfileResponse();

    response.result = 'success';
    response.mac = this.toMac(linkedinProfile);

    this.validate(response);

    return response;
  }

  // 🔓 -- Private methods --

  private static toMac(linkedinProfile: LinkedinProfile): LinkedinProfileResponseMac {
    const mac = new LinkedinProfileResponseMac();
    mac.aboutMe.profile = this.toProfile(linkedinProfile.profile);
    mac.experience = this.toExperience(linkedinProfile.positions);
    mac.knowledge = this.toKnowledge(linkedinProfile.education, linkedinProfile.skills);
    return mac;
  }

  private static toProfile(profileData: LinkedinProfileProfile): LinkedinProfileResponseMacPerson {
    const profile = new LinkedinProfileResponseMacPerson();
    profile.title = profileData.Headline || '';
    profile.description = profileData.Summary || undefined;
    return profile;
  }

  private static toExperience(positions: LinkedinProfilePosition[]): LinkedinProfileResponseMacExperience {
    const experience = new LinkedinProfileResponseMacExperience();
    experience.jobs = positions.map((position) => {
      {
        const job = new LinkedinProfileResponseMacJob();
        const organization = new LinkedinProfileResponseMacPublicEntity();
        organization.name = position['Company Name'] || '';
        job.organization = organization;

        const role = new LinkedinProfileResponseMacJobRole();
        role.name = position.Title || '';
        role.startDate = DateUtilities.toIsoDate(position['Started On'], 'MMM yyyy') || new Date().toISOString();
        role.finishDate = position['Finished On'] ? DateUtilities.toIsoDate(position['Finished On'], 'MMM yyyy') : undefined;

        const challenge = new LinkedinProfileResponseMacExperienceJobChallenge();
        challenge.description = position.Description || '';
        role.challenges = [challenge];

        job.roles = [role];

        return job;
      }
    });
    return experience;
  }

  private static toKnowledge(education: LinkedinProfileEducation[], skills: LinkedinProfileSkill[]): LinkedinProfileResponseMacKnowledge {
    const knowledge = new LinkedinProfileResponseMacKnowledge();

    knowledge.hardSkills = skills.map((skillItem) => {
      const skill = new LinkedinProfileResponseMacSkill();
      const competence = new LinkedinProfileResponseMacCompetence();
      competence.name = skillItem.Name || '';
      competence.type = 'technology';
      skill.skill = competence;
      return skill;
    });

    knowledge.studies = education.map((educationItem) => {
      const study = new LinkedinProfileResponseMacStudy();
      study.studyType = 'officialDegree';
      study.name = educationItem['Degree Name'] || educationItem['School Name'] || '';
      study.startDate = DateUtilities.toIsoDate(educationItem['Start Date'], 'yyyy') || new Date().toISOString();
      study.finishDate = educationItem['End Date'] ? DateUtilities.toIsoDate(educationItem['End Date'], 'yyyy') : undefined;
      study.degreeAchieved = !!educationItem['End Date'];
      study.description = educationItem['Degree Name'] || educationItem['School Name'];
      if (educationItem['School Name']) {
        const institution = new LinkedinProfileResponseMacPublicEntity();
        institution.name = educationItem['School Name'];
      }
      return study;
    });
    return knowledge;
  }

  private static validate(response: LinkedinProfileResponse): void {
    const errors = validateSync(response);
    if (errors.length > 0) {
      console.log(JSON.stringify(response.mac, null, 2));
      logger.error(`[LinkedinProfileResponseMapper] MAC Validation failed: ${JSON.stringify(errors)}`, { errors, response });
      const formattedErrors = ValidationUtilities.formatErrors(errors);
      throw new Error(`[LinkedinProfileResponseMapper] MAC Validation failed: ${JSON.stringify(formattedErrors)}`);
    }
  }
}
