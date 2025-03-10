import React from 'react';
import {
  navigate,
  resetAndNavigate,
} from '../../Component/Utilities/NavigationUtil';
import {
  permissionMethods,
  trueCondition,
  UIArray,
} from '../../Component/Permissions/PermissionMethods';
import {RESULTS} from 'react-native-permissions';
import {AuthorizationStatus} from '@notifee/react-native';

const isObject = (result: any) => {
  return !!(typeof result === 'object' && result != null);
};

const checkAllPermissions = () => {
  Promise.all(
    UIArray.map((item: typeof UIArray[0]) => {
      if (permissionMethods[item.checkPermission]) {
        return permissionMethods[item.checkPermission]().then(res => ({
          key: item.key,
          result: res,
        }));
      }
      return Promise.resolve({key: item.key, result: null});
    }),
  ).then(results => {
    const condition = results.some(result => {
      return (
        result?.result == RESULTS.DENIED ||
        result.result == RESULTS.BLOCKED ||
        (isObject(result?.result) &&
          result?.result['android.permission.ACCESS_FINE_LOCATION'] ==
            RESULTS.BLOCKED) ||
        (isObject(result?.result) &&
          result?.result['android.permission.ACCESS_FINE_LOCATION'] ==
            RESULTS.DENIED) ||
        (isObject(result?.result) &&
          result?.result['authorizationStatus'] === AuthorizationStatus.DENIED)
      );
    });
    if (condition) {
      navigate('PermissionScreen');
    } else {
      resetAndNavigate('BottomTab');
    }
  });
};

export default checkAllPermissions;
