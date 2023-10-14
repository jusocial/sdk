/** @group Models */
export type JsonMetadataAttachment<T> = {
  type?: string;
  description?: string;
  uri?: T;
  [key: string]: unknown;
};

/** @group Models */
export type PublicationJsonMetadata<Uri = string> = {
  appId?: string;

  title?: string;

  description?: string;

  intro?: string,
  content?: string,

  files?: JsonMetadataAttachment<Uri>[];

  [key: string]: unknown;
};
