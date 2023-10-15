import spok from 'spok';
import test, { Test } from 'tape';
import { PublicKey } from '@solana/web3.js';
import {
  killStuckProcess,
  ju
} from '../../helpers';
import { toBirthDate, toJuFile } from '@/index';

killStuckProcess();

test('[Setup]', async () => {

  const jp = await ju();

  /** App */
  const appName = 'testapp'
  const appAuthority = jp.identity().publicKey;

  const testApp = jp.core().pdas().app({ appName });

  /** Profiles */
  const alice = {
    ju: await ju(),
    name: 'alice',
    lastName: 'Smith',
    birthdate: [1990, 1, 21] as [number, number, number],
    status: '',
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
    lastName: 'Johnson',
    birthdate: [1986, 2, 23] as [number, number, number],
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
    lastName: 'Mikhelson',
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
      } = await jp.core().apps().createApp(
        {
          appName,
          data: {
            metadataUri: uri,

            profileMetadataRequired: true,
            subspaceMetadataRequired: true,

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
        appName,
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

      // const updatedUri = 'https://example.com/app-updated-uri'

      const app = await jp.core().apps().getApp(testApp);

      // Update an existing App.
      const updateResult = await jp.core().apps().updateApp(
        app,
        {
          // metadataUri: updatedUri,
          profileDeleteAllowed: true,
          subspaceDeleteAllowed: true,
          publicationDeleteAllowed: true,
        }
      );

      spok(t, updateResult.app, {
        $topic: 'App test',
        appName,
        authority: appAuthority,
        // metadataUri: updatedUri,
        profileDeleteAllowed: true,
        subspaceDeleteAllowed: true,
        publicationDeleteAllowed: true,
      });
    });
  })

  test('[Profiles]', async () => {

    const updatedAlias1 = 'updated_alias1';
    const updatedAlias2 = 'updated_alias2';

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
      const { profile } = await alice.ju.core().profiles(testApp).createProfile(
        {
          data: {
            alias: alice.name,
            metadataUri: uri,
            statusText: alice.status,
            gender: 1,
            firstName: alice.name,
            lastName: alice.lastName,
            birthDate: toBirthDate(...alice.birthdate),
            countryCode: 0,
            regionCode: 0,
            cityCode: 0,
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

      t.equal(profile.firstName, alice.name);
      t.equal(profile.lastName, alice.lastName);

    });

    test('[Create] it can create Profile 2 (Bob)', async (t: Test) => {

      // Upload some metadata containing an image.
      const { uri } = await bob.ju.storage().uploadMetadata(bob.json);
      // console.log('Bob uri :>> ', uri);

      // Create a new App Profile.
      const { profile } = await bob.ju.core().profiles(testApp).createProfile(
        {
          data: {
            alias: bob.name,
            metadataUri: uri,
            statusText: bob.status,
            gender: 0,
            firstName: bob.name,
            lastName: bob.lastName,
            birthDate: toBirthDate(...bob.birthdate),
            countryCode: 0,
            regionCode: 0,
            cityCode: 0,
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
      const { profile } = await konrad.ju.core().profiles(testApp).createProfile(
        {
          data: {
            alias: konrad.name,
            metadataUri: uri,
            statusText: konrad.status,
            gender: 0,
            firstName: konrad.name,
            lastName: konrad.lastName,
            birthDate: toBirthDate(...konrad.birthdate),
            countryCode: 0,
            regionCode: 0,
            cityCode: 0,
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

      const aliceProfile = await alice.ju.core().profiles(testApp).getProfile(aliceAddress);

      // Delete alias
      const result = await alice.ju.core().profiles(testApp).updateProfile(aliceProfile, { alias: null });

      t.equal(result.profile.alias, null)
    });


    test('[Update] it can register Alias for Profile 1 (Alice)', async (t: Test) => {

      const profile = await alice.ju.core().profiles(testApp).getProfile(aliceAddress)

      // Update Status
      const result = await alice.ju.core().profiles(testApp).updateProfile(profile, { alias: updatedAlias1 })

      spok(t, result.profile, {
        $topic: 'Profile 1 Update test',
        alias: updatedAlias1,
      });
    });


    test('[Update] it can update status text and Alias for Profile 1 (Alice)', async (t: Test) => {

      const updatedStatusText = 'updated status text';

      const profile = await alice.ju.core().profiles(testApp).getProfile(aliceAddress)

      // Update Status
      const result = await alice.ju.core().profiles(testApp).updateProfile(
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

      // const konradProfile = await bob.ju.core().app(testApp).getProfile(konradAddress)

      // Bob create new Connection with Konrad.
      const { response } = await bob.ju.core().connections(testApp).createConnection(konradAddress);

      t.comment(`tx signature: ${response.signature}`);
    });

    test('[Connect] user Alice can connect to Konrad', async (t: Test) => {

      // const konradProfile = await alice.ju.core().app(testApp).getProfile(konradAddress)

      // Create new Connection (subscribe to Alice group).
      const { response } = await alice.ju.core().connections(testApp).createConnection(konradAddress);

      t.comment(`tx signature: ${response.signature}`);
    });

    test('[Connect] user Alice can connect to Bob', async (t: Test) => {

      // const bobProfile = await alice.ju.core().profile.get(bobAddress)

      // Create new Connection (subscribe to Alice group).
      const { response } = await alice.ju.core().connections(testApp).createConnection(bobAddress);

      t.comment(`tx signature: ${response.signature}`);
    });

    test('[Approve] Konrad can approve Alice Connection', async (t: Test) => {

      // const aliceProfile = await bob.ju.core().profile.get(aliceAddress)

      // Create new Connection (subscribe to Alice group).
      const { response } = await konrad.ju.core().connections(testApp).updateConnection(
        aliceAddress,
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
      const { subspace } = await alice.ju.core().subspaces(testApp).createSubspace(
        {
          data: {
            alias: alice.subspaceAlias,
            name: subspace1Name,
            publishingPermission: 0,
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

      t.equal(subspace.name, subspace1Name);

      subspace1 = subspace.address;

    });

    test('[Subscribe] user Bob can connect to Subspace 1', async (t: Test) => {

      // const subspace = await bob.ju.core().subspace.get(subspace1);

      // Create new Connection (subscribe to Alice group).
      const { response } = await bob.ju.core().connections(testApp).createConnection(subspace1);

      t.comment(`tx signature: ${response.signature}`);

      // t.equal(subspaceClient.data.app.toBase58(), testApp.toBase58())


    });

    test('[Subscribe] user Konrad can connect to Subspace 1', async (t: Test) => {

      // const subspace = await konrad.ju.core().subspace.get(subspace1);

      // Create new Connection (subscribe to Alice group).
      const { response } = await konrad.ju.core().connections(testApp).createConnection(subspace1);

      t.comment(`tx signature: ${response.signature}`);

      // t.equal(subspaceClient.data.app.toBase58(), testApp.toBase58())


    });

    test('[Approve] Alice can approve Konrad Subspace 1 subscribtion', async (t: Test) => {

      // const konradProfile = await alice.ju.core().app(testApp).getProfile(konradAddress)

      // Update Connection (Approve suscriber).
      const { response } = await alice.ju.core().connections(testApp).updateConnection(
        konradAddress,
        subspace1,
        true
      );

      t.comment(`tx signature: ${response.signature}`);
    });


    test('[Management Create] Alice can add Konrad as Subspace 1 Manager with *Publisher* access', async (t: Test) => {

      const { response } = await alice.ju.core().subspaces(testApp).addManager(
        subspace1,
        konradAddress,
        0 // 0 - Publisher,  1 - Admin
      );

      t.comment(`tx signature: ${response.signature}`);
    });

    test('[Management Create] Alice can add Bob as Subspace Manager with *Publisher* access', async (t: Test) => {

      const { response } = await alice.ju.core().subspaces(testApp).addManager(
        subspace1,
        bobAddress,
        0 // 0 - Publisher, 1 - Admin
      );

      t.comment(`tx signature: ${response.signature}`);
    });

    test('[Management Update] Alice can update Bob access as Subspace Manager with *Admin* access', async (t: Test) => {

      const { response } = await alice.ju.core().subspaces(testApp).updateManager(
        subspace1,
        bobAddress,
        1 // 0 - Publisher, 1 - Admin
      );

      t.comment(`tx signature: ${response.signature}`);
    });

    test('[Management Query] Alice can find all Subspace Managers', async (t: Test) => {

      const managers = await alice.ju.core().subspaces(testApp).findManagers(
        {
          subspace: subspace1
        }
      );

      t.comment(`Managers length: ${managers.length}`);

      t.equal(managers.length, 2);
    });

    test('[Management Delete] Alice can delete Bob from Subspace Managers', async (t: Test) => {

      const { response } = await alice.ju.core().subspaces(testApp).deleteManager(
        subspace1,
        bobAddress
      );

      t.comment(`tx signature: ${response.signature}`);
    });

    test('[Management Query] Alice can find all Subspace Managers', async (t: Test) => {

      const managers = await alice.ju.core().subspaces(testApp).findManagers(
        {
          subspace: subspace1
        }
      );

      t.comment(`Managers length: ${managers.length}`);

      t.equal(managers.length, 1);
    });

  })


  test('[Publications]', async () => {

    test('[Create] it can create Publication1', async (t: Test) => {

      // Upload some metadata containing an image.
      // const subspaceMetadata = alice.subspaceJson;
      // const { uri, assetUris, metadata } = await alice.ju.storage().uploadMetadata(subspaceMetadata);

      const uri = 'test-uri';

      // Create a new App Profile.
      const { publication } = await alice.ju.core().publications(testApp).createPublication(
        {
          isEncrypted: true,
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
        subspace: PublicKey.default,
        contentType: 0,
        // tag: '',
        metadataUri: uri,
        authority: alice.ju.identity().publicKey,
        collectingProcessor: null,
      });

      publication1 = publication.address;

    });

    test('[Create] it can create Publication1 Reply', async (t: Test) => {

      const uri = 'reply-test-uri';

      // Create a new App Profile.
      const { publication } = await bob.ju.core().publications(testApp).createPublication(
        {
          isReply: true,
          target: publication1,
          isEncrypted: true,
          metadataUri: uri,
          externalProcessors: {
            collectingProcessor: null,
            referencingProcessor: null,
          }
        }
      );

      t.comment(JSON.stringify(publication, null, 4));

      t.equal(publication.app.toBase58(), testApp.toBase58());
      t.equal(publication.targetPublication?.toBase58(), publication1.toBase58())

      // profileClient.metadataJson()

      spok(t, publication, {
        $topic: 'Publication test',
        isMirror: false,
        isReply: true,
        subspace: PublicKey.default,
        contentType: 0,
        // tag: null,
        metadataUri: uri,
        authority: bob.ju.identity().publicKey,
        collectingProcessor: null,
      });

    });

    test('[Create] it can create Publication2 into Subspace1', async (t: Test) => {

      const uri = 'http://example.com/subspace-publication-2-uri';
      const tag = 'solanax100';

      // Create a new App Profile.
      const { publication } = await alice.ju.core().publications(testApp).createPublication(
        {
          isEncrypted: true,
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

      t.comment(JSON.stringify(publication, null, 4));

      t.equal(publication.address.toBase58(), publication2.toBase58(), 'Publication public key');
      t.equal(publication.app.toBase58(), testApp.toBase58(), 'App');
      t.equal(publication.subspace?.toBase58(), subspace1.toBase58(), 'Subspace');
      t.equal(publication.metadataUri, uri, 'URI');

      t.equal(publication.tag, tag, 'Tag');


    });


    test('[Query] it can query all Publications', async (t: Test) => {

      const publications = await bob.ju.core().publications(testApp).findPublications(
        {
          app: testApp
        }
      );

      t.equal(publications.length, 3);

    });

    test('[Query] it can query all Publications by Profile', async (t: Test) => {

      const publications = await bob.ju.core().publications(testApp).findPublications(
        {
          profile: aliceAddress
        }
      );

      t.equal(publications.length, 2);

    });

    test('[Query] it can query all Subspace Publications', async (t: Test) => {

      const publications = await bob.ju.core().publications(testApp).findPublications(
        {
          subspace: subspace1
        }
      );

      t.equal(publications.length, 1);

    });

    test('[Query] it can query all Publication1 Reply', async (t: Test) => {

      const publications = await bob.ju.core().publications(testApp).findPublications(
        {
          // isEncrypted: true,
          isReply: true,
          targetPublication: publication1
        }
      );

      t.equal(publications.length, 1);

    });

  })


  test('[Reactions]', async () => {

    test('[Create] Bob can create Reaction to Publication1', async (t: Test) => {

      // Get Publication instance
      // const publication = await bob.ju.core().app(testApp).getPublication(publication1);

      // Create a new Reaction
      const { response } = await bob.ju.core().reactions(testApp).createReaction(
        publication1,
        0,
      );

      t.comment(`Response - ${response.signature}`);

    });

    test('[Create] Konrad can create Reaction to Publication1', async (t: Test) => {

      // Get Publication instance
      // const publication = await konrad.ju.core().app(testApp).getPublication(publication1);

      // Create a new Reaction
      const { response } = await konrad.ju.core().reactions(testApp).createReaction(
        publication1,
        0,
      );

      t.comment(`Response - ${response.signature}`);

    });

  });


  test('[Reports]', async () => {

    test('[Create] Konrad can create Report to Publication1', async (t: Test) => {

      // Create a new Reaction
      const { response } = await bob.ju.core().reports(testApp).createReport(
        {
          target: publication1,
          reportType: 0,
          notificationString: publicationReportString
        }
      );

      t.comment(`Response - ${response.signature}`);

    });

    test('[Create] Alice can create Report to Konrads Profile', async (t: Test) => {

      // Create a new Reaction
      const { response } = await alice.ju.core().reports(testApp).createReport(
        {
          target: konrad.ju.core().pdas().profile({ app: testApp }),
          reportType: 1,
          notificationString: profileReportString
        }
      );

      t.comment(`Response - ${response.signature}`);

    });

    test('[Create] Bob can create Report to Alice Group', async (t: Test) => {

      // Create a new Report
      const { response } = await alice.ju.core().reports(testApp).createReport(
        {
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
      const profile = await alice.ju.core().profiles(testApp).getProfile(aliceAddress);

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

      const profiles = await alice.ju.core().profiles(testApp).findProfiles(
        {
          // all over the App
        }
      );

      t.equal(profiles.length, 3);
      // console.log(profiles);

    });

    test('[Query] it can find all Application Subspaces', async (t: Test) => {

      const profiles = await alice.ju.core().subspaces(testApp).findSubspaces(
        {
          // all over the App
        }
      );

      t.equal(profiles.length, 1);
      // console.log(profiles);

    });

    test('[Query] it can find all Subspace 1 (Alice group) subscribers', async (t: Test) => {

      // const subspace = await konrad.ju.core().subspaces(testApp).getSubspace(subspace1);

      // Create a new App Profile.
      const profiles = await alice.ju.core().profiles(testApp).findProfilesAsKeysByConnectionTarget(subspace1);

      t.equal(profiles.length, 2);
      // console.log(profiles);
    });

    test('[Query] it can find Approved Subspace 1 (Alice group) subscribers', async (t: Test) => {

      // Create a new App Profile.
      const profiles = await alice.ju.core().profiles(testApp).findProfilesAsKeysByConnectionTarget(subspace1, true);

      t.equal(profiles.length, 1);
      t.equal(profiles[0].toBase58(), konrad.ju.core().pdas().profile({ app: testApp }).toBase58());

    });

    test('[Query] it can find all Alice friends (connections as initializer)', async (t: Test) => {

      // Query
      const profiles = await alice.ju.core().profiles(testApp).findProfilesAsKeysByConnectionInitializer(aliceAddress);

      t.equal(profiles.length, 2);
      // console.log(profiles);
    });

    test('[Query] it can find all Profiles `30 age old + - 10 years` (connections as initializer)', async (t: Test) => {
      // Query
      const profiles = await alice.ju.core().profiles(testApp).findProfilesAsKeys(
        {
          age10yearsInterval: 30
        }
      );

      t.equal(profiles.length, 3);
      // console.log(profiles);
    });

    test('[Query] it can find all Profiles `27 age old + - 5 years` (connections as initializer)', async (t: Test) => {
      // Query
      const profiles = await alice.ju.core().profiles(testApp).findProfilesAsKeys(
        {
          age5yearsInterval: 36
        }
      );

      t.equal(profiles.length, 1);
      // console.log(profiles);
    });

    test('[Fetch] it can find Entity by Alias name', async (t: Test) => {

      // Fetch Profile.
      const result = await konrad.ju.core().utils(testApp).findEntityByAliasValue(konrad.name);

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
      const result = await konrad.ju.core().utils(testApp).findEntityByAliasValue('nonexistalias');

      t.comment(`Entity - ${result ? result.address : 'not found'}`);
      t.equal(result, null)
    });

    test('[Reactions Fetch] it can find All Publication reactions', async (t: Test) => {

      // Fetch Upvote (reactionType = 0) Reactions.
      const reactions = await konrad.ju.core().reactions(testApp).findReactionsAsKeys(
        {
          target: publication1,
          reactionType: 0
        }
      );

      // console.log('reactions :>> ', reactions);

      t.equal(reactions.length, 2)
    });

    test('[Query] it can find All Publication reactions that happens in 3 days', async (t: Test) => {
      // Query
      const profiles = await alice.ju.core().reactions(testApp).findReactionsAsKeys(
        {
          target: publication1,
          isIn3Days: true
        }
      );

      t.equal(profiles.length, 2);
    });

  });



})