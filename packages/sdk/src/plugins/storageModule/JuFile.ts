import { Buffer } from 'buffer';
import { getContentType, getExtension, randomStr } from '@/utils';
import { InvalidJsonVariableError } from '@/errors';

export type JuFile = {
  readonly buffer: Buffer;
  readonly fileName: string;
  readonly displayName: string;
  readonly uniqueName: string;
  readonly contentType: string | null;
  readonly extension: string | null;
  readonly tags: JuFileTag[];
};

export type JuFileContent = string | Buffer | Uint8Array | ArrayBuffer;

export type JuFileTag = { name: string; value: string };

export type JuFileOptions = {
  displayName?: string;
  uniqueName?: string;
  contentType?: string;
  extension?: string;
  tags?: { name: string; value: string }[];
};

export const toJuFile = (
  content: JuFileContent,
  fileName: string,
  options: JuFileOptions = {}
): JuFile => ({
  buffer: parseJuFileContent(content),
  fileName,
  displayName: options.displayName ?? fileName,
  uniqueName: options.uniqueName ?? randomStr(),
  contentType: options.contentType ?? getContentType(fileName),
  extension: options.extension ?? getExtension(fileName),
  tags: options.tags ?? [],
});

export const toJuFileFromBrowser = async (
  file: File,
  options: JuFileOptions = {}
): Promise<JuFile> => {
  const buffer = await file.arrayBuffer();

  return toJuFile(buffer, file.name, options);
};

export const toJuFileFromJson = <T extends object = object>(
  json: T,
  fileName = 'inline.json',
  options: JuFileOptions = {}
): JuFile => {
  let jsonString;

  try {
    jsonString = JSON.stringify(json);
  } catch (error) {
    throw new InvalidJsonVariableError(error as Error);
  }

  return toJuFile(jsonString, fileName, options);
};

export const parseJuFileContent = (
  content: JuFileContent
): Buffer => {
  if (content instanceof ArrayBuffer) {
    return Buffer.from(new Uint8Array(content));
  }

  return Buffer.from(content);
};

export const getBytesFromJuFiles = (...files: JuFile[]): number =>
  files.reduce((acc, file) => acc + file.buffer.byteLength, 0);

export const getBrowserFileFromJuFile = (file: JuFile): File =>
  new File([file.buffer as BlobPart], file.fileName);

export const isJuFile = (
  juFile: any
): juFile is JuFile => {
  return (
    juFile != null &&
    typeof juFile === 'object' &&
    'buffer' in juFile &&
    'fileName' in juFile &&
    'displayName' in juFile &&
    'uniqueName' in juFile &&
    'contentType' in juFile &&
    'extension' in juFile &&
    'tags' in juFile
  );
};
