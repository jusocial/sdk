/** @group Models */
export type ProfileJsonMetadata<Uri = string> = {
  logo?: Uri;
  image?: Uri;
  avatar?: Uri;
  animation_url?: Uri;
  [key: string]: unknown;
};
