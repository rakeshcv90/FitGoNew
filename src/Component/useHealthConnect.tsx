import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  initialize,
  requestPermission,
  readRecords,
  getGrantedPermissions,
} from 'react-native-health-connect';
import moment from 'moment';

const useHealthConnect = () => {
  const [test, setTest] = useState(false);
  useEffect(() => {
    requestPermissionFunc();
    readGrantedPermissions();
  }, [test]);

  const requestPermissionFunc = async () => {
    const isInitialized = await initialize();
    await requestPermission([
      {accessType: 'read', recordType: 'Steps'},
      {accessType: 'write', recordType: 'Steps'},
    ]);
  };
  const readGrantedPermissions = () => {
    getGrantedPermissions().then(permissions => {
   
      setTest(true)
      readSampleData()
    });
  };

const readSampleData = () => {
    readRecords('Steps', {
      timeRangeFilter: {
        operator: 'between',
        startTime: moment().subtract(1,'day').format(),
        endTime: moment().format(),
      },
    }).then((result) => {
     // Retrieved records:  {"result":[{"startTime":"2023-01-09T12:00:00.405Z","endTime":"2023-01-09T23:53:15.405Z","energy":{"inCalories":15000000,"inJoules":62760000.00989097,"inKilojoules":62760.00000989097,"inKilocalories":15000},"metadata":{"id":"239a8cfd-990d-42fc-bffc-c494b829e8e1","lastModifiedTime":"2023-01-17T21:06:23.335Z","clientRecordId":null,"dataOrigin":"com.healthconnectexample","clientRecordVersion":0,"device":0}}]}
    });
  };
  return {test};
};

export default useHealthConnect;
