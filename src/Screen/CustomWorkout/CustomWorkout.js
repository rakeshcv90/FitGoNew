import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {useSelector, useDispatch} from 'react-redux';
import {TouchableOpacity} from 'react-native';
import {AppColor, Fonts} from '../../Component/Color';
import LinearGradient from 'react-native-linear-gradient';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {localImage} from '../../Component/Image';
import {TextInput} from 'react-native-paper';
import {showMessage} from 'react-native-flash-message';
import {PERMISSIONS, openSettings, request} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';
import {useIsFocused} from '@react-navigation/native';
import VersionNumber from 'react-native-version-number';
import {
  setAllExercise,
  setChallengesData,
} from '../../Component/ThemeRedux/Actions';
import axios from 'axios';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {BannerAdd} from '../../Component/BannerAdd';
import {bannerAdId} from '../../Component/AdsId';
import NativeAddTest from '../../Component/NativeAddTest';
import moment from 'moment';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import FastImage from 'react-native-fast-image';
import RewardModal from '../../Component/Utilities/RewardModal';
import UpcomingEventModal from '../../Component/Utilities/UpcomingEventModal';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../../Component/Headers/NewHeader1';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const CustomWorkout = ({navigation}) => {
  const avatarRef = React.createRef();
  const dispatch = useDispatch();
  // const routeName = route?.params?.routeName;
  const customWorkoutData = useSelector(state => state.customWorkoutData);

  const [isCustomWorkout, setIsCustomWorkout] = useState(false);
  const [text, setText] = React.useState('');
  const [getWorkoutAvt, setWorkoutAvt] = useState(null);

  const isFocused = useIsFocused();
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  // useEffect(() => {
  //   if (isFocused) {
  //     getAllChallangeAndAllExerciseData();
  //   }
  // }, [isFocused]);
  const askPermissionForLibrary = async permission => {
    const resultLib = await request(permission);

    if (resultLib == 'granted' || resultLib == 'limited') {
      try {
        const resultLibrary = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.5,
          maxWidth: 300,
          maxHeight: 200,
        });
        setWorkoutAvt(resultLibrary.assets[0]);

        if (resultLibrary) {
          // setModalImageUploaded(true);
        }
      } catch (error) {
        console.log('LibimageError', error);
      }
    } else if (resultLib == 'blocked') {
      Alert.alert(
        'Permission Required',
        'To use the photo library ,Please enable library access in settings',
        [
          {
            text: 'cancel',
            style: 'cancel',
          },
          {
            text: 'Open settings',
            onPress: openSettings,
          },
        ],
        {cancelable: false},
      );
    } else {
      showMessage({
        message: 'Something went wrong',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    }
  };
  const renderItem = useMemo(
    () =>
      ({index, item}) => {
        return (
          <>
            <TouchableOpacity
              style={{
                width: '98%',
                marginVertical: 10,
                // paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'space-between',
              }}
              onPress={() => {
                AnalyticsConsole(`OPEN_Custom_Wrk`);
                navigation.navigate('CustomWorkoutDetails', {item: item});
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FastImage
                  fallback={true}
                  style={{
                    width: 70,
                    height: 70,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#D9D9D9',
                  }}
                  source={{
                    uri: item?.image,
                    headers: {Authorization: 'someAuthToken'},
                    priority: FastImage.priority.high,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                  defaultSource={localImage.NOWORKOUT}
                />
                <View
                  style={{
                    marginHorizontal: 16,
                    width: DeviceWidth * 0.48,
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      lineHeight: 24,
                      fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                      color: '#1E1E1E',
                    }}>
                    {item?.workout_name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '400',
                      lineHeight: 24,
                      opacity: 0.7,
                      fontFamily: Fonts.MONTSERRAT_MEDIUM,
                      color: '#1E1E1E',
                    }}>
                    {item?.total_exercises}
                    {' Exercises'}
                  </Text>
                </View>
              </View>
              <Image
                source={localImage.Next}
                resizeMode="contain"
                style={{width: 30, height: 30, right: -3}}
              />
            </TouchableOpacity>

            {index !== customWorkoutData.length - 1 && (
              <View
                style={{
                  width: '100%',
                  height: 1,

                  alignItems: 'center',
                  backgroundColor: '#33333314',
                }}
              />
            )}
            {getAdsDisplay(index, item)}
          </>
        );
      },
    [customWorkoutData],
  );
  const getAdsDisplay = (index, item) => {
    const noOrNoobPlan =
      getPurchaseHistory?.plan == null || getPurchaseHistory?.plan == 'noob';
    if (customWorkoutData.length >= 1) {
      if (index == 0 && customWorkoutData.length > 1 && noOrNoobPlan) {
        return getNativeAdsDisplay();
      } else if ((index + 1) % 8 == 0 && customWorkoutData.length > 8) {
        return getNativeAdsDisplay();
      }
    }
  };
  const getNativeAdsDisplay = () => {
    if (getPurchaseHistory?.plan != null) {
      return (
        <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <NativeAddTest type="image" media={false} />
        </View>
      );
    } else {
      return (
        <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <NativeAddTest type="image" media={false} />
        </View>
      );
    }
  };
  const emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,

          alignItems: 'center',
        }}>
        <Image
          source={localImage.Createworkout}
          resizeMode="contain"
          style={{
            width: DeviceWidth * 0.7,
            height: DeviceHeigth * 0.3,

            marginTop: DeviceHeigth * 0.1,
          }}
        />
        <View
          style={{
            width: DeviceWidth,
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#1E1E1E',
              fontSize: 18,
              fontWeight: '700',
              lineHeight: 26,
              fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
            }}>
            No workout created yet!
          </Text>
        </View>
        <View
          style={{
            width: DeviceWidth,
            alignItems: 'center',
            zIndex: -1,
            marginVertical: 15,
          }}>
          <Text
            style={{
              color: '#333333',
              fontSize: 14,
              fontWeight: '400',
              lineHeight: 16,
              opacity: 0.6,
              fontFamily: Fonts.MONTSERRAT_MEDIUM,
            }}>
            Create your perfect workout plan based
          </Text>
          <Text
            style={{
              color: '#333333',
              fontSize: 14,
              fontWeight: '400',
              lineHeight: 30,
              opacity: 0.6,
              fontFamily: Fonts.MONTSERRAT_MEDIUM,
            }}>
            on your preferences.
          </Text>
          <View
            style={{
              width: 180,
              height: 40,
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 100,
              top: DeviceHeigth * 0.05,
              backgroundColor: '#f0013b',
              //  Platform.OS == 'android' ? -40 : DeviceHeigth >= 1024 ? 30 : -40,
            }}>
            <TouchableOpacity
              style={{
                width: 180,
                height: 40,

                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}
              activeOpacity={0.5}
              onPress={() => {
                setIsCustomWorkout(!isCustomWorkout);
              }}>
              <Image
                source={localImage.Plus}
                style={{width: 20, height: 20}}
                tintColor={AppColor.WHITE}
              />
              <Text style={styles.button}>{'Create Workout'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const createWorkout = () => {
    if (text.trim().length <= 0) {
      showMessage({
        message: 'Please enter your workout name',
        type: 'danger',
        animationDuration: 500,

        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    } else if (text.trim().length < 3) {
      showMessage({
        message: 'Please enter proper workout name',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    } else if (getWorkoutAvt == null) {
      showMessage({
        message: 'Please select image for workout',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    } else {
      AnalyticsConsole(`Create_Wrk_BUTTON`);
      navigation.navigate('CreateWorkout', {
        workoutTitle: text,
        workoutImg: getWorkoutAvt,
      });
      setText('');
      setWorkoutAvt(null);
      setIsCustomWorkout(false);
    }
  };

  // const getAllChallangeAndAllExerciseData = async () => {
  //   let responseData = 0;
  //   if (Object.keys(getUserDataDetails).length > 0) {
  //     try {
  //       responseData = await axios.get(
  //         `${NewAppapi.ALL_USER_WITH_CONDITION}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails?.id}`,
  //       );
  //       dispatch(setChallengesData(responseData.data.challenge_data));
  //       dispatch(setAllExercise(responseData.data.data));
  //     } catch (error) {
  //       console.log('GET-USER-Challange and AllExerciseData DATA', error);
  //       dispatch(setChallengesData([]));
  //       dispatch(setAllExercise([]));
  //     }
  //   } else {
  //     try {
  //       responseData = await axios.get(
  //         `${NewAppapi.ALL_USER_WITH_CONDITION}?version=${VersionNumber.appVersion}`,
  //       );
  //       dispatch(setChallengesData(responseData.data.challenge_data));
  //       dispatch(setAllExercise(responseData.data.data));
  //     } catch (error) {
  //       dispatch(setChallengesData([]));
  //       dispatch(setAllExercise([]));

  //       console.log('GET-USER-Challange and AllExerciseData DATA', error);
  //     }
  //   }
  // };
  const openDirect = async () => {
    const resultLibrary = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.5,
      maxWidth: 300,
      maxHeight: 200,
    });
    setWorkoutAvt(resultLibrary.assets[0]);
  };
  return (
    <>
      <View style={styles.container}>
        <Wrapper>
          <NewHeader1 header={'Create Custom Workout'} backButton />
          <View style={[styles.meditionBox, {marginTop: 10}]}>
            <FlatList
              data={customWorkoutData}
              // contentContainerStyle={{ flex: 1,  }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              ListEmptyComponent={emptyComponent}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              removeClippedSubviews={true}
            />
          </View>
          {customWorkoutData?.length > 0 && (
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={() => {
                setIsCustomWorkout(true);
              }}>
              <Image
                source={localImage.Plus}
                style={{width: 20, height: 20}}
                tintColor={AppColor.WHITE}
              />
              <Text style={styles.button}>{'Create Workout'}</Text>
            </TouchableOpacity>
          )}
        </Wrapper>
      </View>
      <Modal
        animationType="slide"
        visible={isCustomWorkout}
        transparent={true}
        onRequestClose={() => {
          setIsCustomWorkout(!isCustomWorkout);
        }}>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,.5)',
          }}
          activeOpacity={1}>
          <View
            style={{
              width: DeviceWidth * 0.9,
              alignSelf: 'center',

              backgroundColor: AppColor.WHITE,
              paddingHorizontal: 10,
              paddingVertical: 20,
              borderRadius: 10,
            }}>
            <TouchableOpacity
              style={styles.imageView}
              onPress={() => {
                if (Platform.OS == 'ios') {
                  askPermissionForLibrary(PERMISSIONS.IOS.PHOTO_LIBRARY);
                } else {
                  if (Platform.Version >= 33) {
                    openDirect();
                  } else {
                    askPermissionForLibrary(
                      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    );
                  }
                }
              }}>
              <Image
                source={
                  getWorkoutAvt == null
                    ? require('../../Icon/Images/NewImage2/upload.png')
                    : getWorkoutAvt
                }
                resizeMode={getWorkoutAvt == null ? 'contain' : 'cover'}
                style={{
                  height: getWorkoutAvt == null ? 35 : 85,
                  width: getWorkoutAvt == null ? 35 : 85,
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                top: 8,
                color: '#202020',
                fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                fontSize: 16,
                lineHeight: 24,
                fontWeight: '700',
              }}>
              Enter Workout Name
            </Text>
            <TextInput
              value={text}
              activeOutlineColor="red"
              underlineColor="#20202099"
              activeUnderlineColor="#20202099"
              outlineStyle={{borderRadius: 15}}
              placeholder="Eg: Monday, chest day"
              isFocused={true}
              style={{
                marginVertical: 10,
                backgroundColor: '#fff',
                paddingHorizontal: -5,
              }}
              onChangeText={text => setText(text)}
            />
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setIsCustomWorkout(false);
                }}>
                <Text
                  style={{
                    marginHorizontal: 20,
                    color: '#393939',
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    fontSize: 16,
                    lineHeight: 30,
                    fontWeight: '600',
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  createWorkout();
                }}>
                <Text
                  style={{
                    marginHorizontal: 10,
                    color: '#f0013b',
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    fontSize: 16,
                    lineHeight: 30,
                    fontWeight: '600',
                  }}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <BannerAdd bannerAdId={bannerAdId} />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },

  meditionBox: {
    backgroundColor: 'white',
    width: '96%',
    flex: 1,
    alignSelf: 'center',
  },
  buttonStyle: {
    // width: 180,
    height: 40,
    paddingHorizontal: 8,
    borderRadius: 7,
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    bottom: DeviceHeigth * 0.015,
    right: 10,
    backgroundColor: '#f0013b',
  },
  button: {
    fontSize: 15,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    textAlign: 'center',
    marginHorizontal: 10,
    color: AppColor.WHITE,
    fontWeight: '600',
    backgroundColor: 'transparent',
    //lineHeight: 25,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 8,
    width: DeviceWidth * 0.5,

    alignSelf: 'flex-end',
    position: 'absolute',
    top: DeviceHeigth / 8,
  },
  loader: {
    position: 'absolute',
    justifyContent: 'center',

    backgroundColor: AppColor.GRAY,
    zIndex: 1,
    // height: 80,
    // width: 90,
    height: DeviceHeigth >= 1024 ? 120 : 70,
    width: DeviceHeigth >= 1024 ? DeviceWidth * 0.18 : DeviceWidth * 0.19,
    left: -8,
    borderRadius: 10,
  },
  imageView: {
    // backgroundColor: AppColor.GRAY1,
    height: 95,
    width: 95,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#33333333',
    borderStyle: 'dotted',

    borderWidth: 2,
  },
  headerstyle: {
    fontWeight: '600',
    fontSize: 19,
  },
});
export default CustomWorkout;
