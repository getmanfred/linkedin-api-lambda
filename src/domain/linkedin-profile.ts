export class LinkedinProfileProfile {
  public 'First Name'?: string;
  public 'Last Name'?: string;
  public 'Headline'?: string;
  public 'Summary'?: string;
}

export class LinkedinProfileSkill {
  public 'Name'?: string;
}

export class LinkedinProfilePosition {
  public 'Title'?: string;
  public 'Description'?: string;
  public 'Company Name'?: string;
  public 'Started On'?: string;
  public 'Finished On'?: string;
}

export class LinkedinProfileEducation {
  public 'School Name'?: string;
  public 'Degree Name'?: string;
  public 'Start Date'?: string;
  public 'End Date'?: string;
}

// -- 👉 main class
export class LinkedinProfile {
  public profile: LinkedinProfileProfile;
  public skills: LinkedinProfileSkill[];
  public positions: LinkedinProfilePosition[];
  public education: LinkedinProfileEducation[];

  public constructor() {
    this.profile = new LinkedinProfileProfile();
    this.skills = [];
    this.positions = [];
    this.education = [];
  }
}
