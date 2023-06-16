/** @group Models */
export type PublicationJsonMetadata<Uri = string> = {
  title?: string;
  description?: string;
  image?: Uri;
  [key: string]: unknown;
};
