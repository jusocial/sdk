/** @group Models */
export type JsonMetadata<Uri = string> = {
  title?: string;
  description?: string;
  image?: Uri;
  [key: string]: unknown;
};
