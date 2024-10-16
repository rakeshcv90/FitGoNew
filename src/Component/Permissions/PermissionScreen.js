import {AppState, Platform, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Wrapper from '../../Screen/WorkoutCompleteScreen/Wrapper';
import {AppColor, Fonts, PLATFORM_IOS} from '../Color';
import {Image} from 'react-native';
import NewButton from '../NewButton';
import {AuthorizationStatus} from '@notifee/react-native';
import {RESULTS} from 'react-native-permissions';
import {
  alertCondition,
  handleError,
  permissionMethods,
  showAlert,
  trueCondition,
  UIArray,
} from './PermissionMethods';
import {getCurrentLocation, storeAgreementApi} from './PermissionHooks';
import {useDispatch} from 'react-redux';
import {setOfferAgreement} from '../ThemeRedux/Actions';
const PermissionScreen = () => {
  const [permissionState, setPermissionState] = useState({
    storage: false,
    // notification: false,
    location: false,
    healthkit: false,
  });
  const dispatch = useDispatch();
  useEffect(() => {
    checkPermissions();
    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'active') {
        checkPermissions();
      }
    };
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, []);
  //
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
  // handle permission request
  const handlePermissionRequest = async permissionKey => {
    const askMethod = UIArray.find(
      item => item.key === permissionKey,
    ).askPermission;
    if (askMethod && permissionMethods[askMethod]) {
      const result = await permissionMethods[askMethod]();
      if (trueCondition(result)) {
        setPermissionState(prev => ({...prev, [permissionKey]: true}));
        // if (
        //   result['android.permission.ACCESS_FINE_LOCATION'] == //location permissions
        //   RESULTS.GRANTED
        // ) {
        //   getCurrentLocation()
        //     .then(res => {
        //       storeAgreementApi(res)
        //         .then(res => {
        //           dispatch(setOfferAgreement(res));
        //           console.log('resssss', res);
        //         })
        //         .catch(err => {
        //           handleError(err);
        //         });
        //     })
        //     .catch(error => handleError(error));
        // }
      } else if (alertCondition(result)) {
        showAlert();
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
    return (
      <View>
        <View style={styles.pContainer}>
          <Image source={img} style={{height: 35, width: 35}} />
          <View style={{width: '55%', marginHorizontal: 8}}>
            <Text style={styles.pHeading}>{text1}</Text>
            <Text style={styles.pDescription}>{text2}</Text>
          </View>
          <NewButton
            ButtonWidth={'25%'}
            title={grantedPermissions ? 'Allowed' : 'Allow'}
            pV={8}
            buttonColor={grantedPermissions ? AppColor.RED : AppColor.WHITE}
            borderWidth={1.5}
            borderColor={AppColor.RED}
            titleColor={grantedPermissions ? AppColor.WHITE : AppColor.RED}
            fontFamily={Fonts.HELVETICA_BOLD}
            disabled={grantedPermissions}
            onPress={() => {
              handlePermissionRequest(itemKey);
            }}
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
          title={'Grant All Permissions'}
          fontFamily={Fonts.HELVETICA_REGULAR}
          position={'absolute'}
          bottom={20}
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
