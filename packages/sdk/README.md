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

const profile = await ju.core().profile.get(profileAddress);
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
- [`common`](#common-client)
- [`app`](#app-client)
- [`profile`](#profile-client)
- [`subspace`](#subspace-client)
- [`publication`](#publication-client)
- [`connection`](#connection-client)
- [`reaction`](#reaction-client)
- [`report`](#report-client)

## `Common` client
The Common client can be accessed via `ju.core().common` and provides the following methods:
- [`search`](#search)
- [`findAliasByValue`](#findAliasByValue)
- [`findEntityByAliasValue`](#findEntityByAliasValue)

## `App` client
The App client can be accessed via `ju.core().app` and provides the following methods:
- [`get`](#getApp)
- [`create`](#createApp)
- [`update`](#updateApp)

## `Profile` client
The Profile client can be accessed via `ju.core().profile` and provides the following methods:
- [`get`](#getProfile)
- [`create`](#createProfile)
- [`update`](#updateProfile)
- [`delete`](#deleteProfile)
- [`keysByFilter`](#keysByFilterProfile)
- [`findByConnectionTarget`](#findByConnectionTargetProfile)
- [`findByConnectionInitializer`](#findByConnectionInitializerProfile)
- [`findByKeyList`](#findByKeyListProfile)
- [`setName`](#setNameProfile)
- [`setSurname`](#setSurnameProfile)
- [`setAlias`](#setAliasProfile)
- [`setMetadataUri`](#setMetadataUriProfile)
- [`setStatus`](#setStatusProfile)
- [`setBirthDate`](#setBirthDateProfile)
- [`deleteBirthDate`](#deleteBirthDateProfile)
- [`setCountryCode`](#setCountryCodeProfile)
- [`setCityCode`](#setCityCodeProfile)
- [`setCurrentLocation`](#setCurrentLocationProfile)

## `Subspace` client
The Subspace client can be accessed via `ju.core().subspace` and provides the following methods:
- [`get`](#getSubspace)
- [`create`](#createSubspace)
- [`update`](#updateSubspace)
- [`delete`](#deleteSubspace)

## `Publication` client
The Publication client can be accessed via `ju.core().publication` and provides the following methods:
- [`get`](#getPublication)
- [`create`](#createPublication)
- [`update`](#updatePublication)
- [`delete`](#deletePublication)
- [`collect`](#collectPublication)
- [`keysByFilter`](#keysByFilterPublication)
- [`findByKeyList`](#findByKeyListPublication)

## `Connection` client
The Connection client can be accessed via `ju.core().connection` and provides the following methods:
- [`create`](#createConnection)
- [`update`](#updateConnection)
- [`delete`](#deleteConnection)
- [`keysByFilter`](#keysByFilterConnection)
- [`findByKeyList`](#findByKeyListConnection)

## `Reaction` client
The Reaction client can be accessed via `ju.core().reaction` and provides the following methods:
- [`create`](#createReaction)
- [`delete`](#deleteReaction)
- [`keysByFilter`](#keysByFilterReaction)
- [`findByKeyList`](#findByKeyListReaction)

## `Report` client
The Report client can be accessed via `ju.core().report` and provides the following methods:
- [`create`](#createReport)
- [`keysByFilter`](#keysByFilterReport)
- [`findByKeyList`](#findByKeyListReport)



# `Common client` methods
Detailed description of the Common client methods.

- [The `SearchResultItem` object](#SearchResultItem)

## `search`

Finds entities by given request string.

The `search` method accepts an `app` as public key and returns a [`SearchResultItem`](#SearchResultItem) object.


```ts
const app = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");
const requestString = 'something';

const result = await ju.core().common.search(
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

const result = await ju.core().common.findAliasByValue(
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

const result = await ju.core().common.findEntityByAliasValue(
    app,
    alias 
);
```

# `App client` methods
Detailed description of the App client methods.

The following model, either returned or used by the above methods.

- The [`App` model](#the-app-model)

## `get`

Gets the App instance by given App address.

The `get` method accepts an `app` as public key and returns an [`App` model](#App) instance.


```ts
const appAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const app = await ju.core().app.get(appAddress);
```

The returned `App` object will have its JSON metadata already loaded so you can, for instance, access its image URL like so (provided it is present in the downloaded metadata).

```ts
const imageUrl = app.metadata.image;
```

You can [read more about the `App` model below](#App).

## `create`

Creates the App instance with given data.

The `create` method accepts a [`CreateAppInput`](#CreateAppInput) object and returns an [`App` model](#App) instance.


```ts
const { app } = await ju.core().app.create(
    { 
        appDomainName: 'testApp',
        data: {
            // TODO
        },
        externalProcessors: {
            // TODO
        }
    }
);
```

## `update`

Update the existing App data.

The `update` method accepts an [`App`](#App) instance and `app data` object to update current values.


```ts
const appAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const app = await ju.core().app.get(appAddress);

const result = await ju.core().app.update(
    app,
    { 
        metadataUri: 'https://example.com/updated-uri'
    }
);
```

# `Profile client` methods
Detailed description of the Profile client methods.

## `get`

Gets the Profile instance by given profile address (public key).

The `get` method accepts an `address` as public key and returns a [`Profile` model](#Profile) instance.


```ts
const profileAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const profile = await ju.core().profile.get(profileAddress);
```

The returned `Profile` object will have its JSON metadata already loaded so you can, for instance, access its image URL like so (provided it is present in the downloaded metadata).

```ts
const imageUrl = profile.metadata.image;
```

You can [read more about the `Profile` model below](#Profile).

## `create`

Creates new Profile with given data.

The `create` method accepts a [`CreateProfileInput`](#CreateProfileInput) object and returns a [`Profile` model](#Profile) instance.


```ts
const appAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const { profile } = await ju.core().profile.create(
    { 
        app: appAddress,
        data: {
            // TODO
        }
    }
);
```

## `update`

Update the existing Profile data.

The `update` method accepts a [`Profile`](#Profile) instance and `profile data` object to update current values.


```ts
const profileAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const profile = await ju.core().profile.get(profileAddress);

const result = await ju.core().app.update(
    profile,
    { 
        name: 'Alice',
        surname: 'Smith'
    }
);
```

## `delete`

Delete the existing Profile.

The `update` method accepts a [`Profile`](#Profile) instance and returns a [`SendAndConfirmTransactionResponse`](#SendAndConfirmTransactionResponse) as a result.


```ts
const profileAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const profile = await ju.core().profile.get(appAddress);

const result = await ju.core().app.delete(profile);
```


# `Subspace client` methods
Detailed description of the Subspace client methods.

## `get`

Get the Subspace instance by subspace address (public key).

The `get` method accepts an `address` as public key and returns a [`Subspace` model](#Subspace) instance.


```ts
const subspaceAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const { subspace } = await ju.core().subspace.get(subspaceAddress);
```

The returned `Subspace` object will have its JSON metadata already loaded so you can, for instance, access its image URL like so (provided it is present in the downloaded metadata).

```ts
const imageUrl = subspace.metadata.image;
```

You can [read more about the `Subspace` model below](#Subspace).

## `create`

Creates new Subspace with given data.

The `create` method accepts a [`CreateSubspaceInput`](#CreateSubspaceInput) object and returns and [`Subspace` model](#Subspace) instance.


```ts
const appAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const { subspace } = await ju.core().subspace.create(
    { 
        app: appAddress,
        data: {
            // TODO
        }
    }
);
```

## `update`

Update the existing Subspace data.

The `update` method accepts a [`Subspace`](#Subspace) instance and `subspace data` object to update current values.


```ts
const subspaceAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const subspace = await ju.core().subspace.get(subspaceAddress);

const result = await ju.core().subspace.update(
    subspace,
    { 
        name: 'Nuclear Block',
    }
);
```

## `delete`

Delete the existing Subspace.

The `update` method accepts a [`Subspace`](#Subspace) instance and returns a [`SendAndConfirmTransactionResponse`](#SendAndConfirmTransactionResponse) as a result.


```ts
const subspaceAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const subspace = await ju.core().subspace.get(subspaceAddress);

const result = await ju.core().subspace.delete(subspace);
```


# `Publication client` methods
Detailed description of the Publication client methods.

## `get`

Gets the Publication instance by publication address (public key).

The `get` method accepts an `address` as public key and returns a [`Publication` model](#Publication) instance.


```ts
const publicationAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const { publication } = await ju.core().publication.get(publicationAddress);
```

The returned `Publication` object will have its JSON metadata already loaded so you can, for instance, access its image URL like so (provided it is present in the downloaded metadata).

```ts
const imageUrl = publication.metadata.image;
```

You can [read more about the `Publication` model below](#Publication).

## `create`

Creates new Publication with given data.

The `create` method accepts a [`CreatePublicationInput`](#CreatePublicationInput) object and returns and [`Publication` model](#Publication) instance.


```ts
const publicationAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const { publication } = await ju.core().publication.create(
    { 
        app: publicationAddress,
        data: {
            // TODO
        }
    }
);
```

## `update`

Update the existing Publication data.

The `update` method accepts a [`Publication`](#Publication) instance and `publication data` object to update current values.


```ts
const publicationAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const publication = await ju.core().publication.get(publicationAddress);

const result = await ju.core().publication.update(
    publication,
    { 
        // TODO
    }
);
```

## `delete`

Delete the existing Publication.

The `delete` method accepts a [`Publication`](#Publication) instance and returns a [`SendAndConfirmTransactionResponse`](#SendAndConfirmTransactionResponse) as a result.


```ts
const publicationAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const { publication } = await ju.core().publication.get(publicationAddress);

const result = await ju.core().publication.delete(publication);
```


# `Connection client` methods

Detailed description of the Connection client methods.

You can [read more about the `Connection` model below](#Connection).

## `create`

Creates new Connection with diven data.

The `create` method accepts a `target` as a variant of  [`Profile`](#Profile) or [`Subspace`](#Subspace) instance and optional `externalProcessingData` as string and returns[`SendAndConfirmTransactionResponse` object](#SendAndConfirmTransactionResponse) as a result.


```ts
const appAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const targetProfileAddress = new PublicKey("YTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeG");

const targetProfile = await ju.core().profile.get(targetProfileAddress);

// Optional string to pass into external Connecting processor
const externalProcessingData = 'some-validation-string';

// Create connection with given Profile
const result = await ju.core().connection.create(targetProfile, externalProcessingData);
```

## `update`

Update existing Connection (actually approve).

The `update` method accepts a `initializer` as [`Profile` model](#Profile), `target` as public key, `approveStatus` as boolean and returns[`SendAndConfirmTransactionResponse` object](#SendAndConfirmTransactionResponse) as a result.


```ts
const appAddress = new PublicKey("XTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeE");

const initializerProfileAddress = new PublicKey("YTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeG");

const targetSubspaceAddress = new PublicKey("BTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeA");

const initializerProfile = await ju.core().profile.get(initializerProfileAddress);

const result = await ju.core().connection.update(
    initializerProfile,
    targetSubspaceAddress,
    true
);
```

## `delete`

Delete existing Connection.

The `delete` method accepts a `target` as a variant of [`Profile` model](#Profile) or [`Subspace` model](#Subspace) instance and returns[`SendAndConfirmTransactionResponse` object](#SendAndConfirmTransactionResponse) as a result.


```ts
const profileAddress = new PublicKey("BTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeA");

const targetProfile = await ju.core().profile.get(profileAddress);

const result = await ju.core().connection.delete(targetProfile);
```


# `Reaction client` methods

Detailed description of the Reaction client methods.

You can [read more about the `Reaction` model below](#Reaction).

## `create`

Creates new Reaction to given `target` Publication.

The `create` method accepts a `target` as [`Publication` model](#Publication) instance, `reactionType` as [`ReactionType`] (#ReactionType) enum variant and returns [`SendAndConfirmTransactionResponse`](#SendAndConfirmTransactionResponse) object as a result.


```ts
const targetPublicationAddress = new PublicKey("YTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeG");

const targetPublication = await ju.core().publication.get(targetPublicationAddress);

const result = await ju.core().reaction.create(
    targetPublication,
    0   // Upvote variant
);
```

## `delete`

Delete existing Reaction by given `target`.

The `delete` method accepts a `target` as [`Publication` model](#Publication) instance and returns[`SendAndConfirmTransactionResponse` object](#SendAndConfirmTransactionResponse) as a result.


```ts
const publicationAddress = new PublicKey("BTe3DymKZadrUoqAMn7HSpraxE4gB88uo1L9zLGmzJeA");

const targetPublication = await ju.core().publication.get(publicationAddress);

const result = await ju.core().reaction.delete(targetPublication);
```

# Core `Models` description

- [`App model`](#app-model)
- [`Profile model`](#profile-model)
- [`Subspace model`](#subspace-model)
- [`Publication model`](#publication-model)

## `App` model

Represents protocol Application entity  

```ts
export type App<JsonMetadata extends object = AppJsonMetadata> = {
    /** A model identifier to distinguish models in the SDK. */
    model: 'profile';
    /** A Public Keys of the App */
    address: PublicKey;
    /** The JSON metadata associated with the metadata account. */
    metadata: JsonMetadata | null;
    /** A Protocol unique Name of the App */
    appDomainName: string;
    /** App authority */
    authority: PublicKey;
    /** External metadata URI */
    metadataUri: string | null;

    /** App Settings */

    /** Whether or not the App's Profiles Name field is required */
    profileNameRequired: boolean;
    /** Whether or not the App's Profiles Surname field is required */
    profileSurnameRequired: boolean;
    /** Whether or not the App's Profiles Birthdate field is required */
    profileBirthdateRequired: boolean;
    /** Whether or not the App's Profiles Country field is required */
    profileCountryRequired: boolean;
    /** Whether or not the App's Profiles City field is required */
    profileCityRequired: boolean;
    /** Whether or not the App's Profiles external Metadata URI field is required */
    profileMetadataRequired: boolean;
    /** Whether or not the App's Subspaces Name field is required */
    subspaceNameRequired: boolean;
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
    model: 'profile';
    /** A Public Keys of the Profile */
    address: PublicKey;
    /** The JSON metadata associated with the metadata account. */
    metadata: JsonMetadata | null;

    /** A parent Application */
    app: PublicKey;
    /** Profile authority */
    authority: PublicKey;
    /** Profile alias */
    alias: string | null;
    /** External metadata URI */
    metadataUri: string | null;
    /** Profile status text */
    statusText: string | null;
    /** Whether or not the Profile is verified */
    verified: boolean;
    /** Profile name */
    name: string | null;
    /** Profile surname */
    surname: string | null;
    /** Profile birth date */
    birthDate: BN | null;
    /** Profile country code */
    countryCode: number | null;
    /** Profile city code */
    cityCode: number | null;
    /** Profile current location coordinates */
    currentLocation: LocationCoordinates | null;
    /** Profile specified (individual) external connecting processor */
    connectingProcessor: PublicKey | null;
    /** Profile creation unix timestamp */
    createdAt: BN | null;
    /** Profile modification unix timestamp */
    modifiedAt: BN | null;
}
```

## `Subspace` model

Represents protocol Application's Subspace entity  

```ts
export type Subspace<JsonMetadata extends object = SubspaceJsonMetadata> = {
    /** A model identifier to distinguish models in the SDK. */
    model: 'subspace';
    /** A Public Keys of the Subspace */
    address: PublicKey;
    /** The JSON metadata associated with the metadata account. */
    metadata: JsonMetadata | null;

    /** A parent Application */
    app: PublicKey;
    /** Profile authority */
    authority: PublicKey;
    /** Subspace creator (Profile) */
    creator: PublicKey;
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
}
```

## `Publication` model

Represents protocol Application's Publication entity  

```ts
export type Publication<JsonMetadata extends object = PublicationJsonMetadata> = {
    /** A model identifier to distinguish models in the SDK. */
    model: 'publication';
    /** A Public Keys of the Publication */
    address: PublicKey;
    /** The JSON metadata associated with the metadata account. */
    metadata: JsonMetadata | null;

    /** A parent Application */
    app: PublicKey;
    /** A creator Profile */
    profile: PublicKey;
    /** Profile authority */
    authority: PublicKey;
    /** Subspace in which Publication being published */
    subspace: PublicKey | null;
    /** Whether or not the Publication is mirroring other existing Publication (e.g. re-post) */
    isMirror: boolean;
    /** Whether or not the Publication is replying to other existing Publication (e.g. comment) */
    isReply: boolean;
    /** References to existing Publication if there is a mirror or reply (optional) */
    targetPublication: PublicKey | null;
    /** Publication main content type */
    contentType: ContentType;
    /** Publication tag */
    tag: string | null;
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

## `JsonMetadata` model

Object represents external metadata

```ts
export type JsonMetadata<Uri = string> = {
    // TODO
}
```


# Additional references

## `uploadMetadata`

When creating or updating an App, you will need a URI pointing to some JSON Metadata describing the additional App parameters. Depending on your requirement, you may do this on-chain or off-chain.

If your JSON metadata is not already uploaded, you may do this using the SDK via the `uploadMetadata` method. It accepts a metadata object and returns the URI of the uploaded metadata. Where exactly the metadata will be uploaded depends on the selected `StorageDriver`.

```ts
const { uri } = await ju.core().common.uploadMetadata(
    {
        name: "My App",
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

const { uri, metadata } = await ju.core().common.uploadMetadata(
    {
        name: "My Video",
        image: await toJuFileFromBrowser(browserFiles[0]),
        properties: {
            files: [
                {
                    type: "video/mp4",
                    uri: await toJuFileFromBrowser(browserFiles[1]),
                },
            ]
        }
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

