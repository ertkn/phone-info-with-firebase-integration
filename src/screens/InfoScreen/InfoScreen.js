import React, {useState, useEffect} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {SafeAreaView} from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';
import remoteConfig from '@react-native-firebase/remote-config';
import literals from '../../constants/literals';
import {refreshConfig, fetchConfig} from '../../services/remoteConfigServices';
import {logToFile} from '../../components/FileManage';
import {getDeviceData, getNetType} from '../../components/GetNetType';
import {assignAndGetDate, assignDate} from '../../components/AssignAndGetDate';

const InfoScreen = props => {
  const [deviceInfo, setDeviceInfo] = useState({});
  let netInfoInterval;
  let netInfoTimeout;
  let [dataFromLogFile, setDataFromLogFile] = useState([]); //display if log exist to the bottom of screen
  let isPushConfig = true;
  let isLogging = false;

  let date = new Date();
  let days = new Date().getDate();
  let hours = new Date().getHours();
  let minutes = new Date().getMinutes();
  let seconds = new Date().getSeconds();

  //NetInfo framework listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      getDeviceData(deviceInfo, setDeviceInfo);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  //Log device information to local storage and post Firebase-Firestore
  useEffect(() => {
    logDeviceData();

    return () => {
      clearIntervalFunction();
    };
  }, []);

  //subscription to Firebase Remote Config Server
  useEffect(() => {
    FetchConfig();
    let remoteConfigListenerUnsubscriber = remoteConfig().onConfigUpdated(
      (event, error) => {
        if (!error) {
          console.log(
            'remote-config listener subscription: ' + event.updatedKeys,
          );
          RefreshConfig();
        } else {
          console.log('remote-config listener error: ' + JSON.stringify(error));
          RefreshConfig();
        }
      },
    );

    return () => {
      remoteConfigListenerUnsubscriber();
    };
  }, []);

  logDeviceData = async () => {
    //get initial date beginning of the function
    await assignAndGetDate(date, days, hours, minutes, seconds);

    let residue = minutes % literals.modNumber;

    // Setting Timeout to sync modNum with time-range. For example:
    //Current time --> 11:58:32, then time out stay still till 11:59:00, (11:59:00-11:58:32 = 28 second)
    netInfoTimeout = await setTimeout(async () => {
      clearTimeout(netInfoTimeout);

      //initial fetching Network and Device info to logging console
      //because interval start with timeouts ending.
      await getNetInfoJSON();

      // Interval that execute per modNum time-range
      netInfoInterval = setInterval(
        await getNetInfoJSON,
        literals.modNumber * literals.timeScale * literals.msecFactor,
      );

      //Setting timeout until least no-residue number (t --> [t + (modulo_number - residue)])
    }, (literals.modNumber - residue) * literals.timeScale * literals.msecFactor - seconds * literals.msecFactor);
  };

  //fetch config if needed
  async function FetchConfig() {
    isPushConfig = await fetchConfig();
    console.log('Fetch isPushConfig --> ', isPushConfig);
  }

  //refresh config if needed
  async function RefreshConfig() {
    isPushConfig = await refreshConfig();
    console.log('Refresh isPushConfig --> ', isPushConfig);
  }

  const getNetInfoJSON = async () => {
    let netInfoJSON = {};

    //Stores Device Network Info like JSON Object
    try {
      netInfoJSON['Date'] = await moment().format('YYYY-MM-DD hh:mm:ss');
      netInfoJSON['Network type'] = await getNetType();
      netInfoJSON['Unique ID'] = await DeviceInfo.getUniqueId();
      if ((await getNetType()) === 'wifi') {
        netInfoJSON['Network MAC'] = (await NetInfo.fetch()).details.bssid;
      }

      //To store json object
      await logToFile(netInfoJSON, isLogging, isPushConfig);

      // for display net.conn log in the bottom of screen
      setDataFromLogFile(prev => [...prev, netInfoJSON]);
    } catch (error) {
      console.log('error: ', error);
    }
    await assignDate(date, days, hours, minutes, seconds, false);
  };

  async function clearIntervalFunction() {
    console.log('netInfoInterval: ', netInfoInterval);
    console.log('netInfoTimeout: ', netInfoTimeout);
    clearInterval(netInfoInterval);
    clearTimeout(netInfoTimeout);
  }

  return (
    <SafeAreaView style={styles.instructions}>
      <View style={{flex: 8}}>
        <FlatList
          data={Object.keys(deviceInfo)}
          renderItem={({item}) => {
            return (
              <View style={styles.txtBoxStyle}>
                <Text style={styles.primaryTxtStyle}>{item}</Text>
                <Text style={styles.secondaryTxtStyle}>{deviceInfo[item]}</Text>
              </View>
            );
          }}
        />
      </View>
      <View style={styles.logContainer}>
        {dataFromLogFile && dataFromLogFile.length ? (
          <FlatList
            data={dataFromLogFile}
            renderItem={({item, idx}) => {
              return (
                <View style={styles.txtBoxStyle}>
                  <Text style={styles.primaryTxtStyle}>
                    {'Date: ' +
                      item['Date'] +
                      '\nNetwork type: ' +
                      item['Network type'] +
                      '\nUnique ID: ' +
                      item['Unique ID'] +
                      '\nMAC: ' +
                      item['Network MAC']}
                  </Text>
                </View>
              );
            }}
          />
        ) : (
          <View style={styles.txtBoxStyle}>
            <Text style={styles.primaryTxtStyle}>
              {'PLACEHOLDER\nNetwork Connection will update and display here with each ' +
                literals.timeScale * literals.modNumber +
                ' seconds...'}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
export default InfoScreen;

const styles = StyleSheet.create({
  logContainer: {
    flex: 1.25,
    backgroundColor: '#eed3d3',
    shadowColor: '#000000',
  },
  instructions: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  primaryTxtStyle: {
    textTransform: 'none',
    fontSize: 16,
    color: '#000000',
    fontWeight: '400',
    alignItems: 'flex-start',
    paddingLeft: '17.5%',
    marginTop: '1.1%',
    marginBottom: '0.25%',
  },
  secondaryTxtStyle: {
    textTransform: 'none',
    fontSize: 14,
    color: '#000000',
    fontWeight: '300',
    alignItems: 'flex-start',
    paddingLeft: '17.5%',
    marginBottom: '1.1%',
    marginTop: '0.25%',
  },
  txtBoxStyle: {
    marginVertical: '2.5%',
    marginHorizontal: '0%',
  },
});
