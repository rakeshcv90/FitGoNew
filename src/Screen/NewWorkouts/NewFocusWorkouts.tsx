import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useEffect, useMemo, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceWidth, NewAppapi} from '../../Component/Config';
import AntIcons from 'react-native-vector-icons/AntDesign';
import WorkoutsDescription from './WorkoutsDescription';
import FastImage from 'react-native-fast-image';
import {localImage} from '../../Component/Image';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import GradientButton from '../../Component/GradientButton';
import {useAPI} from '../../Component/useAPI';
import {
  setAllExercise,
  setFitmeMealAdsCount,
  setVideoLocation,
} from '../../Component/ThemeRedux/Actions';
import {useDispatch, useSelector} from 'react-redux';
import {appVersion} from 'react-native-version-number';
import useDownload from '../../Component/useDownload';
import moment from 'moment';
import {MyInterstitialAd} from '../../Component/BannerAdd';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';

const Box = memo(({item, index}: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        key={index}
        onPress={() => {
          AnalyticsConsole(`${item?.exercise_title?.split(' ')[0]}_DESC`);
          setVisible(true);
        }}
        activeOpacity={1}
        style={{
          flexDirection: 'row',
          padding: 10,
          marginVertical: 5,
          backgroundColor: AppColor.WHITE,
        }}>
        <View
          style={{
            height: 50,
            width: 50,
            borderRadius: 5,
            borderWidth: 0.5,
            borderColor: 'lightgrey',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/* <Image
            source={{uri: item?.exercise_image_link}}
            onLoad={() => setIsLoading(false)}
            style={{
              height: 40,
              width: 40,
              alignSelf: 'center',
            }}
            resizeMode="contain"
          /> */}

          <FastImage
            fallback={true}
            style={{
              width: '100%',
              height: '100%',
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
            alignItems: 'center',
            marginHorizontal: 20,
            marginTop: 5,
          }}>
          <View>
            <Text
              style={{
                fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                fontSize: 16,
                fontWeight: '600',
                color: '#202020',
                lineHeight: 20,
              }}>
              {item?.exercise_title}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: Fonts.MONTSERRAT_BOLD,
                  fontSize: 12,
                  fontWeight: '600',
                  color: AppColor.BoldText,
                  lineHeight: 30,
                }}>
                Time:
                <Text style={styles.small}>
                  {' '}
                  {item?.exercise_rest}
                  {'   '}
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <WorkoutsDescription data={item} open={visible} setOpen={setVisible} />
    </>
  );
});
const NewFocusWorkouts = ({navigation, route}: any) => {
  const {focusExercises, focusedPart} = route.params;
  const [exerciseData, setExerciseData] = useState<Array<any>>([]);
  const [downloaded, setDownloade] = useState<boolean>(false);
  const [loader, setLoading] = useState<boolean>(false);
  const [dataInserted, setDataInsterted] = useState<boolean>(false);
  const getAllExercise = useSelector((state: any) => state.getAllExercise);
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const getFitmeMealAdsCount = useSelector(
    (state: any) => state.getFitmeMealAdsCount,
  );
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const dispatch = useDispatch();
  console.log(focusExercises);
  const {initInterstitial, showInterstitialAd} = MyInterstitialAd();

  useEffect(() => {
    initInterstitial();
    setExerciseData(focusExercises);
  }, []);
  const sanitizeFileName = (fileName: string) => {
    fileName = fileName.replace(/\s+/g, '_');
    return fileName;
  };
  let StoringData: Object = {};
  const downloadVideos = async (data: any, index: number, len: number) => {
    const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/${sanitizeFileName(
      data?.exercise_title,
    )}.mp4`;
    try {
      const videoExists = await RNFetchBlob.fs.exists(filePath);
      if (videoExists) {
        StoringData[data?.exercise_title] = filePath;
        setDownloade(true);
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
  let datas = [];

  const beforeNextScreen = async (exercises: any) => {
    for (const item of exercises) {
      datas.push({
        user_id: getUserDataDetails?.id,
        workout_id: -20,
        user_day: item?.exercise_bodypart,
        user_exercise_id: item?.exercise_id,
      });
    }
    console.log('readasdasdasdasdsdasd', datas, exercises);
    try {
      const res = await axios({
        url: NewAppapi.CURRENT_DAY_EXERCISE,
        method: 'Post',
        data: {user_details: datas},
      });
      if (
        res.data?.msg == 'Exercise Status for All Users Inserted Successfully'
      ) {
        setDownloade(false);
        Navigation(res.data?.inserted_data);
      } else {
        toNextScreen(exercises);
      }
    } catch (error) {
      console.error(error, 'PostDaysAPIERror');
      setDownloade(false);
    }
  };
  const toNextScreen = async (exercises: any) => {
    setDownloade(false);
    const payload = new FormData();
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('workout_id', -20);
    payload.append('user_day', exercises[0]?.exercise_bodypart);
    payload.append('version', appVersion);

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
        setDownloade(false);
        Navigation(res.data?.inserted_data);
      } else {
      }
    } catch (error) {
      setDownloade(false);
      console.error(error, 'PostDaysAPIERror');
    }
  };

  const getAllExerciseData = async () => {
    try {
      const exerciseData = await axios.get(
        `${NewAppapi.ALL_EXERCISE_DATA}?version=${appVersion}`,
      );

      if (
        exerciseData?.data?.msg == 'Please update the app to the latest version'
      ) {
        dispatch(setAllExercise([]));
      } else if (exerciseData?.data?.length > 0) {
        Promise.all(
          exerciseData?.data?.map((item: any, index: number) => {
            return downloadVideos(item, index, exerciseData?.data?.length);
          }),
        ).finally(() => beforeNextScreen(exerciseData?.data));
      } else {
        dispatch(setAllExercise([]));
      }
    } catch (error) {
      dispatch(setAllExercise([]));
      console.log('All-EXCERSIE-ERROR', error);
    }
  };
  const getbodyPartWorkout = () => {
    Promise.all(
      exerciseData?.map((item: any, index: number) => {
        return downloadVideos(item, index, exerciseData?.length);
      }),
    ).finally(() => beforeNextScreen(exerciseData));
  };

  const checkMealAddCount = () => {
    if (getPurchaseHistory.length > 0) {
      if (
        getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
      ) {
        dispatch(setFitmeMealAdsCount(0));
        return false;
      } else {
        if (getFitmeMealAdsCount < 3) {
          dispatch(setFitmeMealAdsCount(getFitmeMealAdsCount + 1));
          return false;
        } else {
          dispatch(setFitmeMealAdsCount(0));
          return true;
        }
      }
    } else {
      if (getFitmeMealAdsCount < 3) {
        dispatch(setFitmeMealAdsCount(getFitmeMealAdsCount + 1));
        return false;
      } else {
        dispatch(setFitmeMealAdsCount(0));
        return true;
      }
    }
  };

  const Navigation = (responseData: any) => {
    AnalyticsConsole(`START_${focusedPart}_Exer`);
    let checkAdsShow = checkMealAddCount();
    if (checkAdsShow == true) {
      showInterstitialAd();
      //   analytics().logEvent(
      //     `CV_FITME_CLICKED_ON_${exercises[0]?.exercise_bodypart}_CATEGORIES`,
      //   );

      navigation.navigate('Exercise', {
        allExercise: exerciseData,
        currentExercise: exerciseData[0],
        data: [],
        day: -10,
        exerciseNumber: 0,
        trackerData: responseData,
        type: 'weekly',
      });
    } else {
      //   analytics().logEvent(
      //     `CV_FITME_CLICKED_ON_${exerciseData[0]?.exercise_bodypart}_CATEGORIES`,
      //   );
      navigation.navigate('Exercise', {
        allExercise: exerciseData,
        currentExercise: exerciseData[0],
        data: [],
        day: -10,
        exerciseNumber: 0,
        trackerData: responseData,
        type: 'weekly',
      });
    }
  };

  //   let datas = [];
  //   const START = () => {

  //     for (const item of getAllExercise) {
  //       datas.push({
  //         user_id: getUserDataDetails?.id,
  //         workout_id: -20,
  //         user_day: item?.exercise_bodypart,
  //         user_exercise_id: item?.exercise_id,
  //       });
  //       const {loading, error, responseData} = useAPI(
  //         NewAppapi.CURRENT_DAY_EXERCISE,
  //         {},
  //         'msg',
  //         ['Exercise Status for All Users Inserted Successfully'],
  //         '',
  //         'Please update the app to the latest version',
  //         'POST',
  //         {user_details: datas},
  //         () => {},
  //         setLoading,
  //         loader,
  //       );
  //       if (error != '') {
  //         if (dataInserted) {
  //           Navigation(responseData);
  //         } else {
  //           // toNextScreen(exercises);
  //         }
  //       }
  //     }
  //   };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: AppColor.LIGHTGREY2}}>
      <View
        style={{
          flexDirection: 'row',
          //   justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: DeviceWidth * 0.05,
          marginHorizontal: 10,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 40,
          }}>
          <AntIcons name={'arrowleft'} size={20} color={AppColor.BLACK} />
        </TouchableOpacity>
        <Text
          style={{
            color: AppColor.HEADERTEXTCOLOR,
            fontFamily: Fonts.MONTSERRAT_MEDIUM,
            fontSize: 16,
            lineHeight: 20,
            fontWeight: '600',
          }}>
          {focusedPart}
        </Text>
      </View>
      <FlatList
        data={exerciseData}
        renderItem={({item, index}) => <Box item={item} index={index} />}
      />
      <GradientButton
        // flex={0.01}
        text={downloaded ? `Downloading` : 'Start'}
        h={60}
        colors={['#A93737', '#A93737']}
        textStyle={{
          fontSize: 14,
          fontFamily: Fonts.MONTSERRAT_MEDIUM,
          lineHeight: 20,
          fontWeight: '500',
          zIndex: 1,
          color: AppColor.WHITE,
        }}
        alignSelf
        bR={6}
        bottm={40}
        weeklyAnimation={downloaded}
        onPress={getbodyPartWorkout}
      />
    </SafeAreaView>
  );
};

export default NewFocusWorkouts;

const styles = StyleSheet.create({
  small: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 12,
    fontWeight: '500',
    color: AppColor.BoldText,
    lineHeight: 30,
  },
});
