export type AppJsonMetadata<Uri = string> = {
  appId?: string;

  name?: string;
  description?: string;

  image?: Uri;
  imageCover?: Uri;

  properties?: {
    team?: Array<{
      title?: string;
      description?: string;
      image?: Uri;
      [key: string]: unknown;
    }>;

    links?: {
      website?: string;
      github?: string;
      docs?: string;
      [key: string]: unknown;
    }

    [key: string]: unknown;
  };

  [key: string]: unknown;
};

export type ProfileJsonMetadata<Uri = string> = {
  appId?: string;
  profileId?: string;

  image?: Uri;
  imageCover?: Uri;

  bio?: string;

  details?: {
    basic?: {
      nickname?: string;
      nationality?: string;
      ethnicity: string;
      socialClass?: 'upper class' | 'middle class' | 'lower class' | 'other';
      religion?: 'christianity' | 'islam' | 'hinduism' | 'buddhism' | 'judaism' | 'atheist' | 'other';
      sexuality?: 'heterosexual' | 'homosexual' | 'bisexual' | 'pansexual' | 'asexual' | 'demisexual' | 'queer' | 'questioning' | 'other';
      education?: 'high school' | 'college' | 'university' | 'postgraduate' | 'other';
      politicalViews?: 'conservative' | 'liberal' | 'moderate' | 'anarchist' | 'socialist' | 'fascist' | 'other';

      [key: string]: unknown;
    },
    physical?: {
      height?: 'short' | 'average' | 'tall';
      shape?: 'slim' | 'athletic' | 'curvy' | 'muscular' | 'heavyset' | 'other';
      hair?: 'black' | 'brown' | 'blonde' | 'red' | 'gray' | 'other';
      eyes?: 'brown' | 'blue' | 'green' | 'hazel' | 'gray' | 'other';
      glassesLenses?: 'glasses' | 'lenses' | 'none';
      additionalDescription?: string;

      [key: string]: unknown;
    },
    personality?: {
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
    },
    employment?:
    {
      fromYear?: number;
      toYear?: number;
      company?: string;
      position?: string;

      [key: string]: unknown;
    }[]
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

  team?: JsonMetadataTeamMember<Uri>[];
  contacts?: JsonMetadataContacts;

  [key: string]: unknown;
};


export type PublicationJsonMetadata<Uri = string> = {
  appId?: string;

  title?: string;

  description?: string;
  intro?: string,

  content?: JsonMetadataContent;

  attachments?: JsonMetadataAttachment<Uri>[];

  [key: string]: unknown;
};



export type JsonMetadataTeamMember<T> = {
  title?: string;
  role?: string;
  description?: string;
  image?: T;
  personalContacts?: JsonMetadataContacts;

  [key: string]: unknown;
};

export type JsonMetadataContacts = {
  website?: string;
  discord?: string;
  telegram?: string;
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

export type JsonMetadataAttachment<T> = {
  type?: JsonMetadataAttachmentType;
  description?: string;

  thumbnail?: T;
  uri?: T;

  location?: JsonMetadataLocation;
  event?: JsonMetadataEvent;

  [key: string]: unknown;
};

export type JsonMetadataContent = {
  type?: 'plainText' | 'html' | 'markdown';
  value?: string;

  [key: string]: unknown;
}

