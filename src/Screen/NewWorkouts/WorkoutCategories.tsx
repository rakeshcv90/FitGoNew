import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  BackHandler,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {StyleSheet} from 'react-native';
import {AppColor, Fonts, PLATFORM_IOS} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import AnimatedLottieView from 'lottie-react-native';
import {CircularProgressBase} from 'react-native-circular-progress-indicator';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons1 from 'react-native-vector-icons/FontAwesome5';
import Font from 'react-native-vector-icons/FontAwesome5';
import Fontasio from 'react-native-vector-icons/Fontisto';
import {useSelector, useDispatch} from 'react-redux';
import {localImage} from '../../Component/Image';
import {
  NavigationAction,
  NavigationProp,
  useIsFocused,
} from '@react-navigation/native';
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
import {showMessage} from 'react-native-flash-message';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
interface BoxProps {
  item: any;
  index: number;
  downloadProgress: number;
  isItemDownload: boolean;
  isSelected: boolean;
  switchButton: boolean;
}
const WorkoutCategories = ({navigation, route}: any) => {
  const [item, setItem] = useState();
  const {categoryExercise, CategoryDetails} = route?.params;
  const [searchValue, setSearchValue] = useState('');
  const [exercise, setExercise] = useState([]);
  const [filteredExercise, setFilteredExercise] = useState([]);
  const avatarRef = React.createRef();
  const [isLoading, setIsLoading] = useState(true);
  const [switchButton, setSwitchButton] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Array<any>>([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [downloaded, setDownloade] = useState<number>(0);
  const [visible, setVisible] = useState(false);
  const [itemsLength, setItemsLength] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [downloadProgress, setDownloadProgress] = useState(0);
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
  const downloadProgressRef = useRef(0);
  const isFocused = useIsFocused();
  useEffect(() => {
    setExercise(categoryExercise);
    setFilteredExercise(categoryExercise);
    setDownloadProgress(0);
    setDownloade(0);
    setSelectedIndex(-1);
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
  let StoringData: any = {},
    downloadCounter = 0,
    progressUpdateTimeout = null;
  const downloadVideos = async (data: any, index: number, len: number) => {
    const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/${sanitizeFileName(
      data?.exercise_title,
    )}.mp4`;
    try {
      const videoExists = await RNFetchBlob.fs.exists(filePath);
      if (videoExists) {
        StoringData[data?.exercise_title] = filePath;
        downloadCounter++;
        setDownloade((downloadCounter / len) * 100);
        setDownloadProgress(100);
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
          .progress((received, total) => {
            const progress = (received / total) * 100;
            downloadProgressRef.current = progress;
            setDownloadProgress(progress);
            // if (!progressUpdateTimeout) {
            //   progressUpdateTimeout = setTimeout(() => {
            //     setDownloadProgress(downloadProgressRef.current);
            //     progressUpdateTimeout = null;
            //   }, 1000); // Update state every second
            // }
          })
          .then(res => {
            StoringData[data?.exercise_title] = res.path();
            downloadCounter++;
            setDownloade((downloadCounter / len) * 100);
          })
          .catch(err => {
            console.log(err);
          });
      }
      progressUpdateTimeout = null;
      downloadProgressRef.current = 0;
    } catch (error) {
      console.log('ERRRR', error);
    }
    dispatch(setVideoLocation(StoringData));
  };

  const handleItems = useCallback(
    (
      item: any,
      selectedExercise: Array<any>,
      setSelectedExercise: React.Dispatch<React.SetStateAction<Array<any>>>,
    ) => {
      const newSelectedItems = selectedExercise;
      const itemIndex = newSelectedItems.indexOf(item?.exercise_id);

      if (itemIndex === -1) {
        newSelectedItems.push(item?.exercise_id);
      } else {
        newSelectedItems.splice(itemIndex, 1);
      }

      setSelectedExercise(newSelectedItems);
      setItemsLength(newSelectedItems.length);
    },
    [selectedExercise, itemsLength],
  );

  const handlePress = (item: any) => {
    setItem(item);
    if (switchButton) {
      handleItems(item, selectedExercise, setSelectedExercise);
    } else {
      if (!visible) {
        AnalyticsConsole(`${item?.exercise_title?.split(' ')[0]}_DESC`);
        setVisible(true);
      } else {
        console.log(item);
      }
    }
  };

  const handleIconPress = (item: any, index: number) => {
    if (switchButton) {
      handleItems(item, selectedExercise, setSelectedExercise);
    } else {
      downloadVideos(item, index, 1).finally(() => {
        setDownloade(0);
        setDownloadProgress(0);
        setSelectedIndex(-1);
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
    }
  };
  const Box: FC<BoxProps> = useMemo(
    () =>
      ({
        item,
        index,
        isSelected,
        switchButton,
        isItemDownload,
        downloadProgress,
      }) => {
        return (
          <View
            style={{
              borderColor: '#33333314',
              borderBottomWidth: 1,
            }}>
            <TouchableOpacity
              key={index}
              onPress={() => {
                handlePress(item);
              }}
              activeOpacity={switchButton ? 0.8 : 1}
              style={styles.boxContainer}>
              <View style={styles.boxImage}>
                <FastImage
                  // fallback={true}
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
                  marginHorizontal: 15,
                  width: '65%',
                  // backgroundColor: 'lightgreen',
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
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={[styles.small, {textTransform: 'capitalize'}]}>
                    {item?.exercise_rest}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                disabled={isItemDownload}
                onPress={() => {
                  if (isItemDownload || downloadProgress > 0) {
                  } else {
                    setSelectedIndex(index);
                    setDownloadProgress(5);
                    handleIconPress(item, index);
                  }
                }}>
                {switchButton ? (
                  <View
                    style={[
                      styles.boxIconView,
                      {
                        backgroundColor: isSelected
                          ? AppColor.NEW_DARK_RED
                          : 'white',
                        borderColor: isSelected
                          ? AppColor.NEW_DARK_RED
                          : '#33333399',
                      },
                    ]}>
                    {isSelected && <Font name="check" color="white" />}
                  </View>
                ) : isItemDownload && downloadProgress <= 5 ? (
                  <ActivityIndicator
                    color={AppColor.NEW_DARK_RED}
                    animating={isItemDownload && downloadProgress <= 5}
                    size={30}
                  />
                ) : (
                  <CircularProgressBase
                    value={isItemDownload ? downloadProgress : 0}
                    radius={14}
                    activeStrokeColor={AppColor.RED}
                    inActiveStrokeColor="#33333399"
                    activeStrokeWidth={2}
                    inActiveStrokeWidth={2}
                    maxValue={100}>
                    <Icons name={'play'} size={25} color={'#33333399'} />
                  </CircularProgressBase>
                )}
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        );
      },
    [selectedExercise, switchButton, selectedIndex, downloadProgress],
  );

  const handleBackPress = useCallback(() => {
    if (switchButton) {
      setSelectedExercise([]);
      setSwitchButton(false);
      setItemsLength(0);
      return true;
    }
    return false; // Allow default back behavior when switchButton is false
  }, [switchButton]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    return () => backHandler.remove();
  }, [handleBackPress]);
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
    if (getPurchaseHistory?.plan != null) {
      if (
        getPurchaseHistory?.plan == 'premium' &&
        getPurchaseHistory?.end_date >= moment().format('YYYY-MM-DD')
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
    setDownloade(5);
    Promise.all(
      exercise?.map((item: any, index: number) => {
        return downloadVideos(item, index, exercise?.length);
      }),
    ).finally(() => {
      setDownloade(0);
      setDownloadProgress(0);
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
    <SafeAreaView style={{flex: 1, backgroundColor: AppColor.WHITE}}>
      <DietPlanHeader
        header={
          switchButton
            ? `${itemsLength} Exercises selected`
            : CategoryDetails?.bodypart_title == undefined
            ? CategoryDetails?.title
            : CategoryDetails?.bodypart_title
        }
        workoutCat={switchButton}
        // backPressCheck={switchButton}
        backPressCheck={true}
        // onPress={() => {
        //   setSelectedExercise([]);
        //   setSwitchButton(false);
        //   setItemsLength(0);
        // }}
        onPress={() => {
          if (downloaded > 0 || downloadProgress > 0) {
            showMessage({
              message:
                'Please wait, downloading in progress. Do not press back.',
              type: 'info',
              animationDuration: 500,
              floating: true,
              icon: {icon: 'auto', position: 'left'},
            });
          } else if (switchButton) {
            setSelectedExercise([]);
            setSwitchButton(false);
            setItemsLength(0);
          } else {
            navigation?.goBack();
          }
        }}
        h={Platform.OS == 'ios' ? DeviceWidth * 0.2 : DeviceWidth * 0.15}
        key={CategoryDetails?.id}
      />
      <View style={styles.container}>
        <View
          style={{
            width: '90%',
            height: 50,
            alignSelf: 'center',
            backgroundColor: '#F3F5F5',
            borderRadius: 6,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 10,
            // top: -DeviceWidth * 0.05,
            marginVertical: (DeviceWidth * 0.1) / 8,
            justifyContent: 'center',
          }}>
          <Icons1 name="search" size={18} color={'#333333E5'} />
          <TextInput
            placeholder="Search Exercise"
            placeholderTextColor="#33333380"
            value={searchValue}
            onChangeText={text => {
              setSearchValue(text);
              searchFunction(text);
            }}
            style={styles.inputText}
          />
        </View>
        <View style={{height: (DeviceWidth * 0.1) / 4}} />
        <FlatList
          data={filteredExercise}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}: any) => (
            <Box
              item={item}
              index={index}
              isSelected={selectedExercise.includes(item?.exercise_id)}
              switchButton={switchButton}
              isItemDownload={selectedIndex == index}
              downloadProgress={downloadProgress}
            />
          )}
          ListEmptyComponent={emptyComponent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={100}
          removeClippedSubviews={true}
        />
        {filteredExercise.length > 0 && (
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
                downloaded > 0
                  ? `Downloading`
                  : switchButton
                  ? `Start Exercise  (${itemsLength})`
                  : 'Start All Exercises'
              }
              h={50}
              colors={[AppColor.NEW_DARK_RED, AppColor.NEW_DARK_RED]}
              textStyle={styles.buttonText}
              alignSelf
              bR={6}
              normalAnimation={downloaded > 0}
              normalFill={`${100 - downloaded}%`}
              // bottm={switchButton ? 0 : -5}
              bottm={switchButton ? 0 : PLATFORM_IOS ? 10 : -5}
              onPress={() => {
                if (switchButton) {
                  const finalExercises = exercise.filter((item: any) =>
                    selectedExercise.includes(item?.exercise_id),
                  );
                  if (finalExercises?.length > 0 && selectedIndex == -1) {
                    Start(finalExercises);
                  } else {
                    showMessage({
                      message: 'Please select an exercise',
                      type: 'danger',
                      animationDuration: 500,
                      floating: true,
                      icon: {icon: 'auto', position: 'left'},
                    });
                  }
                } else Start(exercise);
              }}
            />

            {!switchButton && (
              <GradientButton
                text={`Select Exercise`}
                h={50}
                colors={[AppColor.WHITE, AppColor.WHITE]}
                textStyle={[styles.buttonText, {color: AppColor.NEW_DARK_RED}]}
                bC="#A93737"
                alignSelf
                bottm={PLATFORM_IOS ? 5 : 0}
                bR={6}
                // bottm={5}
                disabled={downloadProgress > 0}
                onPress={() => {
                  if (downloadProgress == 0) {
                    setSelectedIndex(-1);
                    setSwitchButton(true);
                  }
                }}
              />
            )}
          </View>
        )}
      </View>
      <WorkoutsDescription data={item} open={visible} setOpen={setVisible} />
      {/* {bannerAdsDisplay()} */}
    </SafeAreaView>
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
  boxContainer: {
    flexDirection: 'row',
    padding: 10,
    paddingLeft: 5,
    marginVertical: 5,
    marginHorizontal:
      DeviceHeigth >= 1024 ? DeviceWidth * 0.045 : DeviceWidth * 0.04,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boxImage: {
    height: 60,
    width: 60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxIconView: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25 / 2,
    borderWidth: 1,
  },
  inputText: {
    paddingLeft: 15,
    paddingRight: 15,
    width: '90%',
    height: 50,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    fontFamily: 'Montserrat',
    color: '#000',
  },
});
export default WorkoutCategories;
