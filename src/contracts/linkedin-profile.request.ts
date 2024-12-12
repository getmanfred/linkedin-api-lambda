import { IsIn, IsInt, IsNumber, IsString, IsUrl } from 'class-validator';

export class LinkedinProfileRequest {
  @IsString()
  public messageId!: string;

  @IsString()
  public importId!: string;

  @IsString()
  public contextId!: string;

  @IsIn(['local', 'stage', 'pro'])
  public env!: 'local' | 'stage' | 'pro';

  @IsNumber()
  @IsInt()
  public profileId!: number;

  // Profile parameters
  @IsString()
  public linkedinApiToken!: string;

  @IsUrl()
  public linkedinProfileUrl!: string;

  @IsInt()
  public attempt!: number;
}
