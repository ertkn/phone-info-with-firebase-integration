import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import navStrings from '../../constants/navStrings';
import CustomTouchableOpacity from '../../components/touchableOpacity';
import literals from '../../constants/literals';
import {getRemoteValueString} from '../../services/remoteConfigServices';

const InnerComponent = () => {
  return (
    <View style={styles.txtBoxStyle}>
      <Text style={styles.titleStyle}>
        {literals.HOME_SCREEN_LIST_BUTTON}{' '}
        {getRemoteValueString('is_push_firebase')}
      </Text>
    </View>
  );
};

navFunc = nav => {
  console.log('routing to the PHONE INFO PAGE...');
  nav.navigate(navStrings.INFO);
};

const HomeScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.pageContainer}>
      <CustomTouchableOpacity
        activeOpacity={0.8}
        onPress={() => navFunc(navigation)}
        styles={styles.buttonStyle}
        children={InnerComponent()}></CustomTouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  titleStyle: {
    color: '#20232a',
    paddingVertical: '2%',
    paddingHorizontal: '2%',
    borderWidth: 3,
    borderColor: '#20232a',
    borderRadius: 20,
    backgroundColor: '#bcd6e0',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
  txtBoxStyle: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  buttonStyle: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
});

export default HomeScreen;
