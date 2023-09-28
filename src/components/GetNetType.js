import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';

export const getDeviceData = async (deviceInfo, setDeviceInfo) => {
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
};

export const getNetType = async () => {
  return (await NetInfo.fetch()).type;
};
