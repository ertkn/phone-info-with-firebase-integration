import React from 'react';
import RNFS from 'react-native-fs';
import {postWithBatch, pushNetworkInfo} from '../services/userNetworkInfo';

const filePath = '/networkInfoLOG.txt';

export async function logToFile(netInfoJSON, isLogging, isPushConfig) {
  isLogging = true;
  var path = (await RNFS.DocumentDirectoryPath) + filePath;
  await RNFS.write(path, JSON.stringify(netInfoJSON) + '\n', -1, 'utf8')
    .then(success => {
      console.log('NetInfoJSON --> ', netInfoJSON);
      readFile(isPushConfig); //read Network LOG from log file
    })
    .catch(err => {
      console.log(err.message);
    });
  isLogging = false;
}

export async function readFile(isPushConfig) {
  try {
    var path = (await RNFS.DocumentDirectoryPath) + filePath;
    const fileData = await RNFS.readFile(path, 'utf8');
    doSplitToString(fileData, isPushConfig);
  } catch (error) {
    console.log('error -->', error);
  }
}

export async function doSplitToString(rawString = '', isPushConfig) {
  let tempSplit = new Array();
  let tempArray = new Array();
  let documentUID = '';

  tempSplit = rawString.split(/\n/);

  var config = new Promise((resolve, reject) => {
    tempSplit.forEach(async (value, index, array) => {
      if (value != '') {
        let parsedElement = JSON.parse(value);
        documentUID = parsedElement['Unique ID'];
        tempArray.push(parsedElement);
        if (index === array.length - 2) resolve();
      }
    });
  });

  config.then(async () => {
    if (isPushConfig) {
      if (tempArray.length > 1) {
        await postWithBatch(documentUID, tempArray);
      } else if (tempArray.length === 1) {
        await pushDeviceNetworkInfo(tempArray[0]);
      }
      await clearFile();
    }
  });
}

export async function pushDeviceNetworkInfo(networkInfoJSON) {
  await pushNetworkInfo(networkInfoJSON['Unique ID'], networkInfoJSON);
}

export async function clearFile() {
  try {
    var path = (await RNFS.DocumentDirectoryPath) + filePath;
    await RNFS.unlink(path, 'utf8');
    console.log('File Deleted');
  } catch (error) {
    console.log('error -->', error);
  }
}
