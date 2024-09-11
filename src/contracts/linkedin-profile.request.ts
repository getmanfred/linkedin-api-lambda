import { IsIn, IsInt, IsNumber, IsString, IsUrl, Min } from 'class-validator';

export class LinkedinProfileRequest {
  @IsString()
  public messageId!: string;

  @IsString()
  public contextId!: string;

  @IsIn(['local', 'stage', 'pro'])
  public env!: 'local' | 'stage' | 'pro';

  @IsNumber()
  @IsInt()
  public profileId!: number;

  @IsString()
  public profileApiToken!: string;

  @IsUrl()
  public linkedinUrl!: string;

  @IsInt()
  @Min(1)
  public attempt!: number;
}
