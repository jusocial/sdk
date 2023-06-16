import { Keypair } from '@solana/web3.js';
import test, { Test } from 'tape';
import { amman, killStuckProcess, ju } from '../../helpers';
import {
  Ju,
  derivedIdentity,
  keypairIdentity,
  KeypairIdentityDriver,
  sol,
  isEqualToAmount,
} from '@/index';

killStuckProcess();

const init = async (
  options: {
    message?: string;
    identityAirdrop?: number;
    derivedAirdrop?: number;
  } = {}
) => {
  const jp = await ju({ solsToAirdrop: options.identityAirdrop });
  jp.use(derivedIdentity());

  if (options.message != null) {
    await jp.derivedIdentity().deriveFrom(options.message);
  }

  if (options.derivedAirdrop != null) {
    await amman.airdrop(
      jp.connection,
      jp.derivedIdentity().publicKey,
      options.derivedAirdrop
    );
  }

  return jp;
};

const getBalances = async (jp: Ju) => {
  const identityBalance = await jp.rpc().getBalance(jp.identity().publicKey);
  const derivedBalance = await jp
    .rpc()
    .getBalance(jp.derivedIdentity().publicKey);

  return { identityBalance, derivedBalance };
};

test('[derivedIdentity] it derives a Keypair from the current identity', async (t: Test) => {
  // Given a Ju instance using the derived identity plugin.
  const jp = await init();

  // When we derive the identity using a message.
  await jp.derivedIdentity().deriveFrom('Hello World');

  // Then we get a Signer Keypair.
  t.ok(jp.derivedIdentity().publicKey, 'derived identity has a public key');
  t.ok(jp.derivedIdentity().secretKey, 'derived identity has a secret key');

  // And it is different from the original identity.
  t.notOk(
    jp.derivedIdentity().equals(jp.identity()),
    'derived identity is different from original identity'
  );
});

test('[derivedIdentity] it keeps track of the identity it originates from', async (t: Test) => {
  // Given a Ju instance using the derived identity plugin.
  const jp = await init();
  const identityPublicKey = jp.identity().publicKey;

  // When we derive the identity.
  await jp.derivedIdentity().deriveFrom('Hello World');

  // Then the derived identity kept track of the identity it originated from.
  t.ok(
    identityPublicKey.equals(jp.derivedIdentity().originalPublicKey),
    'derived identity stores the public key of the identity it originated from'
  );

  // Even if we end up updating the identity.
  jp.use(keypairIdentity(Keypair.generate()));
  t.ok(
    identityPublicKey.equals(jp.derivedIdentity().originalPublicKey),
    'derived identity stores the public key of the identity it originated from even after it changed'
  );
  t.notOk(
    jp.identity().equals(jp.derivedIdentity().originalPublicKey),
    "derived identity's stored identity is different to the new identity"
  );
});

test('[derivedIdentity] it can derive a Keypair from an explicit IdentitySigner', async (t: Test) => {
  // Given a Ju instance and a custom IdentitySigner.
  const jp = await init();
  const signer = new KeypairIdentityDriver(Keypair.generate());

  // When we derive the identity by providing the signer explicitly.
  await jp.derivedIdentity().deriveFrom('Hello World', signer);

  // Then a new derived identity was created for that signer.
  t.ok(
    signer.publicKey.equals(jp.derivedIdentity().originalPublicKey),
    'derived identity stores the public key of the provided signer'
  );

  // But not for the current identity.
  t.notOk(
    jp.identity().equals(jp.derivedIdentity().originalPublicKey),
    'derived identity does not store the public key of the current identity'
  );
});

test('[derivedIdentity] it derives the same address when using the same message', async (t: Test) => {
  // Given a Ju instance using the derived identity plugin.
  const jp = await init();

  // When we derive the identity twice with the same message.
  await jp.derivedIdentity().deriveFrom('Hello World');
  const derivedPublicKeyA = jp.derivedIdentity().publicKey;

  await jp.derivedIdentity().deriveFrom('Hello World');
  const derivedPubliKeyB = jp.derivedIdentity().publicKey;

  // Then we get the same Keypair.
  t.ok(
    derivedPublicKeyA.equals(derivedPubliKeyB),
    'the two derived identities are the same'
  );
});

test('[derivedIdentity] it derives different addresses from different messages', async (t: Test) => {
  // Given a Ju instance using the derived identity plugin.
  const jp = await init();

  // When we derive the identity twice with different messages.
  await jp.derivedIdentity().deriveFrom('Hello World');
  const derivedPublicKeyA = jp.derivedIdentity().publicKey;

  await jp.derivedIdentity().deriveFrom('Hello Papito');
  const derivedPubliKeyB = jp.derivedIdentity().publicKey;

  // Then we get the different Keypairs.
  t.notOk(
    derivedPublicKeyA.equals(derivedPubliKeyB),
    'the two derived identities are different'
  );
});

test('[derivedIdentity] it can fund the derived identity', async (t: Test) => {
  // Given a Ju instance with:
  // - an identity airdropped with 5 SOLs.
  // - a derived identity with no SOLs.
  const jp = await init({ message: 'fund', identityAirdrop: 5 });

  // When we fund the derived identity by 1 SOL.
  await jp.derivedIdentity().fund(sol(1));

  // Then we can see that 1 SOL was transferred from the identity to the derived identity.
  // It's a little less due to the transaction fee.
  const { identityBalance, derivedBalance } = await getBalances(jp);
  t.ok(
    isEqualToAmount(identityBalance, sol(4), sol(0.01)),
    'identity balance is around 4'
  );
  t.ok(isEqualToAmount(derivedBalance, sol(1)), 'derived balance is 1');
});

test('[derivedIdentity] it can withdraw from the derived identity', async (t: Test) => {
  // Given a Ju instance with:
  // - an identity airdropped with 5 SOLs.
  // - a derived identity airdropped with 2 SOLs.
  const jp = await init({
    message: 'withdraw',
    identityAirdrop: 5,
    derivedAirdrop: 2,
  });

  // When we withdraw 1 SOL from the derived identity.
  await jp.derivedIdentity().withdraw(sol(1));

  // Then we can see that 1 SOL was transferred from the derived identity to the identity.
  // It's a little less due to the transaction fee.
  const { identityBalance, derivedBalance } = await getBalances(jp);
  t.ok(isEqualToAmount(identityBalance, sol(6)), 'identity balance is 6');
  t.ok(
    isEqualToAmount(derivedBalance, sol(1), sol(0.01)),
    'derived balance is around 1'
  );
});

test('[derivedIdentity] it can withdraw everything from the derived identity', async (t: Test) => {
  // Given a Ju instance with:
  // - an identity airdropped with 5 SOLs.
  // - a derived identity airdropped with 2 SOLs.
  const jp = await init({
    message: 'withdraw',
    identityAirdrop: 5,
    derivedAirdrop: 2,
  });

  // When we withdraw everything from the derived identity.
  await jp.derivedIdentity().withdrawAll();

  // Then we can see that 1 SOL was transferred from the derived identity to the identity.
  // It's a little less due to the transaction fee.
  const { identityBalance, derivedBalance } = await getBalances(jp);
  t.ok(
    isEqualToAmount(identityBalance, sol(7), sol(0.01)),
    'derived balance is around 7'
  );
  t.ok(isEqualToAmount(derivedBalance, sol(0)), 'derived balance is 0');
});
