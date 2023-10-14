/** @group Models */
export type SubspaceJsonMetadata<Uri = string> = {
  appId?: string;

  title?: string;

  description?: string;

  image?: Uri;
  imageCover?: Uri;
  animation_url?: Uri;

  attributes?: Array<{
    type?: string;
    value?: string;
    [key: string]: unknown;
  }>;

  properties?: {
    team?: Array<{
      title?: string;
      description?: string;
      address?: string;
      [key: string]: unknown;
    }>;

    links?: {
      website?: string,
      [key: string]: unknown;
    }

    [key: string]: unknown;
  };

  [key: string]: unknown;
};
