import firestore from '@react-native-firebase/firestore';

export async function pushNetworkInfo(documentID, networkInfoLOG) {
  const ref = firestore().collection('UserNetworkUsage');
  const objectName = 'networkInfoLOG';

  await ref
    .doc(documentID)
    .get()
    .then(documentSnapshot => {
      // console.log('Document exists: ', documentSnapshot.exists);

      if (documentSnapshot.exists) {
        documentSnapshot.ref
          .update({
            netInfoJSON: firestore.FieldValue.arrayUnion(networkInfoLOG),
          })
          .then(() => {
            console.log('NEW NetLog updated!');
          })
          .catch(error => {
            console.log('error: ', error);
          });
      } else {
        documentSnapshot.ref
          .set({netInfoJSON: firestore.FieldValue.arrayUnion(networkInfoLOG)})
          .then(() => {
            console.log('NEW NetLog added!');
          })
          .catch(error => {
            console.log('error: ', error);
          });
      }
    });
}

export async function postWithBatch(documentID, networkInfoLOG = []) {
  async function massDeleteUsers() {
    const ref = await firestore()
      .collection('UserNetworkUsage')
      .doc(documentID);
    const isDocExist = await ref.get();
    const batch = firestore().batch();

    networkInfoLOG.forEach(doc => {
      console.log('doc --> ', doc);
      if (!isDocExist.exists) {
        // console.log('IS DOC EXIST: ', isDocExist.exists)
        batch.set(
          ref,
          {netInfoJSON: firestore.FieldValue.arrayUnion(doc)},
          {merge: true},
        );
      } else {
        // console.log('IS DOC EXIST: ', isDocExist.exists)
        batch.update(ref, {netInfoJSON: firestore.FieldValue.arrayUnion(doc)});
      }
    });

    /*     ref.doc(documentID).then(documentSnapshot => {
    });
 */
    return batch.commit();
  }

  massDeleteUsers().then(() =>
    console.log('All NetLOGs posted in a single batch operation.'),
  );
}
