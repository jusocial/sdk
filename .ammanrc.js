const { LOCALHOST, tmpLedgerDir } = require('@metaplex-foundation/amman');
const juCore = require('@ju-protocol/ju-core');
const path = require('path');
const MOCK_STORAGE_ID = 'js-next-sdk';

function localDeployPath(programName) {
  return path.join(__dirname, 'programs', `${programName}.so`);
}

const programs = [
  {
    label: 'Ju Core',
    programId: juCore.PROGRAM_ADDRESS,
    deployPath: localDeployPath('ju_core'),
  }
];

module.exports = {
  validator: {
    killRunningValidators: true,
    programs,
    jsonRpcUrl: LOCALHOST,
    websocketUrl: '',
    commitment: 'confirmed',
    ledgerDir: tmpLedgerDir(),
    resetLedger: true,
    verifyFees: false,
  },
  relay: {
    accountProviders: {
      // ...mplTokenMetadata.accountProviders,
      // ...mplCandyMachine.accountProviders,
      // ...mplAuctionHouse.accountProviders,
      // ...mplCandyMachineCore.accountProviders,
      // ...mplCandyGuard.accountProviders,
    },
  },
  storage: {
    storageId: MOCK_STORAGE_ID,
    clearOnStart: true,
  },
  snapshot: {
    snapshotFolder: path.join(__dirname, 'snapshots'),
  },
};
