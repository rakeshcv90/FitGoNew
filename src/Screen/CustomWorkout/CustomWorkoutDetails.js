import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useMemo, useEffect} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {BlurView} from '@react-native-community/blur';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {localImage} from '../../Component/Image';
import AnimatedLottieView from 'lottie-react-native';
import ActivityLoader from '../../Component/ActivityLoader';
import axios from 'axios';
import VersionNumber from 'react-native-version-number';
import {
  setCustomWorkoutData,
  setVideoLocation,
} from '../../Component/ThemeRedux/Actions';
import {showMessage} from 'react-native-flash-message';
import {useIsFocused} from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {BannerAdd} from '../../Component/BannerAdd';
import {bannerAdId} from '../../Component/AdsId';
import GradientButton from '../../Component/GradientButton';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import NewButton from '../../Component/NewButton';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const CustomWorkoutDetails = ({navigation, route}) => {
  const data = route?.params?.item;
  const avatarRef = React.createRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [forLoading, setForLoading] = useState(false);
  const [trackerData, setTrackerData] = useState([]);
  const [downloaded, setDownloade] = useState(false);
  const [backBlock, setBackBlock] = useState(false);
  const [VideoDownload, setVideoDownload] = useState(0);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);

  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const dispatch = useDispatch();
  let isFocuse = useIsFocused();

  useEffect(() => {
    if (isFocuse) {
      getExerciseTrackAPI();
    }
  }, [isFocuse]);

  const sanitizeFileName = fileName => {
    fileName = fileName.replace(/\s+/g, '_');
    return fileName;
  };
  let StoringData = {};
  let downloadCounter = 0;
  const downloadVideos = async (data, index, len) => {
    const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/${sanitizeFileName(
      data?.exercise_title,
    )}.mp4`;
    try {
      const videoExists = await RNFetchBlob.fs.exists(filePath);
      if (videoExists) {
        StoringData[data?.exercise_title] = filePath;
        setDownloade(true);
        downloadCounter++;
        setVideoDownload((downloadCounter / len) * 100);
      } else {
        await RNFetchBlob.config({
          fileCache: true,
          // IOSBackgroundTask: true, // Add this for iOS background downloads
          path: filePath,
          appendExt: '.mp4',
        })
          .fetch('GET', data?.exercise_video, {
            'Content-Type': 'application/mp4',
            // key: 'Config.REACT_APP_API_KEY',
          })
          .then(res => {
            StoringData[data?.exercise_title] = res.path();
            setDownloade(true);
            downloadCounter++;
            setVideoDownload((downloadCounter / len) * 100);
          })
          .catch(err => {
            console.log(err);
          });
      }
    } catch (error) {
      console.log('ERRRR', error);
    }
    dispatch(setVideoLocation(StoringData));
  };
  const getExerciseTrackAPI = async () => {
    const payload = new FormData();
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('workout_id', route?.params?.item?.custom_workout_id);
    payload.append('user_day', -10);
    payload.append('version', VersionNumber.appVersion);

    try {
      const res = await axios({
        url: NewAppapi.TRACK_CURRENT_DAY_EXERCISE,
        method: 'Post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res?.data?.msg == 'Please update the app to the latest version.') {
        showMessage({
          message: res?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (res.data?.user_details) {
        setTrackerData(res.data?.user_details);
      } else {
        setTrackerData([]);
      }
    } catch (error) {
      console.error(error, 'PostDaysAPIERror');
      setTrackerData([]);
    }
  };

  const postCurrentDayAPI = async () => {
    let datas = [];
    let trainingCount = -1;
    trainingCount = trackerData.findIndex(
      item => item?.exercise_status == 'undone',
    );

    for (const exercise of data?.exercise_data) {
      datas.push({
        user_id: getUserDataDetails?.id,
        workout_id: data?.custom_workout_id,
        user_day: -10,
        user_exercise_id: exercise?.exercise_id,
      });
    }

    Promise.all(
      data?.exercise_data.map((item, index) =>
        downloadVideos(item, index, data?.exercise_data.length),
      ),
    ).finally(async () => {
      try {
        const res = await axios({
          url: NewAppapi.CURRENT_DAY_EXERCISE,
          method: 'Post',
          data: {user_details: datas},
        });

        if (res.data) {
          setBackBlock(false);
          if (
            res.data?.msg ==
            'Exercise Status for All Users Inserted Successfully'
          ) {
            setDownloade(false);
            navigation.navigate('Exercise', {
              allExercise: data?.exercise_data,
              // currentExercise: data?.exercise_data[0],
              currentExercise:
                trainingCount != -1
                  ? data?.exercise_data[trainingCount]
                  : data?.exercise_data[0],
              data: data,
              day: -10,
              // exerciseNumber: 0,
              exerciseNumber: trainingCount != -1 ? trainingCount : 0,
              trackerData: res?.data?.inserted_data,
              type: 'custom',
            });
          } else {
            setDownloade(false);
            navigation.navigate('Exercise', {
              allExercise: data?.exercise_data,
              // currentExercise: data?.exercise_data[0],
              currentExercise:
                trainingCount != -1
                  ? data?.exercise_data[trainingCount]
                  : data?.exercise_data[0],
              data: data,
              day: -10,
              exerciseNumber: trainingCount != -1 ? trainingCount : 0,
              trackerData: trackerData,
              type: 'custom',
            });
          }
        }
      } catch (error) {
        console.error(error, 'PostDaysAPIERror');
      }
    });
  };

  const renderItem = useMemo(
    () =>
      ({item, index}) => {
        return (
          <>
            <TouchableOpacity
              onPress={() => {
                AnalyticsConsole(`${item?.exercise_title?.split(' ')[0]}_DESC`);
                navigation.navigate('WorkoutDetail', {item: item});
              }}
              activeOpacity={0.8}
              style={{
                width: '95%',
                borderRadius: 10,
                backgroundColor: 'white',
                marginVertical: 8,
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                padding: 5,
                borderColor: '#D9D9D9',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    height: 70,
                    width: 70,
                    borderRadius: 5,
                    borderWidth: 0.5,
                    borderColor: 'lightgrey',
                    marginHorizontal: -12,
                    justifyContent: 'center',
                  }}>
                  <FastImage
                    fallback={true}
                    // onError={onError}
                    // onLoadEnd={onLoadEnd}
                    // onLoadStart={onLoadStart}

                    style={{
                      width: 60,
                      height: 60,
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}
                    source={{
                      uri: item?.exercise_image_link,
                      headers: {Authorization: 'someAuthToken'},
                      priority: FastImage.priority.high,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                    defaultSource={localImage.NOWORKOUT}
                  />
                </View>
                <View
                  style={{
                    width: DeviceWidth * 0.5,
                    marginHorizontal: 25,
                    justifyContent: 'center',
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 17,
                      fontWeight: '600',
                      color: '#202020',
                      lineHeight: 25,
                      fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    }}>
                    {item?.exercise_title}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: '#202020',
                        lineHeight: 30,

                        fontFamily: Fonts.MONTSERRAT_MEDIUM,
                      }}>
                      {'Time : '}
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color: '#202020',
                          lineHeight: 30,

                          fontFamily: Fonts.MONTSERRAT_MEDIUM,
                        }}>
                        {' '}
                        {item?.exercise_rest}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>

              {getExerciseStatus(item?.exercise_id, trackerData)}
            </TouchableOpacity>
            {index !== data?.exercise_data.length - 1 && (
              <View
                style={{
                  width: '100%',
                  height: 1,

                  alignItems: 'center',
                  backgroundColor: '#33333314',
                }}
              />
            )}
          </>
        );
      },
    [trackerData],
  );

  const getExerciseStatus = useMemo(() => (item_id, allData) => {
    let status_data = allData?.filter(item1 => {
      return item1?.user_exercise_id == item_id;
    });

    return (
      <View>
        {status_data[0]?.exercise_status == 'completed' && (
          <AnimatedLottieView
            source={require('../../Icon/Images/NewImage/compleate.json')}
            speed={0.5}
            autoPlay
            resizeMode="cover"
            style={{width: 50, height: 50, right: 5}}
          />
        )}
      </View>
    );
  });

  const emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage/NoData.json')}
          speed={2}
          autoPlay
          loop
          resizeMode="contain"
          style={{
            width: DeviceWidth * 0.5,

            height: DeviceHeigth * 0.5,
          }}
        />
      </View>
    );
  };
  const deleteCustomeWorkout = async () => {
    setForLoading(true);
    setIsMenuOpen(false);

    try {
      const response = await axios.get(
        `${NewAppapi.DELETE_CUSTOM_WORKOUT}?user_id=${getUserDataDetails.id}&custom_workout_id=${data?.custom_workout_id}&version=${VersionNumber.appVersion}`,
      );

      if (response?.data?.msg == 'data deleted successfully') {
        // getCustomWorkout();
        getUserDetailData();
        showMessage({
          message: 'Workout deleted successfully.',
          type: 'success',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        setForLoading(false);
        showMessage({
          message: response?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      }
    } catch (error) {
      setForLoading(false);
      showMessage({
        message: 'Something went wrong pleasr try again',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
      console.log('Custom Workout Delete Error', error);
    }
  };
  const getCustomWorkout = async () => {
    try {
      const data = await axios.get(
        `${NewAppapi.GET_USER_CUSTOM_WORKOUT}?user_id=${getUserDataDetails?.id}`,
      );

      if (data?.data?.msg != 'data not found.') {
        setForLoading(false);
        dispatch(setCustomWorkoutData(data?.data?.data));
        navigation.goBack();
      } else {
        setForLoading(false);
        navigation.goBack();
        dispatch(setCustomWorkoutData([]));
      }
    } catch (error) {
      setForLoading(false);
      showMessage({
        message: 'Something went wrong please try again',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
      console.log('Custom Workout Error', error);
      dispatch(setCustomWorkoutData([]));
    }
  };
  const getUserDetailData = async () => {
    try {
      const responseData = await axios.get(
        `${NewAppapi.ALL_USER_DETAILS}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails?.id}`,
      );

      if (
        responseData?.data?.msg ==
        'Please update the app to the latest version.'
      ) {
        showMessage({
          message: responseData?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        setForLoading(false);
        dispatch(setCustomWorkoutData(responseData?.data?.workout_data));
        navigation.goBack();
      }
    } catch (error) {
      console.log('GET-USER-DATA', error);
      setForLoading(false);
      
    }
  };
  // const bannerAdsDisplay = () => {
  //   if (getPurchaseHistory.length > 0) {
  //     if (
  //       getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
  //     ) {
  //       return null;
  //     } else {
  //       return <BannerAdd bannerAdId={bannerAdId} />;
  //     }
  //   } else {
  //     return <BannerAdd bannerAdId={bannerAdId} />;
  //   }
  // };
  return (
    <>
      <DietPlanHeader
        //header={route?.params?.item?.workout_name}
        header={'Custom Workout'}
        SearchButton={false}
        backPressCheck={backBlock}
        onPress={() => {
          if (backBlock) {
            showMessage({
              message:
                'Please wait, downloading in progress. Do not press back.',
              type: 'info',
              animationDuration: 500,
              floating: true,
              icon: {icon: 'auto', position: 'left'},
            });
          } else {
            navigation?.goBack();
          }
        }}
      />
      {forLoading ? <ActivityLoader /> : ''}
      <View style={styles.container}>
        <View style={{width: '98%', alignSelf: 'center'}}>
          <View
            style={{
              width: '100%',
              borderRadius: 10,
              backgroundColor: '#FDFDFD',
              marginVertical: 8,
              flexDirection: 'row',
              alignSelf: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              padding: 5,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                // source={{uri: data.workout_image_link}}
                source={
                  data?.image == '' ? localImage.NOWORKOUT : {uri: data?.image}
                }
                defaultSource={localImage.NOWORKOUT}
                style={{
                  width: 70,
                  height: 70,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderRadius: 10,

                  marginHorizontal: -7,
                }}
                resizeMode="cover"
              />
              <View
                style={{
                  marginHorizontal: 25,
                  justifyContent: 'center',
                  width: DeviceWidth * 0.5,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 17,
                    fontWeight: '600',
                    color: '#202020',
                    lineHeight: 25,
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                  }}>
                  {data?.workout_name}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: '#202020',
                    lineHeight: 30,

                    fontFamily: Fonts.MONTSERRAT_MEDIUM,
                  }}>
                  {data?.total_exercises}
                  {' Exercises'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={{top: 10}}
              onPress={() => {
                setIsMenuOpen(true);
              }}>
              <Icons name="dots-vertical" size={30} color={'#000'} />
            </TouchableOpacity>
          </View>
          <View style={{width: '95%', alignSelf: 'center', top: -20}}>
            <Text
              style={{
                color: AppColor.BLACK,
                fontFamily: 'Montserrat-SemiBold',
                fontWeight: '700',
                lineHeight: 20,
                fontSize: 20,
                top: 15,
                marginVertical: 15,
                alignItems: 'center',
              }}>
              Exercises
            </Text>
          </View>
          <View style={{paddingBottom: 10}}>
            <FlatList
              data={data?.exercise_data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              ListEmptyComponent={emptyComponent}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              removeClippedSubviews={true}
              contentContainerStyle={{paddingBottom: DeviceHeigth * 0.35}}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
        {data?.exercise_data.length > 0 && (
    
          <NewButton
            position={'absolute'}
            title={'Start Workout'}
            bottom={20}
            pV={10}
            pH={10}
            ButtonWidth={DeviceWidth * 0.4}
            bR={20}
            right={16}
            withAnimation
            download={VideoDownload}
            onPress={() => {
              setBackBlock(true);
              postCurrentDayAPI();
            }}
          />
        )}
      </View>
      <Modal
      animationType="slide"
        visible={isMenuOpen}
        transparent={true}
        onRequestClose={() => {
          setIsMenuOpen(!isMenuOpen);
        }}>
        <BlurView style={styles.modalContainer} blurType="light" blurAmount={1}>
          <TouchableOpacity
            style={{flex: 1}}
            activeOpacity={1}
            onPress={() => setIsMenuOpen(false)}>
            <View
              style={{
                width: DeviceWidth * 0.4,
                alignSelf: 'flex-end',
                backgroundColor: AppColor.WHITE,
                paddingBottom: 10,
                marginTop: DeviceHeigth * 0.15,
                borderRadius: 10,
                marginRight: DeviceWidth * 0.05,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setIsMenuOpen(false);
                  AnalyticsConsole(`Custom_EDIT_BUTTON`);
                  navigation.navigate('EditCustomWorkout', {item: data});
                }}
                style={{
                  flexDirection: 'row',
                  marginVertical: 10,
                  marginHorizontal: 20,
                  alignItems: 'center',
                }}>
                <Icons name="pen" size={20} color={'#000'} />
                <Text
                  style={{
                    fontWeight: '600',
                    fontSize: 14,
                    lineHeight: 18,
                    marginHorizontal: 10,
                    color: '#505050',
                    textAlign: 'center',
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                  }}>
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  AnalyticsConsole(`Custom_DEL_BUTTON`);
                  deleteCustomeWorkout();
                }}
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 20,
                  alignItems: 'center',
                }}>
                <Icons name="delete" size={20} color={'#f0013b'} />
                <Text
                  style={{
                    fontWeight: '600',
                    fontSize: 14,
                    lineHeight: 18,
                    marginHorizontal: 10,
                    color: '#f0013b',
                    textAlign: 'center',
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                  }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </BlurView>
      </Modal>
      {/* {bannerAdsDisplay()} */}
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
  },
  buttonStyle: {
    width: 180,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    bottom: DeviceHeigth * 0.015,
    right: 10,
  },
  button: {
    fontSize: 15,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    textAlign: 'center',
    marginHorizontal: 10,
    color: AppColor.WHITE,
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
  modalContainer: {
    flex: 1,

    backgroundColor: 'rgba(0,0,0,.2)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 8,
    width: DeviceWidth * 0.5,

    alignSelf: 'flex-end',
    position: 'absolute',
    top: DeviceHeigth / 8,
  },
  buttonStyle: {
    width: 180,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    bottom: DeviceHeigth * 0.015,
    right: 10,
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
  loader: {
    position: 'absolute',
    justifyContent: 'center',

    backgroundColor: AppColor.GRAY,
    zIndex: 1,
    height: 72,
    top: -2,
    width: 75,
    left: -2,
    borderRadius: 5,
  },
});
export default CustomWorkoutDetails;
