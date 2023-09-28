import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import navStrings from '../../constants/navStrings';
import CustomTouchableOpacity from '../../components/touchableOpacity';
import literals from '../../constants/literals';
import {
  actionFetchRemoteConfig,
  getRemoteValueBoolean,
  getRemoteValueString,
  refreshConfig,
  fetchConfig,
  getRealTimeConfig,
} from '../../services/remoteConfigServices';
import remoteConfig from '@react-native-firebase/remote-config';

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

function InnerComponentt(configData) {
  return (
    <View style={styles.txtBoxStyle}>
      <Text style={styles.titleStyle}>
        {literals.HOME_SCREEN_LIST_BUTTON} {configData.toUpperCase()}
      </Text>
    </View>
  );
}



const HomeScreen = ({navigation}) => {
  // const [isPushConfigBool, setIsPushConfigBool] = useState(false);
  // const [isPushConfigStr, setIsPushConfigStr] = useState('placeholder');

  async function FetchConfig() {
    let tempConfig = await fetchConfig();
    // let tempConfigg = await getRealTimeConfig();
    // tempConfig = (String(tempConfig).toLowerCase() === 'true' || 'false');
    setIsPushConfigBool(tempConfig);
    console.log('first', isPushConfigBool);
    /* const tempConfig = getRemoteValueString('is_push_firebase');
    setIsPushConfig(tempConfig);
    console.log(
      'getRemoteValueString:',
      getRemoteValueString('is_push_firebase'),
    );
    console.log('AFTERgetRemoteValueString:', isPushConfig);
    // console.log('tempConfig: ', tempConfig) */
  }

  async function RefreshConfig() {
    let tempConfig = await refreshConfig();
    // tempConfig = (String(tempConfig).toLowerCase() === 'true' || 'false');
    setIsPushConfigBool(tempConfig);
  }

  /*   useEffect(() => {
    // fetchConfig();
    // actionFetchRemoteConfig();
    // setIsPushConfig(actionFetchRemoteConfig());
    // console.log('first', isPushConfig)
    // refreshConfig();
    
    FetchConfig();

    let remoteConfigListenerUnsubscriber = remoteConfig().onConfigUpdated(
      (event, error) => {
        if (error !== null) {
          console.log(
            'remote-config listener subscription error: ' +
              JSON.stringify(event.updatedKeys[0]),
          );
          RefreshConfig();

          // console.log('remote-config updated keys: ' + JSON.stringify(event));
        } else {
          console.log('remote-config updated keys: ' + JSON.stringify(event));
          setIsPushConfigBool(JSON.stringify(event));
          // remoteConfig().activate();
          RefreshConfig();
          // let tempConfig = fetchConfig();
          // return tempConfig;
        }
      },
    );

    return () => {
      remoteConfigListenerUnsubscriber();
    };
    // refreshConfig();
  }, []); */

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
    // padding: 24,
    // backgroundColor: '#9485b1',
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

/* <InnerComponent /> */
/* 
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navFunc(navigation)}
        styles={styles.buttonStyle}>
        <View style={styles.txtBoxStyle}>
          <Text style={styles.titleStyle}>{isPushConfig}</Text>
        </View>
      </TouchableOpacity>
       */
