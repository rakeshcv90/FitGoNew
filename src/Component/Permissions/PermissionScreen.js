import {AppState, Platform, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Wrapper from '../../Screen/WorkoutCompleteScreen/Wrapper';
import {AppColor, Fonts, PLATFORM_IOS} from '../Color';
import {Image} from 'react-native';
import NewButton from '../NewButton';
import {
  alertCondition,
  permissionMethods,
  showAlert,
  trueCondition,
  UIArray,
} from './PermissionMethods';
import {useNavigation} from '@react-navigation/native';
import {navigationRef} from '../../../App';

const PermissionScreen = () => {
  const [permissionState, setPermissionState] = useState({
    storage: false,
    notification: false,
    location: false,
    healthkit: false,
  });
  const appState = useRef(AppState.currentState);
  const navigation = useNavigation();
  useEffect(() => {
    checkPermissions();
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState?.current?.match(/inactive|background/) &&
        nextAppState === 'active' &&
        navigationRef?.current?.getCurrentRoute()?.name == 'PermissionScreen'
      ) {
        checkPermissions();
      }
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, []);
  // perform navigation
  useEffect(() => {
    const readyToNavigate = PLATFORM_IOS
      ? permissionState.location &&
        permissionState.notification &&
        permissionState.storage &&
        permissionState.healthkit
      : permissionState.location &&
        permissionState.notification &&
        permissionState.storage;
    if (readyToNavigate) {
      navigation.navigate('BottomTab', {screen: 'Home'});
    }
  }, [permissionState]);
  const checkPermissions = () => {
    Promise.all(
      UIArray.map(item => {
        if (permissionMethods[item.checkPermission]) {
          return permissionMethods[item.checkPermission]().then(res => ({
            key: item.key,
            result: res,
          }));
        }
        return Promise.resolve({key: item.key, result: null});
      }),
    ).then(results => {
      results.forEach(({key, result}) => {
        if (trueCondition(result)) {
          setPermissionState(prev => ({...prev, [key]: true}));
        } else if (alertCondition(result)) {
          setPermissionState(prev => ({...prev, [key]: false}));
        }
      });
    });
  };
  // handle permission request one at a time
  const handlePermissionRequest = async permissionKey => {
    const askMethod = UIArray.find(
      item => item?.key === permissionKey,
    ).askPermission;
    if (askMethod && permissionMethods[askMethod]) {
      const result = await permissionMethods[askMethod]();
      if (
        PLATFORM_IOS &&
        permissionMethods[item.askPermission] ==
          permissionMethods['initHealthKit']
      ) {
        setPermissionState(prev => ({...prev, healthkit: true}));
      }
      if (trueCondition(result)) {
        setPermissionState(prev => ({...prev, [permissionKey]: true}));
      } else if (alertCondition(result)) {
        await showAlert();
      }
    }
  };
  // handle permission all at oncee
  const handleAllPermissions = async () => {
    for (const item of UIArray) {
      if (permissionMethods[item.askPermission]) {
        try {
          const result = await permissionMethods[item.askPermission](); // Wait for each permission to resolve
          if (
            PLATFORM_IOS &&
            permissionMethods[item.askPermission] ==
              permissionMethods['initHealthKit']
          ) {
            setPermissionState(prev => ({...prev, healthkit: true}));
          }
          if (alertCondition(result)) {
            await showAlert();
          }
        } catch (error) {
          console.error('Error requesting permission:', error); // Handle any errors that occur during permission request
        }
      }
    }
  };
  const PermissionView = ({
    img,
    text1,
    text2,
    index,
    grantedPermissions,
    itemKey,
  }) => {
    const isHealthkitAvailable =
      permissionState.location &&
      permissionState.notification &&
      permissionState.storage;
    return (
      <View>
        <View
          style={[
            styles.pContainer,
            {flexDirection: itemKey === 'healthkit' ? 'column' : 'row'},
          ]}>
          {itemKey != 'healthkit' ? (
            <>
              <Image source={img} style={{height: 35, width: 35}} />
              <View style={{width: '55%', marginHorizontal: 8}}>
                <Text style={styles.pHeading}>{text1}</Text>
                <Text style={styles.pDescription}>{text2}</Text>
              </View>
            </>
          ) : (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 18,
                }}>
                <Image source={img} style={{height: 35, width: 35}} />
                <View style={{width: '80%', marginHorizontal: 8}}>
                  <Text style={styles.pHeading}>{text1}</Text>
                  <Text style={styles.pDescription}>{text2}</Text>
                </View>
              </View>
            </View>
          )}
          <NewButton
            ButtonWidth={itemKey == 'healthkit' ? '90%' : '25%'}
            title={
              itemKey == 'healthkit'
                ? 'Sync Healthkit Data'
                : grantedPermissions
                ? 'Allowed'
                : 'Allow'
            }
            pV={8}
            buttonColor={grantedPermissions ? AppColor.RED : AppColor.WHITE}
            borderWidth={1.5}
            borderColor={AppColor.RED}
            titleColor={grantedPermissions ? AppColor.WHITE : AppColor.RED}
            fontFamily={Fonts.HELVETICA_BOLD}
            disabled={
              itemKey == 'healthkit'
                ? !isHealthkitAvailable
                : grantedPermissions
            }
            onPress={() => {
              handlePermissionRequest(itemKey);
            }}
            opacity={
              itemKey == 'healthkit' ? (isHealthkitAvailable ? 1 : 0.5) : 1
            }
          />
        </View>
        {index != UIArray.length - 1 && <View style={styles.border} />}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Wrapper styles={{backgroundColor: AppColor.Background_New}}>
        <View style={styles.cView}>
          <Text style={styles.rTextStyle}>Required Permissions</Text>
          <Text style={styles.dTextStyle}>
            To access certain features of this app, you need to grant
            permissions. Please check the description of each permission.
          </Text>
          <View style={styles.pView}>
            {UIArray.map((item, index) => (
              <PermissionView
                key={index}
                img={item.img}
                text1={item.text1}
                text2={item.text2}
                index={index}
                grantedPermissions={permissionState[item.key]}
                itemKey={item.key}
              />
            ))}
          </View>
        </View>
        <NewButton
          title={
            permissionState.location &&
            permissionState.notification &&
            permissionState.storage
              ? 'Continue to app'
              : 'Grant All Permissions'
          }
          fontFamily={Fonts.HELVETICA_REGULAR}
          position={'absolute'}
          bottom={20}
          onPress={handleAllPermissions}
        />
      </Wrapper>
    </View>
  );
};

export default PermissionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cView: {margin: 16},
  rTextStyle: {
    color: AppColor.BLACK,
    fontFamily: Fonts.HELVETICA_BOLD,
    fontSize: 20,
    marginVertical: 8,
  },
  dTextStyle: {
    color: AppColor.SecondaryTextColor,
    fontFamily: Fonts.HELVETICA_REGULAR,
    fontSize: 16,
    lineHeight: 24,
  },
  pView: {
    width: '100%',
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: AppColor.WHITE,
    alignSelf: 'center',
    paddingVertical: 18,
  },
  pContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  pDescription: {
    color: AppColor.SecondaryTextColor,
    fontFamily: Fonts.HELVETICA_REGULAR,
  },
  pHeading: {
    color: AppColor.BLACK,
    fontFamily: Fonts.HELVETICA_REGULAR,
    fontSize: 15,
  },
  border: {
    height: 0,
    borderWidth: 0.4,
    marginVertical: 5,
    borderColor: AppColor.GRAY1,
    width: '90%',
    alignSelf: 'center',
  },
});
