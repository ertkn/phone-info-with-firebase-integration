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