import React, {useState, useEffect} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  BackHandler,
  Button,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {SafeAreaView} from 'react-native-safe-area-context';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import moment from 'moment';
import RNFS from 'react-native-fs';
import {pushNetworkInfo, postWithBatch} from '../../services/userNetworkInfo';
import remoteConfig from '@react-native-firebase/remote-config';
import literals from '../../constants/literals';
import {refreshConfig, fetchConfig} from '../../services/remoteConfigServices';
import {logToFile} from '../../components/FileManage';
import {getDeviceData, getNetType} from '../../components/GetNetType';
import {
  assignAndGetDate,
  assignDate,
  getDateCurrent,
} from '../../components/AssignAndGetDate';

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

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      getDeviceData(deviceInfo, setDeviceInfo);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    logDeviceData();

    return () => {
      clearIntervalFunction();
    };
  }, []);

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
          // setIsPushConfigBool(JSON.stringify(event));
          RefreshConfig();
        }
      },
    );

    return () => {
      remoteConfigListenerUnsubscriber();
    };
  }, []);

  logDeviceData = async () => {
    await assignAndGetDate(date, days, hours, minutes, seconds);

    let residue = minutes % literals.modNumber;

    // Setting Timeout to sync modNum with time-range
    netInfoTimeout = await setTimeout(async () => {
      clearTimeout(netInfoTimeout);

      await getNetInfoJSON(); //initial fetching Network and Device info to logging console

      netInfoInterval = setInterval(
        await getNetInfoJSON,
        literals.modNumber * literals.timeScale * literals.msecFactor,
      ); // Interval that exec per modNum time-range
    }, (literals.modNumber - residue) * literals.timeScale * literals.msecFactor - seconds * literals.msecFactor); //Setting timeout until least no-residue number (t --> [t + (modulo_number - residue)])
  };

  async function FetchConfig() {
    isPushConfig = await fetchConfig();
    console.log('Fetch isPushConfig --> ', isPushConfig);
  }

  async function RefreshConfig() {
    isPushConfig = await refreshConfig();
    console.log('Refresh isPushConfig --> ', isPushConfig);
  }

  const getNetInfoJSON = async () => {
    let netInfoJSON = {};
    try {
      netInfoJSON['Date'] = await moment().format('YYYY-MM-DD hh:mm:ss');
      netInfoJSON['Network type'] = await getNetType();
      netInfoJSON['Unique ID'] = await DeviceInfo.getUniqueId();
      if ((await getNetType()) === 'wifi') {
        netInfoJSON['Network MAC'] = (await NetInfo.fetch()).details.bssid;
      }

      await logToFile(netInfoJSON, isLogging, isPushConfig);

      setDataFromLogFile(prev => [...prev, netInfoJSON]); // for display net.conn log in the bottom of screen
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
    // padding: 0,
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // shadowOffset: {
    //   height: 25,
    //   // width: 1,
    // },
  },
  instructions: {
    // color: '#333333',
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
    // marginHorizontal: '17.5%',
    // backgroundColor: '#d89fd3',
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
    // marginHorizontal: '17.5%',
    // backgroundColor: '#eccaea',
  },
  txtBoxStyle: {
    // flex:1,
    // width: '100%',
    // alignItems: 'flex-start',
    marginVertical: '2.5%',
    marginHorizontal: '0%',
    // borderRadius: 15,
    // padding: 16,
    // backgroundColor: '#eccaca',
    // backgroundColor: '#cadbec',
  },
});

/*   const getMacAddress = async () => {
  return (await NetInfo.fetch()).details.bssid;
};
*/

/*   assignAndGetDate = async () => {
    await assignDate();
    await getDateCurrent();
  };

  assignDate = () => {
    date = new Date();
    days = new Date().getDate();
    hours = new Date().getHours();
    minutes = new Date().getMinutes();
    seconds = new Date().getSeconds();
  };

  getDateCurrent = () => {
    console.log(
      'CURRENT DATE --> date: %o day: %o hours: %o minutes: %o seconds: %o',
      moment().format('YYYY-MM-DD hh:mm:ss'),
      days,
      hours,
      minutes,
      seconds,
    );
  }; */

