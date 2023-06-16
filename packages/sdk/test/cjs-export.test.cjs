const { test } = require('tape');
const { Connection } = require('@solana/web3.js');
const { LOCALHOST } = require('@metaplex-foundation/amman-client');
const exported = require('../dist/cjs/index.cjs');

test('[cjs] it successfully exports commonjs named exports', (t) => {
  const exportedKeys = Object.keys(exported);

  t.ok(exportedKeys.includes('Ju'));
  t.end();
});

test('[cjs] it can import the Bundlr client', async (t) => {
  const { BundlrStorageDriver, Ju } = exported;
  const connection = new Connection(LOCALHOST);
  const ju = new Ju(connection);
  const bundlrDriver = new BundlrStorageDriver(ju);
  const bundlr = await bundlrDriver.bundlr();
  t.ok(typeof bundlr === 'object', 'Bundlr is an object');
  t.ok('uploader' in bundlr, 'Bundlr can upload');
  t.ok('getLoadedBalance' in bundlr, 'Bundlr can get the loaded balance');
  t.ok('fund' in bundlr, 'Bundlr can fund');
  t.ok('withdrawBalance' in bundlr, 'Bundlr can withdraw');
  t.end();
});

test('[cjs] it can import Merkle helpers', async (t) => {
  const { getMerkleRoot, getMerkleProof } = exported;
  const data = ['a', 'b', 'c', 'd', 'e'];
  const merkleRoot = getMerkleRoot(data);
  const merkleProof = getMerkleProof(data, 'a');
  t.ok(typeof merkleRoot === 'object', 'Merkle Root is an object');
  t.ok(Array.isArray(merkleProof), 'Merkle Proof is an array');
  t.end();
});
