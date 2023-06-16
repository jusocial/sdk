import { Connection } from '@solana/web3.js';
import { JuPlugin, Cluster, resolveClusterFromConnection } from '@/types';
import { corePlugins } from '@/plugins/corePlugins';

export type JuOptions = {
  cluster?: Cluster;
};

export class Ju {
  /** The connection object from Solana's SDK. */
  public readonly connection: Connection;

  /** The cluster in which the connection endpoint belongs to. */
  public readonly cluster: Cluster;

  constructor(connection: Connection, options: JuOptions = {}) {
    this.connection = connection;
    this.cluster = options.cluster ?? resolveClusterFromConnection(connection);
    this.use(corePlugins());
  }

  static make(connection: Connection, options: JuOptions = {}) {
    return new this(connection, options);
  }

  use(plugin: JuPlugin) {
    plugin.install(this);

    return this;
  }
}
