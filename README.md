# `Ju` SDK

This SDK serves as a comprehensive starting point for developers looking to build social applications with the Ju Protocol. It provides a streamlined API that focuses on common use-cases, ensuring a seamless development experience. Furthermore, the SDK is designed to be extensible through plugins, allowing third-party developers to enhance its functionality

Please note that this SDK has been built from scratch and is actively evolving. As a result, certain aspects of the core API and interfaces may undergo changes in different versions. However, we encourage you to utilize the SDK and provide early feedback if you wish to contribute to the future direction of this project.

## Installation
```sh
npm install @ju-social/sdk @solana/web3.js
```

🔥 **Pro Tip**: Check out our examples and starter kits on the ["JS Examples" repository](https://github.com/ju-social/sdk-examples).

## Setup
The SDK is initiated through a `Ju` instance, which serves as the entry point for accessing its API.

To establish communication with the cluster, the Ju instance requires a Connection instance from @solana/web3.js. This connection object enables seamless interaction with the underlying Solana blockchain network.

```ts
import { Ju } from "@ju-social/sdk";
import { Connection, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"));
const ju = new Ju(connection);
```

Additionally, the SDK allows for customization of the entity it interacts with on behalf of and the choice of a storage provider for uploading metadata assets. These customizable components are known as "Identity Drivers" and "Storage Drivers" respectively.

To modify these drivers, you can use the use method on the Ju instance. This enables you to configure the SDK according to your specific requirements. In the subsequent sections, we will explore the available drivers in greater detail.

```ts
import { Ju, keypairIdentity, bundlrStorage } from "@ju-social/sdk";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"));
const wallet = Keypair.generate();

const ju = Ju.make(connection)
    .use(keypairIdentity(wallet))
    .use(bundlrStorage());
```

You may have observed that instead of using new Ju(...) to create a Ju instance, you have the option to utilize Ju.make(...) to enhance the readability of the fluent API. This alternative syntax allows for a more expressive and concise way of working with the SDK.

## SDK Usage
Once you have appropriately configured the Ju instance, you can utilize it to access modules that offer various sets of features. Presently, there is a single documented Core client module accessible through the core() method. This module allows you to interact with Ju's core protocol instructions.

To illustrate, here is an example of how you can retrieve a Profile using its address.

```ts
const profileAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const profile = await ju.core().profiles.getProfile(profileAddress);
```

You may pass an `AbortSignal` to second argument to cancel the operation before it finishes — similarly to how you would cancel an HTTP request.

```ts
const profileAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

// Create an AbortController that aborts in 100ms.
const abortController = new AbortController();
setTimeout(() => abortController.abort(), 100);

// Pass the AbortController's signal to the operation.
const profile = await ju.core().profile.get(
    profileAddress, 
    { signal: abortController.signal }
);
```

Now, before we proceed to the identity and storage drivers, let's delve a bit deeper into the Core module to gain a better understanding of its functionality.

# Core module

The Core module can be accessed via `ju.core()` and provides the following clients:
- [`utils`](#common-client)
- [`apps`](#app-client)
- [`profiles`](#profile-client)
- [`subspaces`](#subspace-client)
- [`publications`](#publication-client)
- [`connections`](#connection-client)
- [`reactions`](#reaction-client)
- [`reports`](#report-client)

## `Utils` client
The Common client can be accessed via `ju.core().common` and provides the following methods:
- [`search`](#search)
- [`findAliasByValue`](#findAliasByValue)
- [`findEntityByAliasValue`](#findEntityByAliasValue)

## `App` client
The App client can be accessed via `ju.core().app` and provides the following methods:
- [`getApp`](#getApp)
- [`createApp`](#createApp)
- [`updateApp`](#updateApp)
- [`findApps`](#findApps)
- [`findAppsAsKeys`](#findAppsAsKeys)
- [`getAppsByKeyList`](#getAppsByKeyList)

## `Profile` client
The Profile client can be accessed via `ju.core().profile` and provides the following methods:
- [`getProfile`](#getProfile)
- [`createProfile`](#createProfile)
- [`updateProfile`](#updateProfile)
- [`deleteProfile`](#deleteProfile)
- [`findProfiles`](#findProfiles)
- [`findProfilesAsKeys`](#findProfilesAsKeys)
- [`findProfilesAsKeysByConnectionTarget`](#findProfilesAsKeysByConnectionTarget)
- [`findProfilesAsKeysByConnectionInitializer`](#findProfilesAsKeysByConnectionInitializer)
- [`getProfilesByKeyList`](#getProfilesByKeyList)

## `Subspace` client
The Subspace client can be accessed via `ju.core().subspace` and provides the following methods:
- [`getSubspace`](#getSubspace)
- [`createSubspace`](#createSubspace)
- [`updateSubspace`](#updateSubspace)
- [`deleteSubspace`](#deleteSubspace)

## `Publication` client
The Publication client can be accessed via `ju.core().publication` and provides the following methods:
- [`getPublication`](#getPublication)
- [`createPublication`](#createPublication)
- [`updatePublication`](#updatePublication)
- [`deletePublication`](#deletePublication)
- [`collectPublication`](#collectPublication)
- [`findPublications`](#findPublications)
- [`findPublicationsAsKeys`](#findPublicationsAsKeys)
- [`getPublicationsByKeyList`](#getPublicationsByKeyList)

## `Connection` client
The Connection client can be accessed via `ju.core().connection` and provides the following methods:
- [`createConnection`](#createConnection)
- [`updateConnection`](#updateConnection)
- [`deleteConnection`](#deleteConnection)
- [`findConnections`](#findConnections)
- [`findConnectionsAsKeys`](#findConnectionsAsKeys)
- [`getConnectionsByKeyList`](#getConnectionsByKeyList)
- [`isConnectionExist`](#isConnectionExist)

## `Reaction` client
The Reaction client can be accessed via `ju.core().reaction` and provides the following methods:
- [`createReaction`](#createReaction)
- [`deleteReaction`](#deleteReaction)
- [`findReactions`](#keysByFilterReaction)
- [`findReactionsAsKeys`](#findByKeyListReaction)
- [`getReactionsByKeyList`](#getReactionsByKeyList)

## `Report` client
The Report client can be accessed via `ju.core().report` and provides the following methods:
- [`createReport`](#createReport)
- [`findReports`](#keysByFilterReport)
- [`findReportsAsKeys`](#findByKeyListReport)
- [`getReportsByKeyList`](#getReportsByKeyList)



# `Core Utils client` methods
Detailed description of the Core Utils client methods.

- [The `SearchResultItem` object](#SearchResultItem)

## `search`

Finds entities by given request string.

The `search` method accepts an `app` as public key and returns a [`SearchResultItem`](#SearchResultItem) object.


```ts
const app = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");
const requestString = 'something';

const result = await ju.core().utils().search(
    app,
    requestString 
);
```

## `findAliasByValue`

Finds Alias instance by given alias string

The `findAliasByValue` method accepts an `app` as public key and `alias` as string and returns an [`Alias`](#Alias) model or `null` if nothing was finded.

```ts
const app = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");
const alias = 'johndoe';

const result = await ju.core().utils().findAliasByValue(
    app,
    alias 
);
```

## `findEntityByAliasValue`

Finds Profile or Subspace instance by given alias string.

The `findEntityByAliasValue` method accepts an `app` as public key and `alias` as string and returns a [`Profile`](#Profile) model or [`Subspace`](#Subspace) model.

```ts
const app = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");
const alias = 'johndoe';

const result = await ju.core().utils().findEntityByAliasValue(
    app,
    alias 
);
```

# `App client` methods
Detailed description of the App client methods.

The following model, either returned or used by the above methods.

- The [`App` model](#the-app-model)

## `getApp`

Gets the App instance by given App address.

The `getApp` method accepts an `app` as public key and returns an [`App` model](#App) instance.


```ts
const appAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const app = await ju.core().apps().getApp(appAddress);
```

The returned `App` object will have its JSON metadata already loaded so you can, for instance, access its image URL like so (provided it is present in the downloaded metadata).

```ts
const imageUrl = app.metadata.image;
```

You can [read more about the `App` model below](#App).

## `createApp`

Creates the App instance with given data.

The `createApp` method accepts a [`CreateAppInput`](#CreateAppInput) object and returns an [`App` model](#App) instance.


```ts
const { app } = await ju.core().apps().create(
    { 
        appDomainName: 'testApp',
        data: {
            // ...restData
        },
        externalProcessors: {
            // ...restData
        }
    }
);
```

## `updateApp`

Update the existing App data.

The `updateApp` method accepts an [`App`](#App) instance and `app data` object to update current values.


```ts
const appAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const app = await ju.core().apps.getApp(appAddress);

const result = await ju.core().app.update(
    app,
    { 
        metadataUri: 'https://example.com/updated-uri'
    }
);
```

## `findApps`

Finds Apps by given number of filters.

The `findProfiles` method accepts [`FindAppsInput`](#FindAppsInput) type and returns[`App` array](#App) as a result.


```ts
const authority = new PublicKey("BTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeA");

const subspaces = await ju.core().apps.findApps(
    {
        authority
    }
);
```

## `findAppsAsKeys`

Finds pubkeys of Apps by given number of filters.

The `findAppsAsKeys` is similar to `findApps`, but returns only PublicKey array of finded Apps. Method accepts [`FindAppsAsKeysInput`](#FindAppsAsKeysInput) type and returns[`PublicKey` array](#App) as a result.


```ts
const authority = new PublicKey("BTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeA");

const app = await ju.core().apps().findAppsAsKeys(
    {
        authority
    }
);
```

## `getAppsByKeyList`

Finds Apps by given array of prefetched PublicKey(s).

The `getAppsByKeyList` is similar to `findAppsByKeyList`, but returns only PublicKey array of finded Apps. Method accepts [`FindAppsByKeyListInput`](#FindAppsByKeyListInput) type and returns[`App` array](#App) as a result.


```ts
const apps: App[] = await ju.core().apps().findAppsAsKeys(
    [
        // ...appsPubkeys
    ]
);
``


# `Profile client` methods
Detailed description of the Profile client methods.

## `getProfile`

Gets the Profile instance by given profile address (public key).

The `getProfile` method accepts an `address` as public key and returns a [`Profile` model](#Profile) instance.


```ts
const profileAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const profile = await ju.core().profiles.getProfile(profileAddress);
```

The returned `Profile` object will have its JSON metadata already loaded so you can, for instance, access its image URL like so (provided it is present in the downloaded metadata).

```ts
const imageUrl = profile.metadata.image;
```

You can [read more about the `Profile` model below](#Profile).

## `createProfile`

Creates new Profile with given data.

The `createProfile` method accepts a [`CreateProfileInput`](#CreateProfileInput) object and returns a [`Profile` model](#Profile) instance.


```ts
const appAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const { profile } = await ju.core().profiles().createProfile(
    { 
        // ..data
    }
);
```

## `updateProfile`

Update the existing Profile data.

The `updateProfile` method accepts a [`Profile`](#Profile) instance and `profile data` object to update current values.


```ts
const profileAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const profile = await ju.core().profiles().getProfile(profileAddress);

const result = await ju.core().profile().updateProfile(
    profile,
    { 
        firstName: 'Alice',
        lastName: 'Smith'
        // ...restData
    }
);
```

## `deleteProfile`

Delete the existing Profile.

The `deleteProfile` method accepts a [`Profile`](#Profile) instance and returns a [`SendAndConfirmTransactionResponse`](#SendAndConfirmTransactionResponse) as a result.


```ts
const profileAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const result = await ju.core().profile().deleteProfile(profile);
```

## `findProfiles`

Finds Profiles by given number of filters.

The `findProfiles` method accepts a omitted by `app` [`FindProfilesInput`](#FindProfilesInput) type and returns[`Profiles` array](#Profile) as a result.


```ts
const app = new PublicKey("BTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeA");

const subspaces = await ju.core().profiles(app).findProfiles(
    {
        app,
    }
);
```

## `findProfilesAsKeys`

Finds pubkeys of Profiles by given number of filters.

The `findProfilesAsKeys` is similar to `findProfiles`, but returns only PublicKey array of finded Profiles. Method accepts a omitted by `app` [`FindProfilesAsKeysInput`](#FindProfilesAsKeysInput) type and returns[`PublicKey` array](#Profile) as a result.


```ts
const app = new PublicKey("BTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeA");

const subspaces = await ju.core().profiles(app).findProfilesAsKeys(
    {
        app,
    }
);
```

## `getProfilesByKeyList`

Finds Profiles by given array of prefetched PublicKey(s).

The `getProfilesByKeyList` is similar to `findProfilesByKeyList`, but returns only PublicKey array of finded Profiles. Method accepts a omitted by `app` [`FindProfilesByKeyListInput`](#FindProfilesByKeyListInput) type and returns[`Profiles` array](#Profile) as a result.


```ts
const app = new PublicKey("BTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeA");

const profiles: Profile[] = await ju.core().profiles(app).findSubspacesAsKeys(
    [
        // ...profilesPubkeys
    ]
);
``



# `Subspace client` methods
Detailed description of the Subspace client methods.

## `getSubspace`

Get the Subspace instance by subspace address (public key).

The `getSubspace` method accepts an `address` as public key and returns a [`Subspace` model](#Subspace) instance.


```ts
const subspaceAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const { subspace } = await ju.core().subspaces().getSubspace(subspaceAddress);
```

The returned `Subspace` object will have its JSON metadata already loaded so you can, for instance, access its image URL like so (provided it is present in the downloaded metadata).

```ts
const imageUrl = subspace.metadata.image;
```

You can [read more about the `Subspace` model below](#Subspace).

## `createSubspace`

Creates new Subspace with given data.

The `Subspace` method accepts a [`CreateSubspaceInput`](#CreateSubspaceInput) object and returns and [`Subspace` model](#Subspace) instance.


```ts
const appAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const { subspace } = await ju.core().subspaces().Subspace(
    { 
        // ...data
    }
);
```

## `updateSubspace`

Update the existing Subspace data.

The `updateSubspace` method accepts a [`Subspace`](#Subspace) instance and `subspace data` object to update current values.


```ts
const subspaceAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const subspace = await ju.core().subspaces().getSubspace(subspaceAddress);

const result = await ju.core().subspaces().updateSubspace(
    subspace,
    { 
        name: 'NuclearBlock',
        // ...restData
    }
);
```

## `deleteSubspace`

Delete the existing Subspace.

The `updateSubspace` method accepts a [`Subspace`](#Subspace) instance and returns a [`SendAndConfirmTransactionResponse`](#SendAndConfirmTransactionResponse) as a result.


```ts
const subspaceAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const result = await ju.core().subspace.delete(subspaceAddress);
```

## `findSubspaces`

Finds Subspaces by given number of filters.

The `findSubspaces` method accepts a omitted by `app` [`FindSubspacesInput`](#FindSubspacesInput) type and returns[`Subspaces` array](#Subspaces) as a result.


```ts
const profileAddress = new PublicKey("BTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeA");

const subspaces = await ju.core().subspaces().findSubspaces(
    {
        creator: profileAddress,
    }
);
```

## `findSubspacesAsKeys`

Finds pubkeys of Subspaces by given number of filters.

The `findSubspacesAsKeys` is similar to `findSubspacesAsKeys`, but returns only PublicKey array of finded Subspaces. Method accepts a omitted by `app` [`FindSubspacesAsKeysInput`](#FindSubspacesAsKeysInput) type and returns[`PublicKey` array](#Subspaces) as a result.


```ts
const profileAddress = new PublicKey("BTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeA");

const subspaces = await ju.core().subspaces().findSubspacesAsKeys(
    {
        creator: profileAddress,
    }
);
```

## `getSubspacesByKeyList`

Finds Subspaces by given array of prefetched PublicKey(s).

The `getSubspacesByKeyList` is similar to `findSubspacesByKeyList`, but returns only PublicKey array of finded Subspaces. Method accepts a omitted by `app` [`FindSubspacesByKeyListInput`](#FindSubspacesByKeyListInput) type and returns[`Subspaces` array](#Connection) as a result.


```ts
const profileAddress = new PublicKey("BTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeA");

const subspaces: Subspace[] = await ju.core().subspaces().findSubspacesAsKeys(
    [
        // ...subspacesPubkeys
    ]
);
```


# `Publication client` methods
Detailed description of the Publication client methods.

## `getPublication`

Gets the Publication instance by publication address (public key).

The `getPublication` method accepts an `address` as public key and returns a [`Publication` model](#Publication) instance.


```ts
const publicationAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const { publication } = await ju.core().publications().getPublication(
    publicationAddress,
    loadJsonMetadata // Whether or not retrieve external Json Metadata (default `true`)
    );
```

The returned `Publication` object will have its JSON metadata already loaded so you can, for instance, access its image URL like so (provided it is present in the downloaded metadata).

```ts
const imageUrl = publication.metadata.image;
```

You can [read more about the `Publication` model below](#Publication).

## `createPublication`

Creates new Publication with given data.

The `createPublication` method accepts a [`CreatePublicationInput`](#CreatePublicationInput) object and returns and [`Publication` model](#Publication) instance.


```ts
const publicationAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const { publication } = await ju.core().publications().createPublication(
    { 
        // ..data
    }
);
```

## `updatePublication`

Update the existing Publication data.

The `updatePublication` method accepts a [`Publication`](#Publication) instance and `publication data` object to update current values.


```ts
const publicationAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const publication = await ju.core().publications().getPublication(publicationAddress);

const result = await ju.core().publication.update(
    publication,
    { 
        // ...data
    }
);
```

## `collectPublication`

Collect the given Publication.

The `collectPublication` method accepts a publickey of collecting Publication and additional data `externalProcessingData` that might be passed to external processor for extra validating


```ts
const publicationAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const response = await ju.core().publications().collectPublication(publicationAddress);

```

## `deletePublication`

Delete the existing Publication.

The `delete` method accepts a [`Publication`](#Publication) instance and returns a [`SendAndConfirmTransactionResponse`](#SendAndConfirmTransactionResponse) as a result.


```ts
const publicationAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const result = await ju.core().publication.delete(publicationAddress);
```

## `findPublications`

Finds Publications by given number of filters.

The `findPublications` method accepts a omitted by `app` [`FindPublicationsInput`](#FindPublicationsInput) type and returns[`Publications` array](#Publications) as a result.


```ts
const profileAddress = new PublicKey("BTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeA");

const publications = await ju.core().publications().findPublications(
    {
        profile: profileAddress,
    }
);
```

## `findPublicationsAsKeys`

Finds pubkeys of Publications by given number of filters.

The `findPublicationsAsKeys` is similar to `findConnectionsAsKeys`, but returns only PublicKey array of finded Connections. Method accepts a omitted by `app` [`FindConnectionsAsKeysInput`](#FindConnectionsAsKeysInput) type and returns[`PublicKey` array](#Connection) as a result.


```ts
const profileAddress = new PublicKey("BTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeA");

const publications = await ju.core().publications().findPublicationsAsKeys(
    {
        profile: profileAddress,
    }
);
```

## `getPublicationsByKeyList`

Finds Publications by given array of prefetched PublicKey(s).

The `getPublicationsByKeyList` is similar to `findPublicationsByKeyList`, but returns only PublicKey array of finded Publications. Method accepts a omitted by `app` [`FindPublicationsByKeyListInput`](#FindPublicationsByKeyListInput) type and returns[`Publications` array](#Connection) as a result.


```ts
const profileAddress = new PublicKey("BTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeA");

const publications: Connection[] = await ju.core().publications().findPublicationsAsKeys(
    [
        // ...connectionPubkeys
    ]
);
```



# `Connection client` methods

Detailed description of the Connection client methods.

You can [read more about the `Connection` model below](#Connection).

## `createConnection`

Creates new Connection with diven data.

The `createConnection` method accepts a `target` as a variant of  [`Profile`](#Profile) or [`Subspace`](#Subspace) instance and optional `externalProcessingData` as string and returns[`SendAndConfirmTransactionResponse` object](#SendAndConfirmTransactionResponse) as a result.


```ts
const appAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const targetProfileAddress = new PublicKey("YTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeG");

// Optional string to pass into external Connecting processor
const externalProcessingData = 'some-validation-string';

// Create connection with given Profile
const response = await ju.core().connections().createConnection(
    targetProfileAddress,
    externalProcessingData
);

```

## `updateConnection`

Update existing Connection (actually approve).

The `updateConnection` method accepts a `initializer` as public key, `target` as public key, `approveStatus` as boolean and returns[`SendAndConfirmTransactionResponse` object](#SendAndConfirmTransactionResponse) as a result.


```ts
const appAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const initializerProfileAddress = new PublicKey("YTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeG");

const targetSubspaceAddress = new PublicKey("BTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeA");

const result = await ju.core().connections().updateConnection(
    initializerProfile,
    targetSubspaceAddress,
    true
);
```

## `deleteConnection`

Delete existing Connection.

The `deleteConnection` method accepts a `target` as public key and returns[`SendAndConfirmTransactionResponse` object](#SendAndConfirmTransactionResponse) as a result.


```ts
const profileAddress = new PublicKey("BTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeA");

const result = await ju.core().connections().deleteConnection(profileAddress);
```

## `findConnections`

Finds connections by given number of filters.

The `findConnections` method accepts a omitted by `app` [`FindConnectionsInput`](#FindConnectionsInput) type and returns[`Connection` array](#Connection) as a result.


```ts
const profileAddress = new PublicKey("BTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeA");

const connections = await ju.core().connections().findConnections(
    {
        initializer: profileAddress,
        isApproved: true,
        isToday: true,
    }
);
```

## `findConnectionsAsKeys`

Finds pubkeys of Connections by given number of filters.

The `findConnectionsAsKeys` is similar to `findConnectionsAsKeys`, but returns only PublicKey array of finded Connections. Method accepts a omitted by `app` [`FindConnectionsAsKeysInput`](#FindConnectionsAsKeysInput) type and returns[`PublicKey` array](#Connection) as a result.


```ts
const profileAddress = new PublicKey("BTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeA");

const connections = await ju.core().connections().findConnectionsAsKeys(
    {
        initializer: profileAddress,
        isApproved: true,
        isToday: true,
    }
);
```

## `getConnectionsByKeyList`

Finds Connections by given array of prefetched PublicKey(s).

The `getConnectionsByKeyList` is similar to `findConnectionsByKeyList`, but returns only PublicKey array of finded Connections. Method accepts a omitted by `app` [`FindConnectionsByKeyListInput`](#FindConnectionsByKeyListInput) type and returns[`Connection` array](#Connection) as a result.


```ts
const profileAddress = new PublicKey("BTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeA");

const connections: Connection[] = await ju.core().connections().findConnectionsAsKeys(
    [
        // ...connectionPubkeys
    ]
);
```


# `Reaction client` methods

Detailed description of the Reaction client methods.

You can [read more about the `Reaction` model below](#Reaction).

## `createReaction`

Creates new Reaction to given `target` Publication.

The `create` method accepts a `target` as PublicKey and `reactionType` as [`ReactionType`] (#ReactionType) enum variant and returns [`SendAndConfirmTransactionResponse`](#SendAndConfirmTransactionResponse) object as a result.


```ts
const targetPublicationAddress = new PublicKey("YTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeG");

const result = await ju.core().reactions().createReactions(
    targetPublicationAddress,
    0   // Upvote variant
);
```

## `deleteReaction`

Delete existing Reaction by given `target`.

The `deleteReaction` method accepts a `target` as PublicKey of Target entity and returns[`SendAndConfirmTransactionResponse` object](#SendAndConfirmTransactionResponse) as a result.


```ts
const publicationAddress = new PublicKey("BTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeA");

const result = await ju.core().reactions().deleteReaction(publicationAddress);
```

# Core `Models` description

- [`App model`](#app-model)
- [`Profile model`](#profile-model)
- [`Subspace model`](#subspace-model)
- [`Publication model`](#publication-model)
- 

## `App` model

Represents protocol Application entity  

```ts
export type App<JsonMetadata extends object = AppJsonMetadata> = {
    /** A model identifier to distinguish models in the SDK. */
    readonly model: 'app';

    /** A Public Keys of the App */
    readonly address: PublicKey;

    /** The JSON metadata associated with the metadata account. */
    readonly metadata: Option<JsonMetadata>;

    /**
     * Whether or not the JSON metadata was loaded in the first place.
     * When this is `false`, the `json` property is should be ignored.
     */
    readonly jsonLoaded: boolean;

    /** A Protocol unique Name of the App */
    appDomainName: string;
    /** App authority */
    authority: PublicKey;
    /** External metadata URI */
    metadataUri: string | null;

    /** App Settings */
    /** Whether or not the App's Profiles external Metadata URI field is required */
    profileMetadataRequired: boolean;
    /** Whether or not the App's Subspaces external Metadata URI field is required */
    subspaceMetadataRequired: boolean;
    /** Whether or not the App's Profiles delete action is allowed */
    isProfileDeleteAllowed: boolean;
    /** Whether or not the App's Subspaces delete action is allowed */
    isSubspaceDeleteAllowed: boolean;
    /** Whether or not the App's Publication delete action is allowed */
    isPublicationDeleteAllowed: boolean;
    /** Whether or not the App's Profiles individual external processors is allowed */
    isProfileIndividualProcessorsAllowed: boolean;
    /** Whether or not the App's Subspace individual external processors is allowed */
    isSubspaceIndividualProcessorsAllowed: boolean;
    /** Whether or not the App's Publication individual external processors is allowed */
    isPublicationIndividualProcessorsAllowed: boolean;

    /** External Processors */
    /** External registering processor for additional verification */
    registeringProcessor: PublicKey | null;
    /** External connecting processor for additional verification */
    connectingProcessor: PublicKey | null;
    /** External publishing processor for additional verification */
    publishingProcessor: PublicKey | null;
    /** External collecting processor for additional verification */
    collectingProcessor: PublicKey | null;
    /** External referencing processor for additional verification */
    referencingProcessor: PublicKey | null;
}
```

## `Profile` model

Represents protocol Application's Profile entity  

```ts
export type Profile<JsonMetadata extends object = ProfileJsonMetadata> = {
    /** A model identifier to distinguish models in the SDK. */
    readonly model: 'profile';

    /** A Public Keys of the Profile */
    readonly address: PublicKey;

    /** The JSON metadata associated with the metadata account. */
    readonly metadata: Option<JsonMetadata>;

    /**  Because `firstName` is byte array in core program - needs to convert to string */
    firstName: string;
    
    /**  Because `lastName` is byte array in core program - needs to convert to string */
    lastName: string;

    /**
     * Whether or not the JSON metadata was loaded in the first place.
     * When this is `false`, the `json` property is should be ignored.
     */
    readonly jsonLoaded: boolean;

    /** A parent Application */
    app: PublicKey;
    /** Profile authority */
    authority: PublicKey;
    /** Exchange key */
    exchangeKey: web3.PublicKey;
    /** Whether or not the Profile is verified */
    isVerified: boolean;
    /** Profile country code */
    countryCode: number;
    /** Profile city code */
    regionCode: number;
    /** Profile city code */
    cityCode: number;
    /** Profile birth date */
    birthDate: BN;
    /** Profile alias */
    alias: string | null;
    /** External metadata URI */
    metadataUri: string | null;
    /** Profile status text */
    statusText: string;

    /** Helps seach profiles bi age */
    creation10Years: Bn;
    /** Helps seach profiles bi age */
    creation5Years: Bn;
    /** Helps finds near birth date */
    creationWeek: BN;
    /** Helps finds near birth date */
    creationDay: Bn;

    /** Profile sgender */
    gender: Gender | null;

    /** Profile current location coordinates */
    currentLocation: LocationCoordinates | null;

    /** Profile specified (individual) external connecting processor */
    connectingProcessor: PublicKey | null;

    /** Profile creation unix timestamp */
    createdAt: BN | null;
    /** Profile modification unix timestamp */
    modifiedAt: BN | null;

    /** Reserved for future neeeds */
    reserved1: number[];
    reserved2: number[];
    reserved3: number[];
}
```

## `Subspace` model

Represents protocol Application's Subspace entity  

```ts
export type Subspace<JsonMetadata extends object = SubspaceJsonMetadata> = {
    /** A model identifier to distinguish models in the SDK. */
    readonly model: 'subspace';
    /** A Public Keys of the Subspace */
    readonly address: PublicKey;
    /** The JSON metadata associated with the metadata account. */
    readonly metadata: Option<JsonMetadata>;
    /**  Because `name` is byte array in core program - needs to convert to string */
    name: string;
    /**
     * Whether or not the JSON metadata was loaded in the first place.
     * When this is `false`, the `json` property is should be ignored.
     */
    readonly jsonLoaded: boolean;

    /** A parent Application */
    app: PublicKey;
    /** Profile authority */
    authority: PublicKey;
    /** Exchange key */
    exchangeKey: web3.PublicKey;
    /** Subspace creator (Profile) */
    creator: PublicKey;
    /** Publishing permission enum settings implementation */
    publishingPermission: SubspacePublishingPermissionLevel;
    /** Subspace alias */
    alias: string | null;
    /** Subspace name */
    name: string | null;
    /** Subspace UUID */
    uuid: string;
    /** Subspace external metadata URI */
    metadataUri: string | null;
   
    /** External Processors */
    /** Subspace specified (individual) external connecting processor */
    connectingProcessor: PublicKey | null;
    /** Subspace specified (individual) external publishing processor */
    publishingProcessor: PublicKey | null;
    /** Subspace specified (individual) external collecting processor */
    collectingProcessor: PublicKey | null;
    /** Subspace specified (individual) external referencing processor */
    referencingProcessor: PublicKey | null;

    /** Reserved for future neeeds */
    reserved1: number[];
    reserved2: number[];
}
```

## `Publication` model

Represents protocol Application's Publication entity  

```ts
export type Publication<JsonMetadata extends object = PublicationJsonMetadata> = {
    /** A model identifier to distinguish models in the SDK. */
    readonly model: 'publication';
    /** A Public Keys of the Publication */
    readonly address: PublicKey;
    /** The JSON metadata associated with the metadata account. */
    readonly metadata: Option<JsonMetadata>;
    /**  Because `tag` is byte array in core program - needs to convert to string */
    tag: string;
    /**
     * Whether or not the JSON metadata was loaded in the first place.
     * When this is `false`, the `json` property is should be ignored.
     */
    readonly jsonLoaded: boolean;

    /** A parent Application */
    app: PublicKey;
    /** A creator Profile */
    profile: PublicKey;
    /** Profile authority */
    authority: PublicKey;
    /** Whether or not the Publication is containinf encrypted content */
    isEncrypted: boolean;
     /** Whether or not the Publication is mirroring other existing Publication (e.g. re-post) */
    isMirror: boolean;
    /** Whether or not the Publication is replying to other existing Publication (e.g. comment) */
    isReply: boolean;
    /** Publication main content type */
    contentType: ContentType;
    /** Publication tag */
    tag: string | null;
    /** Helps seach publication for feeds or notifications */
    creation3Day: BN;
    /** Helps seach publication for feeds or notifications */
    creationDay: Bn;
    /** References to existing Publication if there is a mirror or reply (PublicKey.default in case not passed) */
    targetPublication: PublicKey;
    /** Subspace in which Publication being published */
    subspace: PublicKey | null;
    /** Publication UUID */
    uuid: string;
    /** Publication external metadata URI */
    metadataUri: string | null;

    /** External Processors */
    /** Publication specified (individual) external collecting processor */
    collectingProcessor: PublicKey | null;
    /** Publication specified (individual) external referencing processor */
    referencingProcessor: PublicKey | null;

    /** Publication creation unix timestamp */
    createdAt: BN | null;
    /** Publication modification unix timestamp */
    modifiedAt: BN | null;
}
```

## `AppJsonMetadata` model

Object represents external Application metadata (that too expensive to store on-chain)

```ts
export type AppJsonMetadata<Uri = string> = {
    appId?: string;

    title?: string;
    description?: string;

    image?: Uri;
    imageCover?: Uri;

    team?: {
        title?: string;
        description?: string;
        image?: Uri;

        teamMember?: JsonMetadataTeamMember<Uri>[];

        [key: string]: unknown;
    };

    links?: JsonMetadataContacts & {
        docs?: string;
    }

    [key: string]: unknown;
}
```

## `ProfileJsonMetadata` model

Object represents external Profile metadata 

```ts
export type ProfileJsonMetadata<Uri = string> = {
    appId?: string;
    profileId?: string;

    image?: Uri;
    imageCover?: Uri;

    bio?: string;

    details?: {
        basic?: JsonMetadataProfileBasicDetails,
        physical?: JsonMetadataProfilePhysicalDetails,
        personality?: JsonMetadataProfilePersonalityDetails,

        employment?:JsonMetadataProfileEmploymentItem[],
        education?:JsonMetadataProfileEducationItem[],

        [key: string]: unknown;
    }

    [key: string]: unknown;
}
```

## `SubspaceJsonMetadata` model

Object represents external Subspace metadata

```ts
export type SubspaceJsonMetadata<Uri = string> = {
    appId?: string;

    title?: string;
    description?: string;

    image?: Uri;
    imageCover?: Uri;

    type?: JsonMetadataSubspaceType;

    team?: {
        title?: string;
        description?: string;
        image?: Uri;

        teamMember?: JsonMetadataTeamMember<Uri>[];

        [key: string]: unknown;
    };

    contacts?: JsonMetadataContacts;

    [key: string]: unknown;
}
```

## `PublicationJsonMetadata` model

Object represents external Publication metadata

```ts
export type PublicationJsonMetadata<Uri = string> = {
    appId?: string;

    title?: string;

    description?: string;
    intro?: string,

    content?: JsonMetadataPublicationContent;

    attachments?: JsonMetadataAttachment<Uri>[];

    tags?: string[];

    [key: string]: unknown;
}
```

## Other nested Json types:

```ts
export type JsonMetadataProfileBasicDetails = {
  nickname?: string;
  nationality?: string;
  ethnicity: string;
  socialClass?: 'upper class' | 'middle class' | 'lower class' | 'other';
  religion?: 'christianity' | 'islam' | 'hinduism' | 'buddhism' | 'judaism' | 'atheist' | 'other';
  sexuality?: 'heterosexual' | 'homosexual' | 'bisexual' | 'pansexual' | 'asexual' | 'demisexual' | 'queer' | 'questioning' | 'other';
  education?: 'high school' | 'college' | 'university' | 'postgraduate' | 'other';
  politicalViews?: 'conservative' | 'liberal' | 'moderate' | 'anarchist' | 'socialist' | 'fascist' | 'other';

  [key: string]: unknown;
}

export type JsonMetadataProfilePhysicalDetails =  {
  height?: 'short' | 'average' | 'tall';
  shape?: 'slim' | 'athletic' | 'curvy' | 'muscular' | 'heavyset' | 'other';
  hair?: 'black' | 'brown' | 'blonde' | 'red' | 'gray' | 'other';
  eyes?: 'brown' | 'blue' | 'green' | 'hazel' | 'gray' | 'other';
  glassesLenses?: 'glasses' | 'lenses' | 'none';
  additionalDescription?: string;

  [key: string]: unknown;
}

export type JsonMetadataProfilePersonalityDetails =  {
  positiveCharacteristics: string[];
  negativeCharacteristics: string[];

  moral?: 'always' | 'sometimes' | 'never';
  stable?: 'always' | 'sometimes' | 'never';
  loyal?: 'always' | 'sometimes' | 'never';
  generous?: 'always' | 'sometimes' | 'never';
  extravert?: 'always' | 'sometimes' | 'never';
  compassionate?: 'always' | 'sometimes' | 'never';
  iq?: number;
  hobbies?: string[];
  phobias?: string[];
  favoriteFoods: string[];

  [key: string]: unknown;
}

export type JsonMetadataProfileEmploymentItem = {
  fromYear?: number;
  toYear?: number;
  company?: string;
  position?: string;

  [key: string]: unknown;
}

export type JsonMetadataProfileEducationItem = {
  fromYear?: number;
  toYear?: number;
  school?: string;
  degree?: string;
  fieldOfStudy?: string;

  [key: string]: unknown;
};

export type JsonMetadataTeamMember<Uri> = {
  title?: string;
  role?: string;
  description?: string;
  image?: Uri;
  personalContacts?: JsonMetadataContacts;

  [key: string]: unknown;
};

export type JsonMetadataContacts = {
  website?: string;
  discord?: string;
  telegram?: string;
  twitter?: string;
  facebook?: string;
  email?: string;

  [key: string]: unknown;
};

export type JsonMetadataSubspaceType =
  'community'
  | 'group'
  | 'event'
  | 'project'
  | 'organization'
  | 'club'
  | 'team'
  | 'forum'
  | 'network'
  | 'space'
  | string;


/** @group Models */
export type JsonMetadataEvent = {
  title?: string;
  description?: string;
  datetime?: number;
  datetimeString?: string;
  location?: JsonMetadataLocation;
  participantsLimit?: number;

  [key: string]: unknown;
}

export type JsonMetadataLocation = {
  description: string;
  address?: string;
  latitude: string;
  longitude: string;
  countryCode: number;
  cityCode: number;

  [key: string]: unknown;
}

export type JsonMetadataAttachmentType =
  | 'image'
  | 'video'
  | 'audio'
  | 'document'            // For documents (PDF, Word, etc.)
  | 'link'
  | 'code'                // For code snippets or programming content
  | 'archive'             // For compressed archives (ZIP, RAR, etc.)    // For event data (date, time, location, etc.)             
  | string;               // For any other types not covered by the above

export type JsonMetadataAttachment<Uri> = {
  type?: JsonMetadataAttachmentType;
  description?: string;

  thumbnail?: Uri;
  uri?: Uri;

  location?: JsonMetadataLocation;
  event?: JsonMetadataEvent;

  [key: string]: unknown;
};

export type JsonMetadataPublicationContent = {
  type?: 'plainText' | 'html' | 'markdown';
  value?: string;

  [key: string]: unknown;
}
```


# Additional references

## `uploadMetadata`

When creating or updating an App, you will need a URI pointing to some JSON Metadata describing the additional App parameters. Depending on your requirement, you may do this on-chain or off-chain.

If your JSON metadata is not already uploaded, you may do this using the SDK via the `uploadMetadata` method. It accepts a metadata object and returns the URI of the uploaded metadata. Where exactly the metadata will be uploaded depends on the selected `StorageDriver`.

```ts
const { uri } = await ju.storage().uploadMetadata<AppJsonMetadata<JuFile | string>>(
    {
        name: "MyApp",
        description: "My App description",
        image: "https://arweave.net/123",
    }
);

console.log(uri) // https://arweave.net/789
```

Some properties inside that metadata object will also require you to upload some assets to provide their URI — such as the `image` property on the example above.

To make this process easier, the `uploadMetadata` method will recognise any instances of `JuFile` within the provided object and upload them in bulk to the current storage driver. It will then create a new version of the provided metadata where all instances of `JuFile` are replaced with their URI. Finally, it will upload that replaced metadata to the storage driver and return it.

```ts
// Assuming the user uploaded two assets via an input field of type "file".
const browserFiles = event.target.files;

const { uri, metadata } = await ju.storage().uploadMetadata<PublicationJsonMetadata<JuFile | string>>(
    {
        appId: 'app public key here';

        title: 'Publication title';

        description: 'Some description';
        intro: '',

        attachments: [
            {
                type: "video",
                description: 'my cool video';

                thumbnail?: 'https://....';

                uri: await toJuFileFromBrowser(browserFiles[1]),
            },
        ]
    }
);

console.log(metadata.image) // https://arweave.net/123
console.log(metadata.properties.files[0].uri) // https://arweave.net/456
console.log(uri) // https://arweave.net/789
```

Note that `JuFile`s can be created in various different ways based on where the file is coming from. You can [read more about `JuFile` objects and how to use them here](#JuFile).

## `Identity`

The current identity of a `Ju` instance can be accessed via `ju.identity()` and provide information on the wallet we are acting on behalf of when interacting with the SDK.

This method returns an identity client with the following interface.

```ts
class IdentityClient {
    driver(): IdentityDriver;
    setDriver(newDriver: IdentityDriver): void;
    publicKey: PublicKey;
    secretKey?: Uint8Array;
    signMessage(message: Uint8Array): Promise<Uint8Array>;
    verifyMessage(message: Uint8Array, signature: Uint8Array): boolean;
    signTransaction(transaction: Transaction): Promise<Transaction>;
    signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
    equals(that: Signer | PublicKey): boolean;
    hasSecretKey(): this is KeypairSigner;
}
```

The `IdentityClient` delegates to whichever `IdentityDriver` is currently set to provide this set of methods. Thus, the implementation of these methods depends on the concrete identity driver being used. For instance, in the CLI, these methods will directly use a key pair whereas, in the browser, they will delegate to a wallet adapter.

Let’s have a quick look at the concrete identity drivers available to us.

## `guestIdentity`

The `guestIdentity` driver is the default driver and requires no parameter. It is essentially a `null` driver that can be useful when we don’t need to send any signed transactions.

```ts
import { guestIdentity } from "@ju-social/sdk";

ju.use(guestIdentity());
```

If we try to sign a message or a transaction using this driver, an error will be thrown.

### keypairIdentity

The `keypairIdentity` driver accepts a `Keypair` object as a parameter. This is useful when using the SDK locally such as within CLI applications.

```ts
import { keypairIdentity } from "@ju-social/sdk";
import { Keypair } from "@solana/web3.js";

// Load a local keypair.
const keypairFile = fs.readFileSync('/Users/username/.config/solana/id.json');
const keypair = Keypair.fromSecretKey(Buffer.from(JSON.parse(keypairFile.toString())));

// Use it in the SDK.
ju.use(keypairIdentity(keypair));
```

## `walletAdapterIdentity`

The `walletAdapterIdentity` driver accepts a wallet adapter as defined by the [“wallet-adapter” repo from Solana Labs](https://github.com/solana-labs/wallet-adapter). This is useful when using the SDK in a web application that requires the user to manually approve transactions.

```ts
import { walletAdapterIdentity } from "@ju-social/sdk";
import { useWallet } from '@solana/wallet-adapter-react';

const wallet = useWallet();
ju.use(walletAdapterIdentity(wallet));
```

# `Storage`
You may access the storage client using `ju.storage()` which will give you access to the following interface.

```ts
class StorageClient {
    driver(): StorageDriver
    setDriver(newDriver: StorageDriver): void;
    getUploadPriceForBytes(bytes: number): Promise<Amount>;
    getUploadPriceForFile(file: JuFile): Promise<Amount>;
    getUploadPriceForFiles(files: JuFile[]): Promise<Amount>;
    upload(file: JuFile): Promise<string>;
    uploadAll(files: JuFile[]): Promise<string[]>;
    uploadJson<T extends object = object>(json: T): Promise<string>;
    download(uri: string, options?: RequestInit): Promise<JuFile>;
    downloadJson<T extends object = object>(uri: string, options?: RequestInit): Promise<T>;
}
```

Similarly to the `IdentityClient`, the `StorageClient` delegates to the current `StorageDriver` when executing these methods. We'll take a look at the storage drivers available to us, but first, let's talk about the `JuFile` type which is being used throughout the `StorageClient` API.

# `JuFile`

The `JuFile` type is a simple wrapper around `Buffer` that adds additional context relevant to files and assets such as their filename, content type, extension, etc. It contains the following data.

```ts
type JuFile = Readonly<{
    buffer: Buffer;
    fileName: string;
    displayName: string;
    uniqueName: string;
    contentType: string | null;
    extension: string | null;
    tags: JuFileTag[];
}>
```

You may use the `toJuFile` function to create a `JuFile` object from a `Buffer` instance (or content `string`) and a filename. The filename is necessary to infer the extension and the mime type of the provided file.

```ts
const file = toJuFile('The content of my file', 'my-file.txt');
```

You may also explicitly provide these options by passing a third parameter to the constructor.

```ts
const file = toJuFile('The content of my file', 'my-file.txt', {
    displayName = 'A Nice Title For My File'; // Defaults to the filename.
    uniqueName = 'my-company/files/some-identifier'; // Defaults to a random string.
    contentType = 'text/plain'; // Infer it from filename by default.
    extension = 'txt'; // Infer it from filename by default.
    tags = [{ name: 'my-tag', value: 'some-value' }]; // Defaults to [].
});
```

Note that if you want to create a `JuFile` directly from a JSON object, there's a `toJuFileFromJson` helper method that you can use like so.

```ts
const file = toJuFileFromJson({ foo: 42 });
```

In practice, you will most likely be creating `JuFile`s from files either present on your computer or uploaded by some user on the browser. You can do the former by using `fs.readFileSync`.

```ts
const buffer = fs.readFileSync('/path/to/my-file.txt');
const file = toJuFile(buffer, 'my-file.txt');
```

And the latter by using the `toJuFileFromBrowser` helper method which accepts a `File` object as defined in the browser.

```ts
const browserFile: File = event.target.files[0];
const file: JuFile = await toJuFileFromBrowser(browserFile);
```

Okay, now let’s talk about the concrete storage drivers available to us and how to set them up.

# `bundlrStorage`

The `bundlrStorage` driver is the default driver and uploads assets on Arweave using the [Bundlr network](https://bundlr.network/).

By default, it will use the same RPC endpoint used by the `Ju` instance as a `providerUrl` and the mainnet address `"https://node1.bundlr.network"` as the Bundlr address.

You may customise these by passing a parameter object to the `bundlrStorage` method. For instance, here’s how you can use Bundlr on devnet.

```ts
import { bundlrStorage } from "@ju-social/sdk";

ju.use(bundlrStorage({
    address: 'https://devnet.bundlr.network',
    providerUrl: 'https://api.devnet.solana.com',
    timeout: 60000,
}));
```

To fund your bundlr storage account you can cast it in TypeScript like so:

```ts
const bundlrStorage = ju.storage().driver() as BundlrStorageDriver;
```

This gives you access to useful public methods such as:

```ts
bundlrStorage.fund([juFile1, juFile2]); // Fund using file size.
bundlrStorage.fund(1000); // Fund using byte size.
(await bundlrStorage.bundlr()).fund(1000); // Fund using lamports directly.
```

# `mockStorage`

The `mockStorage` driver is a fake driver mostly used for testing purposes. It will not actually upload the assets anywhere but instead will generate random URLs and keep track of their content in a local dictionary. That way, once uploaded, an asset can be retrieved using the `download` method.

```ts
import { mockStorage } from "@ju-social/sdk";

ju.use(mockStorage());
```