/*   async function logToFile(netInfoJSON) {
    isLogging = true;
    var path = (await RNFS.DocumentDirectoryPath) + filePath;
    // console.log('path: ', path);
    await RNFS.write(path, JSON.stringify(netInfoJSON) + '\n', -1, 'utf8')
      .then(success => {
        // console.log('FILE WRITTEN!');
        console.log('NetInfoJSON --> ', netInfoJSON);
        readFile(); //read Network LOG from log file
      })
      .catch(err => {
        console.log(err.message);
      });
    isLogging = false;
  }

  async function readFile() {
    try {
      var path = (await RNFS.DocumentDirectoryPath) + filePath;
      // console.log('path: ', path);
      const fileData = await RNFS.readFile(path, 'utf8');
      doSplitToString(fileData);
    } catch (error) {
      console.log('error -->', error);
    }
  }

  async function doSplitToString(rawString = '') {
    let tempSplit = new Array();
    let tempArray = new Array();
    let documentUID = '';

    tempSplit = rawString.split(/\n/);

    var config = new Promise((resolve, reject) => {
      tempSplit.forEach(async (value, index, array) => {
        if (value != '') {
          // console.log(value);
          let parsedElement = JSON.parse(value);
          documentUID = parsedElement['Unique ID'];
          tempArray.push(parsedElement);
          if (index === array.length - 2) resolve();
        }
      });
    });

    config.then(async () => {
      // console.log('tempArray: ', JSON.stringify(tempArray))
      // console.log('tempArray: ', tempArray)
      // console.log('documentUID: ', documentUID);
      if (isPushConfig) {
        if (tempArray.length > 1) {
          await postWithBatch(documentUID, tempArray);
        } else if (tempArray.length === 1) {
          await pushDeviceNetworkInfo(tempArray[0]);
        }
        await clearFile();
        // setDataFromLogFile([]);
      }
    });
  }

  async function pushDeviceNetworkInfo(netInfoJSON) {
    await getUserNetworkInfo(netInfoJSON['Unique ID'], netInfoJSON);
  }

  async function clearFile() {
    try {
      var path = (await RNFS.DocumentDirectoryPath) + filePath;
      // console.log('path: ', path);
      await RNFS.unlink(path, 'utf8');
      console.log('File Deleted');
    } catch (error) {
      console.log('error -->', error);
    }
  } */

/*   const getDeviceData = async () => {
    let deviceJSON = {};
    try {
      deviceJSON['Device name'] = await DeviceInfo.getDeviceName();
      deviceJSON['Device'] = await DeviceInfo.getDevice();
      deviceJSON['Device ID'] = DeviceInfo.getDeviceId();
      deviceJSON['Model'] = 'Model: ' + DeviceInfo.getModel();
      deviceJSON['Unique ID'] = await DeviceInfo.getUniqueId();
      deviceJSON['Brand'] = DeviceInfo.getBrand();
      deviceJSON['System name'] = DeviceInfo.getSystemName();
      deviceJSON['System version'] = DeviceInfo.getSystemVersion();
      if ((await getNetType()) === 'wifi') {
        deviceJSON['Network type'] = await getNetType();
        deviceJSON['IP address'] = await DeviceInfo.getIpAddress();
        deviceJSON['SSID'] = (await NetInfo.fetch()).details.ssid;
        deviceJSON['Network MAC'] = (await NetInfo.fetch()).details.bssid;
      } else if ((await getNetType()) === 'cellular') {
        deviceJSON['Network type'] = await getNetType();
        deviceJSON['Device MAC Address'] = await DeviceInfo.getMacAddress();
        deviceJSON['Phone number'] =
          (await DeviceInfo.getPhoneNumber()) ?? 'no permission';
        deviceJSON['Carrier name'] = (await NetInfo.fetch()).details.carrier;
        deviceJSON['Network operator'] = await DeviceInfo.getCarrier();
        deviceJSON['CellularGeneration'] = (
          await NetInfo.fetch()
        ).details.cellularGeneration;
      }
    } catch (e) {
      console.log('Trouble getting device info ', e);
    }
    setDeviceInfo(deviceJSON);
    // setArr(Object.keys(deviceJSON));
  }; */
