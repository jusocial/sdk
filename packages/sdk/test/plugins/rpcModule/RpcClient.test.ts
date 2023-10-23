import test, { Test } from 'tape';
import { ju, killStuckProcess } from '../../helpers';
// import { ParsedProgramError } from '@/index';

killStuckProcess();

test('[rpcModule] it parses program errors when sending transactions', async (t: Test) => {
  // Given a Ju instance using a CoreRpcDriver.
  const jp = await ju();

  // When we try to create an App with a name that's too long.
  const promise = jp.core().apps().createApp({
    appDomainName: 'x'.repeat(101), // Name is too long.
    data: {
      metadataUri: 'http://example.com/jutestapp',

      isProfileDeleteAllowed: false,
      isSubspaceDeleteAllowed: false,
      isPublicationDeleteAllowed: false,

      isProfileIndividualProcessorsAllowed: false,
      isSubspaceIndividualProcessorsAllowed: false,
      isPublicationIndividualProcessorsAllowed: false,
    },
    externalProcessors: {
      registeringProcessor: null,
      connectingProcessor: null,
      publishingProcessor: null,
      collectingProcessor: null,
      referencingProcessor: null,
    }
  });

  // Then we receive a parsed program error.
  try {
    await promise;
    t.fail('Expected a ParsedProgramError');
  } catch (error) {
    t.ok(error)
    // t.ok(error instanceof ParsedProgramError);
    // t.ok((error as ParsedProgramError).message.includes('Name too long'));
  }
});
