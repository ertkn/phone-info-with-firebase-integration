import firestore from '@react-native-firebase/firestore';

//post with individual
export async function pushNetworkInfo(documentID, networkInfoLOG) {
  const ref = firestore().collection('UserNetworkUsage');

  await ref
    .doc(documentID)
    .get()
    .then(documentSnapshot => {

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

//post with batch,transaction
export async function postWithBatch(documentID, networkInfoLOG = []) {
  async function massUpdateDeviceInfo() {

    const ref = await firestore()
      .collection('UserNetworkUsage')
      .doc(documentID);

    const isDocExist = await ref.get();
    const batch = firestore().batch();

    networkInfoLOG.forEach(doc => {
      // console.log('doc --> ', doc);
      if (!isDocExist.exists) {
        batch.set(
          ref,
          {netInfoJSON: firestore.FieldValue.arrayUnion(doc)},
          {merge: true},
        );
      } else {
        batch.update(ref, {netInfoJSON: firestore.FieldValue.arrayUnion(doc)});
      }
    });

    return batch.commit();
  }

  massUpdateDeviceInfo().then(() =>
    console.log('All NetLOGs posted in a single batch operation.'),
  );
}
