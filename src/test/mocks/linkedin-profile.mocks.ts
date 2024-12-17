import { LinkedinProfileRequest } from '../../contracts/linkedin-profile.request';
import { LinkedinProfileResponse, LinkedinProfileResponseMac } from '../../contracts/linkedin-profile.response';
import { LinkedinProfile } from '../../domain/linkedin-profile';

export const createMockedLinkedinProfileRequest = (customValues: Partial<LinkedinProfileRequest> = {}): LinkedinProfileRequest => {
  const request = new LinkedinProfileRequest();
  request.messageId = customValues.messageId ?? '059f36b4-87a3-44ab-83d2-661975830a7d';
  request.importId = customValues.importId ?? '1';
  request.contextId = customValues.contextId ?? '1234';
  request.env = customValues.env ?? 'local';
  request.profileId = customValues.profileId ?? 356;
  request.linkedinApiToken = customValues.linkedinApiToken ?? 'fake-token';
  request.linkedinProfileUrl = customValues.linkedinProfileUrl ?? 'https://www.linkedin.com/in/username';
  request.attempt = customValues.attempt ?? 1;
  return request;
};

export const createMockedLinkedinProfile = (customValues: Partial<LinkedinProfile> = {}): LinkedinProfile => {
  const profile = new LinkedinProfile();

  profile.profile = customValues.profile ?? {
    'First Name': 'Pedro',
    'Last Name': 'Manfredo',
    Headline: 'Software Engineer @Manfred',
    Summary: 'I like to learn new things every day'
  };

  profile.skills = customValues.skills ?? [{ Name: 'TypeScript' }];

  profile.positions = customValues.positions ?? [
    {
      Title: 'Senior Backend Developer',
      'Company Name': 'Manfred',
      Description: 'Product development implemented in Node, Express, Nest.js, Typescript, Postgres, Kubernetes, AWS: SQS, Lambda, S3...',
      'Started On': 'Mar 2022',
      'Finished On': 'Mar 2026'
    }
  ];

  profile.education = customValues.education ?? [
    {
      'School Name': 'University of A Coruna',
      'Degree Name': 'Computer Engineering',
      'Start Date': '2005',
      'End Date': '2012'
    }
  ];

  return profile;
};

export const createMockedLinkedinProfileEmpty = (): LinkedinProfile => {
  const profile = new LinkedinProfile();
  return profile;
};

export const createMockedLinkedinProfileResponseMac = (customValues: Partial<LinkedinProfileResponseMac> = {}): LinkedinProfileResponseMac => {
  const mac = new LinkedinProfileResponseMac();
  mac.$schema = customValues.$schema ?? 'https://raw.githubusercontent.com/getmanfred/mac/v0.5/schema/schema.json';
  mac.settings = customValues.settings ?? { language: 'EN' };
  mac.aboutMe = customValues.aboutMe ?? {
    profile: {
      name: 'Pedro',
      surnames: 'Manfredo',
      title: 'Software Engineer @Manfred',
      description: 'I like to learn new things every day'
    }
  };
  mac.experience = customValues.experience ?? {};
  mac.knowledge = customValues.knowledge ?? {};
  return mac;
};

export const createMockedLinkedinProfileResponse = (customValues: Partial<LinkedinProfileResponse> = {}): LinkedinProfileResponse => {
  const response = new LinkedinProfileResponse();
  response.importId = customValues.importId ?? '1';
  response.contextId = customValues.contextId ?? '1234';
  response.profileId = customValues.profileId ?? 356;
  response.timeElapsed = customValues.timeElapsed ?? 1000;
  response.profile = customValues.profile ?? createMockedLinkedinProfileResponseMac();
  return response;
};
