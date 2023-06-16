/** @group Models */
export type SubspaceJsonMetadata<Uri = string> = {
  title?: string;
  description?: string;
  image?: Uri;
  animation_url?: Uri;
  external_url?: Uri;
  attributes?: Array<{
    trait_type?: string;
    value?: string;
    [key: string]: unknown;
  }>;
  properties?: {
    creators?: Array<{
      address?: string;
      share?: number;
      [key: string]: unknown;
    }>;
    files?: Array<{
      type?: string;
      uri?: Uri;
      [key: string]: unknown;
    }>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};
