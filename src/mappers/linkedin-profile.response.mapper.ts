import { validateSync } from 'class-validator';
import { LinkedinProfileRequest } from '../contracts/linkedin-profile.request';
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
import { InvalidMacError } from '../domain/errors/invalid-mac.error';
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
  public static toResponse(linkedinProfile: LinkedinProfile, request: LinkedinProfileRequest, timeElapsed: number): LinkedinProfileResponse {
    const response = new LinkedinProfileResponse();

    response.importId = request.importId;
    response.contextId = request.contextId;
    response.profileId = request.profileId;
    response.timeElapsed = timeElapsed;

    response.profile = this.toMac(linkedinProfile);

    this.validate(response);

    return response;
  }

  public static toErrorResponse(
    errorType: LinkedinProfileResponse['errorType'],
    errorMessage: string,
    request: LinkedinProfileRequest
  ): LinkedinProfileResponse {
    const response = new LinkedinProfileResponse();

    response.importId = request.importId;
    response.contextId = request.contextId;
    response.profileId = request.profileId;

    response.errorType = errorType;
    response.errorMessage = errorMessage;

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
        role.startDate = DateUtilities.toIsoDate(position['Started On']);
        role.finishDate = position['Finished On'] ? DateUtilities.toIsoDate(position['Finished On']) : undefined;

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
      study.startDate = DateUtilities.toIsoDate(educationItem['Start Date']);
      study.finishDate = educationItem['End Date'] ? DateUtilities.toIsoDate(educationItem['End Date']) : undefined;
      study.degreeAchieved = !!educationItem['End Date'];
      study.description = educationItem['Degree Name'] || educationItem['School Name'];
      if (educationItem['School Name']) {
        const institution = new LinkedinProfileResponseMacPublicEntity();
        institution.name = educationItem['School Name'];
        study.institution = institution;
      }
      return study;
    });
    return knowledge;
  }

  private static validate(response: LinkedinProfileResponse): void {
    const errors = validateSync(response);
    if (errors.length > 0) {
      logger.error(`[LinkedinProfileResponseMapper] MAC Validation failed: ${JSON.stringify(errors)}`, { errors, response });
      const formattedErrors = ValidationUtilities.formatErrors(errors);
      throw new InvalidMacError(`[LinkedinProfileResponseMapper] MAC Validation failed: ${JSON.stringify(formattedErrors)}`);
    }
  }
}
