import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {memo, useEffect, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import AnimatedLottieView from 'lottie-react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Font from 'react-native-vector-icons/FontAwesome5';
import Fontasio from 'react-native-vector-icons/Fontisto';
import {useSelector, useDispatch} from 'react-redux';
import {localImage} from '../../Component/Image';
import {useIsFocused} from '@react-navigation/native';
import {
  setVideoLocation,
  setWorkoutTimeCal,
} from '../../Component/ThemeRedux/Actions';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import VersionNumber, {appVersion} from 'react-native-version-number';
import moment from 'moment';
import {BannerAdd} from '../../Component/BannerAdd';
import {bannerAdId} from '../../Component/AdsId';
import NativeAddTest from '../../Component/NativeAddTest';
import FastImage from 'react-native-fast-image';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import GradientButton from '../../Component/GradientButton';
import RNFetchBlob from 'rn-fetch-blob';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import WorkoutsDescription from './WorkoutsDescription';
import {TextInput} from 'react-native-paper';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const WorkoutCategories = ({navigation, route}: any) => {
  const [data, setData] = useState([]);
  const {categoryExercise, CategoryDetails} = route?.params;
  const [searchValue, setSearchValue] = useState('');
  const [exercise, setExercise] = useState([]);
  const [filteredExercise, setFilteredExercise] = useState([]);
  const avatarRef = React.createRef();
  const [isLoading, setIsLoading] = useState(true);
  const [switchButton, setSwitchButton] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Array<any>>([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [downloaded, setDownloade] = useState<boolean>(false);

  const dispatch = useDispatch();
  const getCustttomeTimeCal = useSelector(
    (state: any) => state.getCustttomeTimeCal,
  );
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const isFocused = useIsFocused();
  useEffect(() => {
    setExercise(categoryExercise);
    setFilteredExercise(categoryExercise);
  }, []);

  function onLoadEnd() {
    setIsLoading(false);
  }

  function onError() {
    setIsLoading(false);
    setErrorMessage(null);
  }
  function onLoadStart() {
    setIsLoading(true);
    setErrorMessage(null);
  }
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

  const handleItems = (item: any, index: number) => {
    const itemIndex = selectedExercise.findIndex(
      id => id === item?.exercise_id,
    );
    if (itemIndex === -1) {
      // Item not found, add it
      setSelectedExercise(prevSelectedExercise => [
        ...prevSelectedExercise,
        item?.exercise_id,
      ]);
    } else {
      // Item found, remove it
      setSelectedExercise(prevSelectedExercise =>
        prevSelectedExercise.filter(id => id !== item?.exercise_id),
      );
    }
  };

  const Box = useMemo(
    () =>
      ({item, index}: any) => {
        const [isLoading, setIsLoading] = useState(true);
        const [visible, setVisible] = useState(false);
        const avatarRef = React.createRef();
        return (
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
              marginHorizontal: 16,
              justifyContent: 'space-between',
              alignItems: 'center',
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
                marginHorizontal: 20,
                marginTop: 5,
                width: '60%',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                  fontSize: 16,
                  fontWeight: '600',
                  color: AppColor.LITELTEXTCOLOR,
                  lineHeight: 24,
                }}>
                {item?.exercise_title}
                {/* {item?.exercise_id} */}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.small}>{item?.exercise_rest}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                switchButton
                  ? handleItems(item, index)
                  : Promise.resolve(
                      downloadVideos(item, index, 1),
                    ).finally(() => {
                      navigation.navigate('Exercise', {
                        allExercise: [item],
                        currentExercise: item,
                        data: CategoryDetails,
                        day: -12,
                        exerciseNumber: 0,
                        trackerData: [],
                        type: 'focus',
                        challenge: false,
                      });
                    });
              }}>
              {switchButton ? (
                <View
                  style={{
                    width: 25,
                    height: 25,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: selectedExercise.includes(
                      item?.exercise_id,
                    )
                      ? '#A93737'
                      : 'white',
                    borderColor: selectedExercise.includes(item?.exercise_id)
                      ? '#A93737'
                      : '#33333399',
                    borderRadius: 25 / 2,
                    borderWidth: 1,
                  }}>
                  {selectedExercise.includes(item?.exercise_id) && (
                    <Font name="check" color="white" />
                  )}
                </View>
              ) : (
                <AntDesign name="playcircleo" color="#33333399" size={25} />
              )}
            </TouchableOpacity>
            <WorkoutsDescription
              data={item}
              open={visible}
              setOpen={setVisible}
            />
          </TouchableOpacity>
        );
      },
    [selectedExercise, switchButton],
  );

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
            height: DeviceHeigth * 0.6,
          }}
        />
      </View>
    );
  };
  const bannerAdsDisplay = () => {
    if (getPurchaseHistory.length > 0) {
      if (
        getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
      ) {
        return null;
      } else {
        return <BannerAdd bannerAdId={bannerAdId} />;
      }
    } else {
      return <BannerAdd bannerAdId={bannerAdId} />;
    }
  };
  const getAdsDisplay = (item: any, index: number) => {
    if (exercise.length >= 1) {
      if (index == 0 && exercise.length > 1) {
        return getNativeAdsDisplay();
      } else if ((index + 1) % 8 == 0 && exercise.length > 8) {
        return getNativeAdsDisplay();
      }
    }
  };
  const getNativeAdsDisplay = () => {
    if (getPurchaseHistory.length > 0) {
      if (
        getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
      ) {
        return null;
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
  const searchFunction = (text: string) => {
    const searchArray = exercise.filter((item: any) =>
      item?.exercise_title.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredExercise(searchArray);
  };

  const Start = (exercise: Array<any>) => {
    Promise.all(
      exercise?.map((item: any, index: number) => {
        return downloadVideos(item, index, exercise?.length);
      }),
    ).finally(() => {
      navigation.navigate('Exercise', {
        allExercise: exercise,
        currentExercise: exercise[0],
        data: CategoryDetails,
        day: -12,
        exerciseNumber: 0,
        trackerData: [],
        type: 'focus',
        challenge: false,
      });
    });
  };
  return (
    <>
      <DietPlanHeader
        header={
          switchButton
            ? `${selectedExercise.length} Exercises selected`
            : CategoryDetails?.bodypart_title == undefined
            ? CategoryDetails?.title
            : CategoryDetails?.bodypart_title
        }
        SearchButton={false}
        backButton
        workoutCat={switchButton}
        backPressCheck={switchButton}
        onPress={() => setSwitchButton(false)}
        onPressImage={null}
        source={null}
        key={CategoryDetails?.id}
      />
      <View style={styles.container}>
        <View
          style={{
            // flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TextInput
            value={searchValue}
            placeholder="Search Exercise"
            left={
              <TextInput.Icon
                icon={() => <Fontasio name="search" size={15} />}
              />
            }
            underlineStyle={{
              borderColor: '#F3F5F5',
              borderWidth: 1,
              borderRadius: 10,
            }}
            onChangeText={text => {
              setSearchValue(text);
              searchFunction(text);
            }}
            style={[
              styles.small,
              {
                color: '#33333380',
                fontSize: 14,
                backgroundColor: '#F3F5F5',
                width: DeviceWidth * 0.9,
              },
            ]}
          />
        </View>
        <FlatList
          data={filteredExercise}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => <Box item={item} index={index} />}
          ListEmptyComponent={emptyComponent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={100}
          removeClippedSubviews={true}
        />
        <View
          style={{
            width: DeviceWidth,
            alignItems: 'center',
            backgroundColor: 'white',
            height: switchButton ? DeviceHeigth * 0.08 : DeviceHeigth * 0.16,
          }}>
          {/* {!switchButton && ( */}
          <GradientButton
            // flex={0.01}
            text={
              downloaded
                ? `Downloading`
                : switchButton
                ? `Select Exercise  (${selectedExercise.length})`
                : 'Start All'
            }
            h={50}
            colors={['#A93737', '#A93737']}
            textStyle={styles.buttonText}
            alignSelf
            bR={6}
            bottm={switchButton ? 0 : -5}
            weeklyAnimation={downloaded}
            onPress={() => {
              if (switchButton) {
                const finalExercises = exercise.filter((item: any) =>
                  selectedExercise.includes(item?.exercise_id),
                );
                Start(finalExercises);
              } else Start(exercise);
            }}
          />

          {!switchButton && (
            <GradientButton
              text={`Select Exercise`}
              h={50}
              colors={[AppColor.WHITE, AppColor.WHITE]}
              textStyle={[styles.buttonText, {color: '#A93737'}]}
              bC="#A93737"
              alignSelf
              bR={6}
              bottm={5}
              onPress={() => setSwitchButton(true)}
            />
          )}
        </View>
      </View>
      {/* {bannerAdsDisplay()} */}
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
  loader: {
    position: 'absolute',
    justifyContent: 'center',

    backgroundColor: AppColor.GRAY,
    zIndex: 1,
    height: 70,
    width: 70,
    left: 0,
    borderRadius: 5,
  },
  small: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 12,
    fontWeight: '500',
    color: '#1E1E1ECC',
    lineHeight: 20,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    lineHeight: 20,
    fontWeight: '500',
    zIndex: 1,
    color: AppColor.WHITE,
  },
});
export default WorkoutCategories;
