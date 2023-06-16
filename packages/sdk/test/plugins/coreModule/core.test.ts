import spok from 'spok';
import test, { Test } from 'tape';
import { PublicKey } from '@solana/web3.js';
import {
  killStuckProcess,
  ju
} from '../../helpers';
import { toBirthDate, toJuFile } from '@/index';

killStuckProcess();

// type TestProfileJsonMetadata<Uri = string> = {
//   name?: string;
//   description?: string;
//   image?: Uri
//   avatar?: Uri;
// };

test('[Setup]', async () => {

  const jp = await ju();

  /** App */
  const appName = 'TestApp'
  const appAuthority = jp.identity().publicKey;

  const testApp = jp.core().pdas().app({ appName });

  /** Profiles */
  const alice = {
    ju: await ju(),
    name: 'alice',
    surname: 'Smith',
    birthdate: [1990, 1, 21] as [number, number, number],
    status: null,
    json: {
      name: 'Alice',
      description: 'Alise is the 1st test user',
      image: toJuFile('alice_image', 'alice-image.jpg'),
      avatar: toJuFile('alice_avatar', 'alice-avatar.jpg'),
    },
    subspaceAlias: 'aliceteam',
    subspaceJson: {
      name: 'Alice Friends group',
      description: 'Alise official subspace',
      image: toJuFile('alice_subspace_image', 'alice-subspace-image.jpg'),
      avatar: toJuFile('alice_subspace_avatar', 'alice-subspace-avatar.jpg'),
    }
  }
  const bob = {
    ju: await ju(),
    name: 'bobb',
    surname: 'Johnson',
    birthdate: [1991, 2, 23] as [number, number, number],
    status: 'Hey there!',
    json: {
      name: 'Bob',
      description: 'Bob is the 2nd test user',
      image: toJuFile('bob_image', 'bob-image.jpg'),
    }
  }
  const konrad = {
    ju: await ju(),
    name: 'konrad',
    surname: 'Mikhelson',
    birthdate: [1992, 3, 29] as [number, number, number],
    status: 'LFG!!!',
    json: {
      name: 'Konrad',
      description: 'Konrad is the 3nd test user',
      image: toJuFile('konrad_image', 'konrad-image.jpg'),
    }
  }

  const aliceAddress = alice.ju.core().pdas().profile({ app: testApp });
  const bobAddress = bob.ju.core().pdas().profile({ app: testApp })
  const konradAddress = konrad.ju.core().pdas().profile({ app: testApp })

  let subspace1 = PublicKey.default;
  const subspace1Name = 'Test Subspace';

  let publication1 = PublicKey.default;
  let publication2 = PublicKey.default;
  // let publication3 = PublicKey.default;
  // let publication4 = PublicKey.default;

  const publicationReportString = 'Publication report test reason';
  const subspaceReportString = 'Subspace report test reason';
  const profileReportString = 'Profile report test reason';

  test('[App]', async () => {
    test('[Create] it can create an App', async (t: Test) => {

      // Upload some metadata containing an image.
      const { uri } = await jp.storage().uploadMetadata({
        name: 'JSON App name',
        description: 'JSON App description',
        image: toJuFile('app_image', 'app-image.jpg'),
      });

      // Create a new App with minimum configuration.
      const {
        app
      } = await jp.core().app.create(
        {
          appName,
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


      spok(t, app, {
        $topic: 'App test',
        appName: 'TestApp',
        authority: jp.identity().publicKey,
        metadataUri: uri,
        registeringProcessor: null,
        connectingProcessor: null,
        publishingProcessor: null,
        collectingProcessor: null,
        referencingProcessor: null
      });
    });

    test('[Update] it can update an existing App', async (t: Test) => {

      const updatedUri = 'https://example.com/app-updated-uri'

      const app = await jp.core().app.get(testApp);

      // Update an existing App.
      const updateResult = await jp.core().app.update(
        app,
        {
          metadataUri: updatedUri,
          profileDeleteAllowed: true,
          subspaceDeleteAllowed: true,
          publicationDeleteAllowed: true,
        }
      );

      spok(t, updateResult.app, {
        $topic: 'App test',
        appName: 'TestApp',
        authority: appAuthority,
        metadataUri: updatedUri,
        profileDeleteAllowed: true,
        subspaceDeleteAllowed: true,
        publicationDeleteAllowed: true,
      });
    });
  })

  test('[Profiles]', async () => {

    const updatedAlias1 = 'updatedAlias1';
    const updatedAlias2 = 'updatedAlias2';

    test('[Create] it can create Profile 1 (Alice)', async (t: Test) => {

      // Upload some metadata containing an image.
      const aliceMetadata = alice.json;
      const {
        uri,
        // assetUris, 
        metadata
      } = await alice.ju.storage().uploadMetadata(aliceMetadata);

      // console.log('Alice uri :>> ', uri);
      // console.log('Alice assetUris :>> ', assetUris);
      // console.log('Alice metadata :>> ', metadata);

      t.comment(`Alice metadata Avatar : ${metadata.avatar}`);

      // Create a new App Profile.
      const { profile } = await alice.ju.core().profile.create(
        {
          app: testApp,
          data: {
            alias: alice.name,
            metadataUri: uri,
            statusText: alice.status,
            name: alice.name,
            surname: alice.surname,
            birthDate: toBirthDate(...alice.birthdate),
            countryCode: null,
            cityCode: null,
            currentLocation: null
          }
        }
      );

      t.equal(profile.app.toBase58(), testApp.toBase58())

      // profileClient.metadataJson()

      spok(t, profile, {
        $topic: 'Profile 1 test',
        alias: alice.name,
        metadataUri: uri,
        statusText: alice.status,
        authority: alice.ju.identity().publicKey,
        connectingProcessor: null,
      });

    });

    test('[Create] it can create Profile 2 (Bob)', async (t: Test) => {

      // Upload some metadata containing an image.
      const { uri } = await bob.ju.storage().uploadMetadata(bob.json);
      // console.log('Bob uri :>> ', uri);

      // Create a new App Profile.
      const { profile } = await bob.ju.core().profile.create(
        {
          app: testApp,
          data: {
            alias: bob.name,
            metadataUri: uri,
            statusText: bob.status,
            name: bob.name,
            surname: bob.surname,
            birthDate: toBirthDate(...bob.birthdate),
            countryCode: null,
            cityCode: null,
            currentLocation: null
          }
        }
      );

      t.equal(profile.app.toBase58(), testApp.toBase58())

      spok(t, profile, {
        $topic: 'Profile 2 test',
        alias: bob.name,
        metadataUri: uri,
        statusText: bob.status,
        authority: bob.ju.identity().publicKey,
        connectingProcessor: null,
      });
    });

    test('[Create] it can create Profile 3 (Konrad)', async (t: Test) => {

      // Upload some metadata containing an image.
      const { uri } = await konrad.ju.storage().uploadMetadata(konrad.json);
      // console.log('Konrad uri :>> ', uri);

      // Create a new App Profile.
      const { profile } = await konrad.ju.core().profile.create(
        {
          app: testApp,
          data: {
            alias: konrad.name,
            metadataUri: uri,
            statusText: konrad.status,
            name: konrad.name,
            surname: konrad.surname,
            birthDate: toBirthDate(...konrad.birthdate),
            countryCode: null,
            cityCode: null,
            currentLocation: null
          }
        }
      );

      t.equal(profile.app.toBase58(), testApp.toBase58())

      spok(t, profile, {
        $topic: 'Profile 3 test',
        alias: konrad.name,
        metadataUri: uri,
        statusText: konrad.status,
        authority: konrad.ju.identity().publicKey,
        connectingProcessor: null,
      });
    });

    test('[Update] it can delete Alias for Profile 1 (Alice)', async (t: Test) => {

      const aliceProfile = await alice.ju.core().profile.get(aliceAddress);

      // Delete alias
      const result = await alice.ju.core().profile.setAlias(aliceProfile, null);

      t.equal(result.profile.alias, null)
    });


    test('[Update] it can register Alias for Profile 1 (Alice)', async (t: Test) => {

      const profile = await alice.ju.core().profile.get(aliceAddress)

      // Update Status
      const result = await alice.ju.core().profile.setAlias(
        profile,
        updatedAlias1
      )

      spok(t, result.profile, {
        $topic: 'Profile 1 Update test',
        alias: updatedAlias1,
      });
    });


    test('[Update] it can update status text and Alias for Profile 1 (Alice)', async (t: Test) => {

      const updatedStatusText = 'updated status text';

      const profile = await alice.ju.core().profile.get(aliceAddress)

      // Update Status
      const result = await alice.ju.core().profile.update(
        profile,
        {
          alias: updatedAlias2,
          statusText: updatedStatusText
        }
      );

      spok(t, result.profile, {
        $topic: 'Profile 1 status & alias Update test',
        alias: updatedAlias2,
        statusText: updatedStatusText,
      });
    });


    test('[Connect] user Bob can connect to Konrad', async (t: Test) => {

      const konradProfile = await bob.ju.core().profile.get(konradAddress)

      // Bob create new Connection with Konrad.
      const { response } = await bob.ju.core().connection.create(konradProfile);

      t.comment(`tx signature: ${response.signature}`);
    });

    test('[Connect] user Alice can connect to Konrad', async (t: Test) => {

      const konradProfile = await alice.ju.core().profile.get(konradAddress)

      // Create new Connection (subscribe to Alice group).
      const { response } = await alice.ju.core().connection.create(konradProfile);

      t.comment(`tx signature: ${response.signature}`);
    });

    test('[Connect] user Alice can connect to Bob', async (t: Test) => {

      const bobProfile = await alice.ju.core().profile.get(bobAddress)

      // Create new Connection (subscribe to Alice group).
      const { response } = await alice.ju.core().connection.create(bobProfile);

      t.comment(`tx signature: ${response.signature}`);
    });

    test('[Approve] Konrad can approve Alice Connection', async (t: Test) => {

      const aliceProfile = await bob.ju.core().profile.get(aliceAddress)

      // Create new Connection (subscribe to Alice group).
      const { response } = await konrad.ju.core().connection.update(
        aliceProfile,
        konradAddress,
        true
      );

      t.comment(`tx signature: ${response.signature}`);
    });
  })

  test('[Subspaces]', async () => {
    test('[Create] it can create Subspace 1 (Alice group)', async (t: Test) => {

      // Upload some metadata containing an image.
      const subspaceMetadata = alice.subspaceJson;
      const {
        uri,
        // assetUris, 
        // metadata 
      } = await alice.ju.storage().uploadMetadata(subspaceMetadata);

      // console.log('Alice Subspace uri :>> ', uri);
      // console.log('Alice Subspace assetUris :>> ', assetUris);
      // console.log('Alice Subspace metadata :>> ', metadata);
      // t.comment(`Alice Subspace metadata Avatar : ${metadata.avatar}`);

      // Create a new App Profile.
      const { subspace } = await alice.ju.core().subspace.create(
        {
          app: testApp,
          data: {
            alias: alice.subspaceAlias,
            name: subspace1Name,
            metadataUri: uri,
          },
          externalProcessors: {
            connectingProcessor: null,
            publishingProcessor: null,
            collectingProcessor: null,
            referencingProcessor: null,
          }
        }
      );

      t.equal(subspace.app.toBase58(), testApp.toBase58())

      // profileClient.metadataJson()

      spok(t, subspace, {
        $topic: 'Subspace 1 test',
        alias: alice.subspaceAlias,
        metadataUri: uri,
        authority: alice.ju.identity().publicKey,
        collectingProcessor: null,
      });

      subspace1 = subspace.address;

    });

    test('[Subscribe] user Bob can connect to Subspace 1', async (t: Test) => {

      const subspace = await bob.ju.core().subspace.get(subspace1);

      // Create new Connection (subscribe to Alice group).
      const { response } = await bob.ju.core().connection.create(subspace);

      t.comment(`tx signature: ${response.signature}`);

      // t.equal(subspaceClient.data.app.toBase58(), testApp.toBase58())


    });

    test('[Subscribe] user Konrad can connect to Subspace 1', async (t: Test) => {

      const subspace = await konrad.ju.core().subspace.get(subspace1);

      // Create new Connection (subscribe to Alice group).
      const { response } = await konrad.ju.core().connection.create(subspace);

      t.comment(`tx signature: ${response.signature}`);

      // t.equal(subspaceClient.data.app.toBase58(), testApp.toBase58())


    });

    test('[Approve] Alice can approve Konrad Subspace subscribtion', async (t: Test) => {

      const konradProfile = await alice.ju.core().profile.get(konradAddress)

      // Update Connection (Approve suscriber).
      const { response } = await alice.ju.core().connection.update(
        konradProfile,
        subspace1,
        true
      );

      t.comment(`tx signature: ${response.signature}`);
    });

  })


  test('[Publications]', async () => {

    test('[Create] it can create Publication1', async (t: Test) => {

      // Upload some metadata containing an image.
      // const subspaceMetadata = alice.subspaceJson;
      // const { uri, assetUris, metadata } = await alice.ju.storage().uploadMetadata(subspaceMetadata);

      const uri = 'test-uri';

      // Create a new App Profile.
      const { publication } = await alice.ju.core().publication.create(
        {
          app: testApp,
          metadataUri: uri,
          externalProcessors: {
            collectingProcessor: null,
            referencingProcessor: null,
          }
        }
      );

      // console.log('Publication data: :>> ', publication.data);

      t.equal(publication.app.toBase58(), testApp.toBase58())

      // profileClient.metadataJson()

      spok(t, publication, {
        $topic: 'Publication test',
        isMirror: false,
        isReply: false,
        subspace: null,
        contentType: 0,
        tag: null,
        metadataUri: uri,
        authority: alice.ju.identity().publicKey,
        collectingProcessor: null,
      });

      publication1 = publication.address;

    });

    test('[Create] it can create Publication1 Reply', async (t: Test) => {

      const uri = 'reply-test-uri';

      // Create a new App Profile.
      const { publication } = await bob.ju.core().publication.create(
        {
          app: testApp,
          isReply: true,
          target: publication1,
          metadataUri: uri,
          externalProcessors: {
            collectingProcessor: null,
            referencingProcessor: null,
          }
        }
      );

      // console.log('Publication data: :>> ', publication.data);

      t.equal(publication.app.toBase58(), testApp.toBase58());
      t.equal(publication.targetPublication?.toBase58(), publication1.toBase58())

      // profileClient.metadataJson()

      spok(t, publication, {
        $topic: 'Publication test',
        isMirror: false,
        isReply: true,
        subspace: null,
        contentType: 0,
        tag: null,
        metadataUri: uri,
        authority: bob.ju.identity().publicKey,
        collectingProcessor: null,
      });

    });

    test('[Create] it can create Publication2 into Subspace1', async (t: Test) => {

      const uri = 'http://example.com/subspace-publication-2-uri';
      const tag = 'solanax100';

      // Create a new App Profile.
      const { publication } = await alice.ju.core().publication.create(
        {
          app: testApp,
          metadataUri: uri,
          subspace: subspace1,
          tag,
          externalProcessors: {
            collectingProcessor: null,
            referencingProcessor: null,
          }
        }
      );

      publication2 = publication.address;

      // console.log('Publication data: :>> ', publication);

      t.equal(publication.address.toBase58(), publication2.toBase58(), 'Publication public key');
      t.equal(publication.app.toBase58(), testApp.toBase58(), 'App');
      t.equal(publication.subspace?.toBase58(), subspace1.toBase58(), 'Subspace');
      t.equal(publication.metadataUri, uri, 'URI');
      t.equal(publication.tag, tag, 'Tag');


    });

  })


  test('[Reactions]', async () => {

    test('[Create] Bob can create Reaction to Publication1', async (t: Test) => {

      // Get Publication instance
      const publication = await bob.ju.core().publication.get(publication1);

      // Create a new Reaction
      const { response } = await bob.ju.core().reaction.create(
        publication,
        0,
      );

      t.comment(`Response - ${response.signature}`);

    });

    test('[Create] Konrad can create Reaction to Publication1', async (t: Test) => {

      // Get Publication instance
      const publication = await konrad.ju.core().publication.get(publication1);

      // Create a new Reaction
      const { response } = await konrad.ju.core().reaction.create(
        publication,
        0,
      );

      t.comment(`Response - ${response.signature}`);

    });

  });


  test('[Reports]', async () => {

    test('[Create] Konrad can create Report to Publication1', async (t: Test) => {

      // Create a new Reaction
      const { response } = await bob.ju.core().report.create(
        {
          app: testApp,
          target: publication1,
          reportType: 0,
          notificationString: publicationReportString
        }
      );

      t.comment(`Response - ${response.signature}`);

    });

    test('[Create] Alice can create Report to Konrads Profile', async (t: Test) => {

      // Create a new Reaction
      const { response } = await alice.ju.core().report.create(
        {
          app: testApp,
          target: konrad.ju.core().pdas().profile({ app: testApp }),
          reportType: 1,
          notificationString: profileReportString
        }
      );

      t.comment(`Response - ${response.signature}`);

    });

    test('[Create] Bob can create Report to Alice Group', async (t: Test) => {

      // Create a new Reaction
      const { response } = await alice.ju.core().report.create(
        {
          app: testApp,
          target: subspace1,
          reportType: 0,
          notificationString: subspaceReportString
        }
      );

      t.comment(`Response - ${response.signature}`);

    });

  });


  test('[Query Entities]', async () => {

    test('[Fetch] it can find single Application Profile with Metadata', async (t: Test) => {

      // Fetch Profile.
      const profile = await alice.ju.core().profile.get(aliceAddress);

      t.comment(`Profile: ${profile.address}`);

      // spok(t, profileClient.data, {
      //   $topic: 'Profile 1 test',
      //   alias: alice.name,
      //   metadataUri: uri,
      //   statusText: alice.status,
      //   authority: alice.ju.identity().publicKey,
      //   connectingProcessor: null,
      // });
    });

    test('[Query] it can find all Application Profiles', async (t: Test) => {

      const profiles = await alice.ju.core().profile.keysByFilter(
        {
          app: testApp
        }
      );

      t.equal(profiles.length, 3);
      // console.log(profiles);

    });

    test('[Query] it can find all Subspace 1 (Alice group) subscribers', async (t: Test) => {

      const subspace = await konrad.ju.core().subspace.get(subspace1);

      // Create a new App Profile.
      const profiles = await alice.ju.core().profile.findByConnectionTarget(
        {
          app: testApp,
          target: subspace.address
        }
      );

      t.equal(profiles.length, 2);
      // console.log(profiles);
    });

    test('[Query] it can find Approved Subspace 1 (Alice group) subscribers', async (t: Test) => {

      // Create a new App Profile.
      const profiles = await alice.ju.core().profile.findByConnectionTarget(
        {
          app: testApp,
          target: subspace1,
          approved: true
        }
      );

      t.equal(profiles.length, 1);
      t.equal(profiles[0].toBase58(), konrad.ju.core().pdas().profile({ app: testApp }).toBase58());

    });

    test('[Query] it can find all Alice friends (connections as initializer)', async (t: Test) => {

      // Create a new App Profile.
      const profiles = await alice.ju.core().profile.findByConnectionInitializer(
        {
          app: testApp,
          initializer: alice.ju.core().pdas().profile({ app: testApp })
        }
      );

      t.equal(profiles.length, 2);
      // console.log(profiles);
    });

    test('[Fetch] it can find Entity by Alias name', async (t: Test) => {

      // Fetch Profile.
      const result = await konrad.ju.core().common.findEntityByAliasValue(
        testApp,
        konrad.name
      );

      t.comment(`Entity - ${result ? result.address : 'not found'}`);
      t.equal(result?.alias, konrad.name)

      // spok(t, result?.data, {
      //   $topic: 'Entity test',
      //   alias: alice.name,
      //   authority: alice.ju.identity().publicKey,
      // });
    });

    test('[Fetch] it can NOT find Entity by nonexistent Alias name', async (t: Test) => {

      // Fetch Profile.
      const result = await konrad.ju.core().common.findEntityByAliasValue(
        testApp,
        'nonexistalias'
      );

      t.comment(`Entity - ${result ? result.address : 'not found'}`);
      t.equal(result, null)
    });

    test('[Reactions Fetch] it can find All Publication reactions', async (t: Test) => {

      // Fetch Upvote (reactionType = 0) Reactions.
      const reactions = await konrad.ju.core().reaction.keysByFilter(
        {
          app: testApp,
          target: publication1,
          reactionType: 0
        }
      );

      // console.log('reactions :>> ', reactions);

      t.equal(reactions.length, 2)
    });

  });

})