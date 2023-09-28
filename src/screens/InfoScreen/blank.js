import {
    View,
    Text,
    StyleSheet,
    FlatList,
    PermissionsAndroid,
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import {SafeAreaView} from 'react-native-safe-area-context';
  import DeviceInfo from 'react-native-device-info';
  // import WifiManager from 'react-native-wifi-reborn';
  
  const asd = () => {
    const [deviceInfo2, setDeviceInfo] = useState('');
    let deviceInfo = {};
    deviceInfo.Brand = DeviceInfo.getBrand();
    deviceInfo['Device ID'] = DeviceInfo.getDeviceId();
    const [device, setDevice] = useState('');
    let deviceIP = '';
  
    deviceInfo.IP = DeviceInfo.getIpAddress().then(ip => {
      console.log('ip: ', ip);
      return ip;
    });
    /* 
    const getDeviceInfo = async () => {
  
      setDeviceInfo(prev => {
        return {
          ...prev,
          Brand: DeviceInfo.getBrand(),
          ['Device ID']: DeviceInfo.getDeviceId(),
          Device: device,
          ['System Name']: DeviceInfo.getSystemVersion(),
          Model: DeviceInfo.getModel(),
          ['Unique ID']: DeviceInfo.getUniqueId(),
          IP: deviceIP,
        };
      });
    }
    getDeviceInfo(); */
  
    useEffect(() => {
      // setDeviceInfo();
  
      // setDeviceInfo({...deviceInfo2, deviceBrand: DeviceInfo.getBrand()});
      // setDeviceInfo({...deviceInfo2, deviceID: DeviceInfo.getDeviceId()});
      /*     setDeviceInfo(prev => {
        return {...prev};
      }); */
  
      const brand = DeviceInfo.getBrand();
      setDevice(prev => {
        [...prev, {brand: brand}];
      });
  
      DeviceInfo.getDevice().then(device => {
        setDevice(prev => {
          [...prev, {device: device}];
        });
      });
  
      const deviceID = DeviceInfo.getDeviceId();
      setDevice({...device, deviceID: deviceID});
  
      DeviceInfo.getUniqueId().then(uniqueID => {
        setDevice(prev => {
          [...prev, {uniqueID: uniqueID}];
        });
      });
  
      const opSystem = DeviceInfo.getSystemVersion();
      setDevice({...device, opSystem: opSystem});
  
      const model = DeviceInfo.getModel();
      setDevice({...device, model: model});
  
      // const SSID = DeviceInfo.getBrand();
      // const IP = DeviceInfo.getBrand();
      // const Location = DeviceInfo.getBrand();
  
      DeviceInfo.getMacAddress().then(mac => {
        setDevice(prev => {
          [...prev, {mac: mac}];
        });
      });
  
  /*     setDevice({
        ...device,
        brand: brand,
        deviceID: deviceID,
        opSystem: opSystem,
        model: model,
      }); */
  
      console.log('device', JSON.stringify(device));
      // console.log('deviceInfo', deviceInfo);
      // console.log('deviceInfo2', JSON.stringify(deviceInfo2));
      // permission();
      // getWifiSSID();
    }, []);
  
    const getWifiSSID = () => {
      WifiManager.getCurrentWifiSSID()
        .then(ssid => {
          console.log('Your current connected wifi SSID is ' + ssid);
          deviceInfo.WifiSSID = ssid;
        })
        .catch(err => {
          console.log('Cannot get current SSID!');
          console.log('err: ', err);
        });
    };
  
    const permission = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location permission is required for WiFi connections',
          message:
            'This app needs location permission as this is required  ' +
            'to scan for wifi networks.',
          buttonNegative: 'DENY',
          buttonPositive: 'ALLOW',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // You can now use react-native-wifi-reborn
        console.log('granted');
      } else {
        console.log('not granted');
        // Permission denied
      }
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.txtBoxStyle}>
          <Text style={styles.titleStyle}>{}</Text>
        </View>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      // alignItems: 'center',
      // backgroundColor: '#864a4a',
    },
  
    listContainer: {
      // alignItems: 'center',
      backgroundColor: '#c6d64d',
      // padding: '2%',
      marginVertical: '1.5%',
      marginHorizontal: '3%',
    },
  
    titleStyle: {
      // marginVertical: '1.5%',
      // marginHorizontal: '3%',
      fontSize: 20,
      color: '#000000',
      letterSpacing: -1,
      fontWeight: '600',
      marginVertical: '4%',
      marginHorizontal: '4%',
      // backgroundColor: '#5bd365',
      // padding: 2,
      // borderRadius: 5,
      // borderWidth: 1,
      // borderColor: 'black',
    },
  
    txtBoxStyle: {
      marginVertical: '1.5%',
      marginHorizontal: '3%',
      // borderRadius: 15,
      // padding: 16,
      // backgroundColor: '#eccaca',
      backgroundColor: '#cadbec',
    },
  
    buttonStyle: {
      // marginVertical: '1.5%',
      // marginHorizontal: '3%',
      // elevation: 15,
      // borderRadius: 8,
      // padding: 16,
      // backgroundColor: '#6968b1',
      padding: 40,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: 'green',
      // backgroundColor: '#5287b3',
    },
  });
  
  export default InfoScreen;
  
  /*   WifiManager.getCurrentWifiSSID().then(
      ssid => {
        console.log("Your current connected wifi SSID is " + ssid);
        deviceInfo.WifiSSID = ssid;
      },
      () => {
        console.log("Cannot get current SSID!");
      }
    ); */
  