import remoteConfig from '@react-native-firebase/remote-config';
import literals from '../constants/literals';

export const fetchConfig = async () => {
  await remoteConfig().setDefaults({is_push_firebase: false});

  await remoteConfig().setConfigSettings({
    isDeveloperModeEnabled: __DEV__,
    minimumFetchIntervalMillis: literals.msecFactor * literals.timeScale,
    fetchTimeMillis: 10000,
  });

  await remoteConfig().fetch(0);
  await remoteConfig()
    .fetchAndActivate()
    .then(fetchedRemotely => {
      if (fetchedRemotely) {
        console.log(
          'Configs were retrieved from the backend and activated. %o',
          remoteConfig()?.getValue('is_push_firebase').asString(),
        );
      } else {
        console.log(
          'No configs were fetched from the backend, and the local' +
            'configs were already activated %o',
          remoteConfig()?.getValue('is_push_firebase').asString(),
        );
      }
    });
  let confVal = getRemoteValueBoolean('is_push_firebase');
  return confVal;
};

export const refreshConfig = async () => {
  await remoteConfig().fetchAndActivate();
  let confVal = getRemoteValueBoolean('is_push_firebase');
  return confVal;
};

export const getRemoteValueString = key =>
  remoteConfig()?.getValue('is_push_firebase').asString();

export const getRemoteValueBoolean = key =>
  remoteConfig()?.getValue('is_push_firebase').asBoolean();

export async function actionFetchRemoteConfig() {
  try {
    await remoteConfig().setDefaults({is_push_firebase: 'true'});

    await remoteConfig().setConfigSettings({
      isDeveloperModeEnabled: __DEV__,
      minimumFetchIntervalMillis: literals.msecFactor * literals.timeScale,
      fetchTimeMillis: 10000,
    });
    await remoteConfig().fetch();
    const activated = remoteConfig().activate();
    // const activated = await remoteConfig.remoteConfig().fetchAndActivate();

    if (activated) {
      let confVal = remoteConfig().getValue('is_push_firebase').asString();
      console.log('confval', confVal);
      return confVal;
    } else {
    }
  } catch (err) {}
}

export async function getRealTimeConfig() {
  let remoteConfigListenerUnsubscriber = await remoteConfig().onConfigUpdated(
    (event, error) => {
      if (error !== null) {
        console.log(
          'remote-config listener subscription error: ' + JSON.stringify(error),
        );
      } else {
        console.log('remote-config updated keys: ' + JSON.stringify(event));

        remoteConfig().activate();
        // let tempConfig = fetchConfig();
        // return tempConfig;
      }
    },
  );
  remoteConfigListenerUnsubscriber();
}
