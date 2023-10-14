/** @group Models */
export type ProfileJsonMetadata<Uri = string> = {
  appId?: string;
  profileId?: string;

  image?: Uri;
  imageCover?: Uri;

  bio?: string;

  [key: string]: unknown;
};
