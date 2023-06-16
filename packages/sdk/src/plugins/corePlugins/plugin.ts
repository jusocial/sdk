import type { Ju } from '../../Ju';

// Low-level modules.
import { identityModule } from '../identityModule';
import { storageModule } from '../storageModule';
import { rpcModule } from '../rpcModule';
import { operationModule } from '../operationModule';
import { programModule } from '../programModule';
import { utilsModule } from '../utilsModule';

// Default drivers.
import { guestIdentity } from '../guestIdentity';
import { bundlrStorage } from '../bundlrStorage';

// Verticals.
import { systemModule } from '../systemModule';
import { coreModule } from '../coreModule';

export const corePlugins = () => ({
  install(ju: Ju) {
    // Low-level modules.
    ju.use(identityModule());
    ju.use(storageModule());
    ju.use(rpcModule());
    ju.use(operationModule());
    ju.use(programModule());
    ju.use(utilsModule());

    // Default drivers.
    ju.use(guestIdentity());
    ju.use(bundlrStorage());

    // Verticals.
    ju.use(systemModule());
    ju.use(coreModule());
    // ju.use(tokenModule());
  },
});
