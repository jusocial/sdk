export type ProcessorJsonMetadata = {
  title?: string;
  description?: string;

  code?: string;

  [key: string]: unknown;
};

export type AppJsonMetadata<Uri = string> = {
  appId?: string;

  title?: string;
  description?: string;

  image?: Uri;
  imageCover?: Uri;


  team?: {
    title?: string;
    description?: string;
    image?: Uri;

    teamMember?: JsonMetadataTeamMember<Uri>[];

    [key: string]: unknown;
  };

  links?: JsonMetadataContacts & {
    docs?: string;
  }


  [key: string]: unknown;
};

export type ProfileJsonMetadata<Uri = string> = {
  appId?: string;
  profileId?: string;

  image?: Uri;
  imageCover?: Uri;

  bio?: string;

  status?: string;

  details?: {
    basic?: JsonMetadataProfileBasicDetails,
    physical?: JsonMetadataProfilePhysicalDetails,
    personality?: JsonMetadataProfilePersonalityDetails,

    employment?:JsonMetadataProfileEmploymentItem[],
    education?:JsonMetadataProfileEducationItem[],

    [key: string]: unknown;
  }

  [key: string]: unknown;
};

export type SubspaceJsonMetadata<Uri = string> = {
  appId?: string;

  title?: string;
  description?: string;

  image?: Uri;
  imageCover?: Uri;

  type?: JsonMetadataSubspaceType;

  team?: {
    title?: string;
    description?: string;
    image?: Uri;

    teamMember?: JsonMetadataTeamMember<Uri>[];

    [key: string]: unknown;
  };

  contacts?: JsonMetadataContacts;

  [key: string]: unknown;
};


export type PublicationJsonMetadata<Uri = string> = {
  appId?: string;

  title?: string;

  description?: string;
  intro?: string,

  content?: JsonMetadataPublicationContent;

  attachments?: JsonMetadataAttachment<Uri>[];

  tags?: string[];

  [key: string]: unknown;
};

export type JsonMetadataProfileBasicDetails = {
  nickname?: string;
  nationality?: string;
  ethnicity: string;
  socialClass?: 'upper class' | 'middle class' | 'lower class' | 'other';
  religion?: 'christianity' | 'islam' | 'hinduism' | 'buddhism' | 'judaism' | 'atheist' | 'other';
  sexuality?: 'heterosexual' | 'homosexual' | 'bisexual' | 'pansexual' | 'asexual' | 'demisexual' | 'queer' | 'questioning' | 'other';
  education?: 'high school' | 'college' | 'university' | 'postgraduate' | 'other';
  politicalViews?: 'conservative' | 'liberal' | 'moderate' | 'anarchist' | 'socialist' | 'fascist' | 'other';

  [key: string]: unknown;
}

export type JsonMetadataProfilePhysicalDetails =  {
  height?: 'short' | 'average' | 'tall';
  shape?: 'slim' | 'athletic' | 'curvy' | 'muscular' | 'heavyset' | 'other';
  hair?: 'black' | 'brown' | 'blonde' | 'red' | 'gray' | 'other';
  eyes?: 'brown' | 'blue' | 'green' | 'hazel' | 'gray' | 'other';
  glassesLenses?: 'glasses' | 'lenses' | 'none';
  additionalDescription?: string;

  [key: string]: unknown;
}

export type JsonMetadataProfilePersonalityDetails =  {
  positiveCharacteristics: string[];
  negativeCharacteristics: string[];

  moral?: 'always' | 'sometimes' | 'never';
  stable?: 'always' | 'sometimes' | 'never';
  loyal?: 'always' | 'sometimes' | 'never';
  generous?: 'always' | 'sometimes' | 'never';
  extravert?: 'always' | 'sometimes' | 'never';
  compassionate?: 'always' | 'sometimes' | 'never';
  iq?: number;
  hobbies?: string[];
  phobias?: string[];
  favoriteFoods: string[];

  [key: string]: unknown;
}

export type JsonMetadataProfileEmploymentItem = {
  fromYear?: number;
  toYear?: number;
  company?: string;
  position?: string;

  [key: string]: unknown;
}

export type JsonMetadataProfileEducationItem = {
  fromYear?: number;
  toYear?: number;
  school?: string;
  degree?: string;
  fieldOfStudy?: string;

  [key: string]: unknown;
};

export type JsonMetadataTeamMember<Uri> = {
  title?: string;
  role?: string;
  description?: string;
  image?: Uri;
  personalContacts?: JsonMetadataContacts;

  [key: string]: unknown;
};

export type JsonMetadataContacts = {
  website?: string;
  discord?: string;
  telegram?: string;
  twitter?: string;
  facebook?: string;
  email?: string;

  [key: string]: unknown;
};

export type JsonMetadataSubspaceType =
  'community'
  | 'group'
  | 'event'
  | 'project'
  | 'organization'
  | 'club'
  | 'team'
  | 'forum'
  | 'network'
  | 'space'
  | string;


/** @group Models */
export type JsonMetadataEvent = {
  title?: string;
  description?: string;
  datetime?: number;
  datetimeString?: string;
  location?: JsonMetadataLocation;
  participantsLimit?: number;

  [key: string]: unknown;
}

export type JsonMetadataLocation = {
  description: string;
  address?: string;
  latitude: string;
  longitude: string;
  countryCode: number;
  cityCode: number;

  [key: string]: unknown;
}

export type JsonMetadataAttachmentType =
  | 'image'
  | 'video'
  | 'audio'
  | 'document'            // For documents (PDF, Word, etc.)
  | 'link'
  | 'code'                // For code snippets or programming content
  | 'archive'             // For compressed archives (ZIP, RAR, etc.)    // For event data (date, time, location, etc.)             
  | string;               // For any other types not covered by the above

export type JsonMetadataAttachment<Uri> = {
  type?: JsonMetadataAttachmentType;
  description?: string;

  thumbnail?: Uri;
  uri?: Uri;

  location?: JsonMetadataLocation;
  event?: JsonMetadataEvent;

  [key: string]: unknown;
};

export type JsonMetadataPublicationContent = {
  type?: 'plainText' | 'html' | 'markdown';
  value?: string;

  [key: string]: unknown;
}

