import React from 'react';
import {StyleSheet, View} from 'react-native';
import Route from './src/navigation/Route';

const App = () => {
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
  },
});

export default App;
