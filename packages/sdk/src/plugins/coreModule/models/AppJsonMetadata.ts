/** @group Models */
export type AppJsonMetadata<Uri = string> = {
  name?: string;
  description?: string;
  logo?: Uri;
  image?: Uri;
  animation_url?: Uri;
  [key: string]: unknown;
};
