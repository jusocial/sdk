/** @group Models */
export type AppJsonMetadata<Uri = string> = {
  appId?: string;

  name?: string;
  description?: string;

  image?: Uri;
  imageCover?: Uri;
  animation_url?: Uri;

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
