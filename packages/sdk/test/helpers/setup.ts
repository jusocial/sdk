import { Commitment, Connection, Keypair } from '@solana/web3.js';
import { LOCALHOST } from '@metaplex-foundation/amman-client';
import { amman } from './amman';
import {
  Ju,
  guestIdentity,
  keypairIdentity,
  mockStorage,
  KeypairSigner,
} from '@/index';

export type JuTestOptions = {
  rpcEndpoint?: string;

  /** The level of commitment desired when querying the blockchain. */
  commitment?: Commitment;
  solsToAirdrop?: number;
};

export const juGuest = (options: JuTestOptions = {}) => {
  const connection = new Connection(options.rpcEndpoint ?? LOCALHOST, {
    commitment: options.commitment ?? 'confirmed',
  });

  return Ju.make(connection).use(guestIdentity()).use(mockStorage());
};

export const ju = async (options: JuTestOptions = {}) => {
  const ju = juGuest(options);
  const wallet = await createWallet(ju, options.solsToAirdrop);

  return ju.use(keypairIdentity(wallet as Keypair));
};

export const createWallet = async (
  ju: Ju,
  solsToAirdrop = 100
): Promise<KeypairSigner> => {
  const wallet = Keypair.generate();
  await amman.airdrop(ju.connection, wallet.publicKey, solsToAirdrop);

  return wallet;
};

export const createApp = async (
  ju: Ju,
  input: {}
) => {
  const { uri } = await ju.storage().uploadMetadata(input ?? {});
  const { app } = await ju.core().app.create(
    {
      appName: 'testApp',
      data: {
        metadataUri: uri,

        profileNameRequired: true,
        profileSurnameRequired: true,
        profileBirthdateRequired: true,
        profileCountryRequired: false,
        profileCityRequired: false,
        profileMetadataUriRequired: true,

        subspaceNameRequired: true,
        subspaceMetadataUriRequired: true,

        profileDeleteAllowed: false,
        subspaceDeleteAllowed: false,
        publicationDeleteAllowed: false,

        profileIndividualProcessorsAllowed: false,
        subspaceIndividualProcessorsAllowed: false,
        publicationIndividualProcessorsAllowed: false,
      },
      externalProcessors: {
        registeringProcessor: null,
        connectingProcessor: null,
        publishingProcessor: null,
        collectingProcessor: null,
        referencingProcessor: null,
      }
    }
  );

  return app;
};
