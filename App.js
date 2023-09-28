import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Route from './src/navigation/Route';
import remoteConfig from '@react-native-firebase/remote-config';
import {fetchConfig} from './src/services/remoteConfigServices';

const App = () => {
  async function FetchConfig() {
    await fetchConfig();
  }

  useEffect(() => {
    // FetchConfig();
  }, []);

  return (
    <View style={styles.sectionContainer}>
      <Route />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: '#55388a',
    // marginTop: 32,
    // paddingHorizontal: 24,
  },
});

export default App;
