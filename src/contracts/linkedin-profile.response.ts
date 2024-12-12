import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested
} from 'class-validator';

export class LinkedinProfileResponseMacSettings {
  @IsString()
  @IsIn(['EN', 'ES'])
  public language!: 'ES' | 'EN';
}

export class LinkedinProfileResponseMacPerson {
  @IsString()
  public name: string = '';

  @IsString()
  public surnames: string = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  public title!: string;

  @IsString()
  @IsOptional()
  public description?: string;
}

export class LinkedinProfileResponseMacExperienceJobChallenge {
  @IsString()
  public description!: string;
}

export class LinkedinProfileResponseMacJobRole {
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @IsDateString()
  public startDate!: string;

  @IsDateString()
  @IsOptional()
  public finishDate?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LinkedinProfileResponseMacExperienceJobChallenge)
  public challenges?: LinkedinProfileResponseMacExperienceJobChallenge[];
}

export class LinkedinProfileResponseMacPublicEntity {
  @IsString()
  @IsNotEmpty()
  public name!: string;
}
export class LinkedinProfileResponseMacJob {
  @IsObject()
  @ValidateNested()
  @Type(() => LinkedinProfileResponseMacPublicEntity)
  public organization!: LinkedinProfileResponseMacPublicEntity;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => LinkedinProfileResponseMacJobRole)
  public roles!: LinkedinProfileResponseMacJobRole[];
}
export class LinkedinProfileResponseMacExperience {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LinkedinProfileResponseMacJob)
  public jobs?: LinkedinProfileResponseMacJob[];
}

export class LinkedinProfileResponseMacAboutMe {
  @IsObject()
  @ValidateNested()
  @Type(() => LinkedinProfileResponseMacPerson)
  public profile!: LinkedinProfileResponseMacPerson;

  public constructor() {
    this.profile = new LinkedinProfileResponseMacPerson();
  }
}

export class LinkedinProfileResponseMacCompetence {
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @IsString()
  @IsIn(['tool', 'technology', 'practice', 'hardware', 'domain'])
  public type!: 'tool' | 'technology' | 'practice' | 'hardware' | 'domain';
}

export class LinkedinProfileResponseMacSkill {
  @IsObject()
  @ValidateNested()
  @Type(() => LinkedinProfileResponseMacCompetence)
  @IsOptional()
  public skill?: LinkedinProfileResponseMacCompetence;
}

export class LinkedinProfileResponseMacStudy {
  @IsString()
  @IsIn(['officialDegree', 'certification', 'unaccredited', 'selfTraining'])
  public studyType!: 'officialDegree' | 'certification' | 'unaccredited' | 'selfTraining';

  @IsBoolean()
  public degreeAchieved!: boolean;

  @IsString()
  @IsNotEmpty()
  public name!: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsDateString()
  public startDate!: string;

  @IsDateString()
  @IsOptional()
  public finishDate?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => LinkedinProfileResponseMacPublicEntity)
  @IsOptional()
  public institution?: LinkedinProfileResponseMacPublicEntity;
}

export class LinkedinProfileResponseMacKnowledge {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LinkedinProfileResponseMacSkill)
  public hardSkills?: LinkedinProfileResponseMacSkill[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LinkedinProfileResponseMacStudy)
  public studies?: LinkedinProfileResponseMacStudy[];
}

// -- 👉 main classes

/** 📝 
- Reduced version of MAC (only with current imported Linkedin fields)
- See full version in: https://raw.githubusercontent.com/getmanfred/mac/v0.5/schema/schema.json
*/
export class LinkedinProfileResponseMac {
  @IsString()
  @IsNotEmpty()
  public $schema = 'https://raw.githubusercontent.com/getmanfred/mac/v0.5/schema/schema.json';

  @IsObject()
  @ValidateNested()
  @Type(() => LinkedinProfileResponseMacSettings)
  public settings!: LinkedinProfileResponseMacSettings;

  @IsObject()
  @ValidateNested()
  @Type(() => LinkedinProfileResponseMacAboutMe)
  public aboutMe!: LinkedinProfileResponseMacAboutMe;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => LinkedinProfileResponseMacExperience)
  public experience?: LinkedinProfileResponseMacExperience;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => LinkedinProfileResponseMacKnowledge)
  public knowledge?: LinkedinProfileResponseMacKnowledge;

  public constructor() {
    this.settings = new LinkedinProfileResponseMacSettings();
    this.settings.language = 'EN';
    this.aboutMe = new LinkedinProfileResponseMacAboutMe();
  }
}

export type LinkedinProfileResponseErrorType = 'unknown' | 'account-locked' | 'timeout' | 'expired' | 'invalid-mac' | 'not-found';

export class LinkedinProfileResponse {
  @IsString()
  public importId!: string;

  @IsString()
  public contextId!: string;

  @IsNumber()
  public profileId!: number;

  @IsOptional()
  @IsNumber()
  public timeElapsed?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LinkedinProfileResponseMac)
  public profile?: LinkedinProfileResponseMac;

  @IsOptional()
  @IsIn(['unknown', 'expired', 'invalid-mac', 'not-found', 'account-locked', 'timeout'])
  public errorType?: LinkedinProfileResponseErrorType;

  @IsOptional()
  @IsString()
  public errorMessage?: string;
}
