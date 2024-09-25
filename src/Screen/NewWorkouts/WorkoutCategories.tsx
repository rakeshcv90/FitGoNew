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
  VirtualizedList,
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
  setEquipmentExercise,
  setExerciseInTime,
  setExerciseOutTime,
  setVideoLocation,
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
import OverExerciseModal from '../../Component/Utilities/OverExercise';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import FitIcon from '../../Component/Utilities/FitIcon';
import RBSheet from 'react-native-raw-bottom-sheet';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
interface BoxProps {
  item: any;
  index: number;
  downloadProgress: number;
  isItemDownload: boolean;
}

const format = 'hh:mm:ss';

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
  const [downloaded, setDownloade] = useState<number>(0);
  const [visible, setVisible] = useState(false);
  const [itemsLength, setItemsLength] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [start, setStart] = useState(false);
  const [overExerciseVisible, setOverExerciseVisible] = useState(false);
  const dispatch = useDispatch();

  const refStandard = useRef();
  const getEquipmentExercise = useSelector(
    (state: any) => state.getEquipmentExercise,
  );
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const downloadProgressRef = useRef(0);
  const isFocused = useIsFocused();
  useEffect(() => {
    // setExercise(categoryExercise);
    // setFilteredExercise(categoryExercise);
    filterExercises(getEquipmentExercise)
    setDownloadProgress(0);
    setDownloade(0);
    setSelectedIndex(-1);
  }, [isFocused]);

  const getExerciseInTime = useSelector(
    (state: any) => state.getExerciseInTime,
  );
  const getExerciseOutTime = useSelector(
    (state: any) => state.getExerciseOutTime,
  );

  // useEffect(() => {
  //   if (start && getExerciseOutTime == '') {
  //     dispatch(setExerciseInTime(moment().format(format)));
  //     dispatch(setExerciseOutTime(moment().add(45, 'minutes').format(format)));
  //     console.warn('STARTING', moment().format(format), getExerciseOutTime);
  //   }
  //   if (
  //     getExerciseInTime < getExerciseOutTime &&
  //     !start &&
  //     getExerciseOutTime != ''
  //   ) {
  //     console.warn('COMPLETEE', moment().format(format), getExerciseOutTime);
  //     dispatch(setExerciseInTime(moment().format(format)));
  //   }
  // }, [getExerciseInTime, getExerciseOutTime, start]);

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
        setVisible(true);
      } else {
        console.log(item);
      }
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);
  const handleIconPress = (item: any, index: number) => {
    setSelectedIndex(index);
    // setDownloadProgress(5);
    if (switchButton) {
      handleItems(item, selectedExercise, setSelectedExercise);
    } else {
      AnalyticsConsole('S_E_S_WC');
      setStart(true);
      downloadVideos(item, index, 1).finally(() => {
        setDownloade(0);
        setStart(false);
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

  // const handleBackPress = useCallback(() => {
  //   if (switchButton) {
  //     setSelectedExercise([]);
  //     setSwitchButton(false);
  //     setItemsLength(0);
  //     return true;
  //   }
  //   return false; // Allow default back behavior when switchButton is false
  // }, [switchButton]);

  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     handleBackPress,
  //   );
  //   return () => backHandler.remove();
  // }, [handleBackPress]);
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
  const getAdsDisplay = (index, item) => {
    const noOrNoobPlan =
      getPurchaseHistory?.plan == null || getPurchaseHistory?.plan == 'noob';
    if (filteredExercise.length >= 1) {
      if (index == 0 && filteredExercise.length > 1 && noOrNoobPlan) {
        return getNativeAdsDisplay();
      } else if ((index + 1) % 9 == 0 && filteredExercise.length > 9) {
        if (index + 1 == filteredExercise.length) return null;
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

  const searchFunction = (text: string) => {
    const searchArray = exercise.filter((item: any) =>
      item?.exercise_title.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredExercise(searchArray);
  };

  const Start = (exercise: Array<any>) => {
    if (
      getExerciseOutTime != '' &&
      moment().format(format) > getExerciseOutTime
    ) {
      console.warn(
        'SHOWINGDF',
        moment().format(format),
        getExerciseInTime,
        getExerciseOutTime,
      );
      setOverExerciseVisible(true);
    } else {
      setDownloade(5);
      setStart(true);
      Promise.all(
        exercise?.map((item: any, index: number) => {
          return downloadVideos(item, index, exercise?.length);
        }),
      ).finally(() => {
        setDownloade(0);
        setStart(false);
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
    }
  };

  const Box: FC<BoxProps> = useMemo(
    () =>
      ({item, index, isItemDownload, downloadProgress}) => {
        const time = parseInt(item?.exercise_rest.split(' ')[0]);
        const showAds = (index + 1) % 9 == 0;
        const isSelected = selectedExercise.includes(item?.exercise_id);

        return (
          <>
            <View
              style={{
                borderColor: '#33333314',
                borderBottomWidth: 1,
              }}>
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (isItemDownload || downloadProgress > 0) {
                  } else handlePress(item);
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
                    width: DeviceHeigth >= 1024 ? '80%' : '65%',
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
                      {'Time - ' +
                        '1 x ' +
                        (time > 60
                          ? Math.floor(time / 60) + ' min'
                          : time + ' sec')}{' '}
                      |{' '}
                    </Text>
                    <Text style={[styles.small, {textTransform: 'capitalize'}]}>
                      {'Set - ' + item?.exercise_sets}
                    </Text>
                  </View>
                </View>
                {switchButton ? (
                  <TouchableOpacity
                    onPress={() => {
                      handleIconPress(item, index);
                    }}>
                    <View
                      style={[
                        styles.boxIconView,
                        {
                          backgroundColor: isSelected ? '#f0013b' : 'white',
                          borderColor: isSelected ? '#f0013b' : '#33333399',
                        },
                      ]}>
                      {isSelected && <Font name="check" color="white" />}
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    disabled={isItemDownload}
                    onPress={() => {
                      if (isItemDownload || downloadProgress > 0) {
                      } else {
                        handleIconPress(item, index);
                      }
                    }}>
                    {isItemDownload && downloadProgress <= 5 ? (
                      <ActivityIndicator
                        color={AppColor.NEW_DARK_RED}
                        animating={isItemDownload && downloadProgress <= 5}
                        size={30}
                      />
                    ) : (
                      <CircularProgressBase
                        value={
                          isItemDownload && downloadProgress > 5
                            ? downloadProgress
                            : 0
                        }
                        radius={14}
                        activeStrokeColor={AppColor.RED}
                        inActiveStrokeColor="#33333399"
                        activeStrokeWidth={2}
                        inActiveStrokeWidth={2}
                        maxValue={100}>
                        <Image
                          source={localImage.ExercisePlay}
                          tintColor={selectedIndex != index ? '#565656' : ''}
                          resizeMode="contain"
                          style={{
                            width: 12,
                            height: 12,
                            alignSelf: 'center',
                          }}
                        />
                      </CircularProgressBase>
                    )}
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </View>
            {/* {getAdsDisplay(index, item)} */}
            {showAds && (
              <View
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                }}>
                <NativeAddTest type="image" media={false} />
              </View>
            )}
          </>
        );
      },
    [switchButton, selectedExercise, downloadProgress],
  );
  const getItem = (data: [], index: number) => {
    return data[index];
  };

  const getItemCount = (data: []) => {
    return data.length;
  };

  const filterExercises = (adjust: number) => {
    // Define the equipment filter logic
    const exerciseCat = (exerciseEquip: string) => {
      if (adjust === 0) {
        return exerciseEquip !== 'No Equipment'; // Exclude 'No Equipment' exercises if selected equipment
      }
      return exerciseEquip === 'No Equipment'; // Include only 'No Equipment' exercises otherwise
    };
    const modifiedExercise = categoryExercise.filter((item: any) =>
      exerciseCat(item?.exercise_equipment),
    );
    dispatch(setEquipmentExercise(adjust));
    setExercise(modifiedExercise);
    setFilteredExercise(modifiedExercise);
  };
  const BottomSheet = () => {
    const [adjustSelected, setAdjustSelelcted] = useState(getEquipmentExercise);
    const isFilterChanged = adjustSelected !== getEquipmentExercise; // extra condition for adjust change detection
    const adjustArray = [
      {
        image: localImage.Workout,
        text: 'With Equipment',
      },
      {
        image: require('../../Icon/Images/NewHome/WithoutEquipment.png'),
        text: 'Without Equipment',
      },
    ];
    return (
      <>
        <RBSheet
          ref={refStandard}
          // draggable
          closeOnPressMask={false}
          customModalProps={{
            animationType: 'slide',
            statusBarTranslucent: true,
          }}
          customStyles={{
            container: {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              height:
                DeviceHeigth >= 1024
                  ? DeviceHeigth * 0.28
                  : DeviceHeigth >= 856
                  ? DeviceHeigth * 0.38
                  : DeviceHeigth <= 667
                  ? DeviceHeigth <= 625
                    ? DeviceHeigth * 0.58
                    : DeviceHeigth * 0.53
                  : DeviceHeigth * 0.53,
            },
            draggableIcon: {
              width: 80,
            },
          }}>
          <View style={styles.listContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: DeviceWidth * 0.9,
                alignSelf: 'center',
                alignItems: 'center',
                // top: -10,
              }}>
              <View />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  lineHeight: 24,
                  fontFamily: Fonts.MONTSERRAT_BOLD,
                  color: '#1E1E1E',
                  marginLeft: DeviceWidth * 0.06,
                }}>
                Filter
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  AnalyticsConsole('CL_BS_FW');
                  // handleFilterVisibilty();
                  refStandard.current?.close();
                }}>
                <Icons name={'close'} size={24} color={AppColor.BLACK} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: DeviceWidth,
                height: 1,
                backgroundColor: '#1E1E1E',
                opacity: 0.2,
                marginVertical: 16,
                alignSelf: 'center',
              }}
            />
            <View style={{width: DeviceWidth * 0.9, alignSelf: 'center'}}>
              <Text
                style={{
                  color: AppColor.BLACK,
                  fontFamily: Fonts.HELVETICA_BOLD,
                  fontSize: 16,
                  marginBottom: 16,
                }}>
                Adjust
              </Text>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 15,
                }}
                onPress={() => setAdjustSelelcted(prev => (prev == 0 ? 1 : 0))}>
                {adjustArray.map((item, index) => (
                  <View
                    style={{
                      width: DeviceWidth / 2.3,
                      backgroundColor: '#F9F9F9',
                      borderRadius: 10,
                      borderWidth: 1.5,
                      borderColor:
                        adjustSelected == index ? AppColor.RED : '#F9F9F9',
                    }}>
                    <Image
                      source={item.image}
                      style={{
                        width: 35,
                        height: 35,
                        alignSelf: 'center',
                        marginTop: 12,
                      }}
                      tintColor={
                        adjustSelected == index
                          ? AppColor.RED
                          : AppColor.SecondaryTextColor
                      }
                    />
                    <Text
                      style={{
                        textAlign: 'center',
                        color: AppColor.BLACK,
                        fontFamily: Fonts.HELVETICA_BOLD,
                        marginBottom: 12,
                        marginTop: 4,
                      }}>
                      {item.text}
                    </Text>
                    <Icons
                      style={{position: 'absolute', right: 12, top: 10}}
                      name={
                        adjustSelected == index
                          ? 'check-circle'
                          : 'checkbox-blank-circle-outline'
                      }
                      size={25}
                      color={
                        adjustSelected == index
                          ? AppColor.RED
                          : AppColor.SecondaryTextColor
                      }
                    />
                  </View>
                ))}
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 150,
                  height: 50,
                  backgroundColor: AppColor.RED,
                  borderRadius: 6,
                  alignSelf: 'flex-end',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: !isFilterChanged ? 0.6 : 1,
                }}
                disabled={!isFilterChanged ? true : false}
                onPress={() => {
                  filterExercises(adjustSelected);
                }}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 14,
                    fontWeight: '500',
                    lineHeight: 20,

                    textAlign: 'center',
                    fontFamily: Fonts.MONTSERRAT_MEDIUM,
                  }}>
                  Show Result
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
      </>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: AppColor.WHITE}}>
      <Wrapper>
        <NewHeader1
          header={
            switchButton
              ? `${itemsLength} selected`
              : CategoryDetails?.bodypart_title == undefined
              ? CategoryDetails?.title
              : CategoryDetails?.bodypart_title
          }
          backButton
          workoutCat={switchButton}
          onBackPress={() => {
            if (downloaded > 0 || (downloadProgress > 0 && switchButton)) {
              showMessage({
                message:
                  'Please wait, downloading in progress. Do not press back.',
                type: 'info',
                animationDuration: 500,
                floating: true,
                icon: {icon: 'auto', position: 'left'},
              });
            } else if (switchButton) {
              AnalyticsConsole('CL_SE_WC');
              setSelectedExercise([]);
              setSelectedIndex(-1);
              setSwitchButton(false);
              setItemsLength(0);
              setDownloadProgress(6);
            } else {
              navigation?.goBack();
            }
          }}
          onIconPress={() => {
            AnalyticsConsole('O_BS_FW');
            refStandard.current.open();
          }}
          icon
          iconSource={require('../../Icon/Images/NewImage2/filter.png')}
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
          <VirtualizedList
            data={filteredExercise}
            keyExtractor={(item, index) => index.toString()}
            getItem={getItem}
            getItemCount={getItemCount}
            initialNumToRender={10}
            renderItem={({item, index}: any) => {
              return (
                <Box
                  item={item}
                  index={index}
                  isItemDownload={selectedIndex == index}
                  downloadProgress={downloadProgress}
                />
              );
            }}
            ListEmptyComponent={emptyComponent}
            showsVerticalScrollIndicator={false}
          />
          {filteredExercise.length > 0 && (
            <View
              style={{
                width: DeviceWidth,
                alignItems: 'center',
                backgroundColor: 'white',
                height: (DeviceHeigth * 0.16) / 2,
              }}>
              {/* {!switchButton && ( */}
              <GradientButton
                // flex={0.01}
                text={
                  downloaded > 0
                    ? `Downloading`
                    : switchButton
                    ? `Start Workout`
                    : 'Select Exercises'
                }
                h={50}
                colors={['#f0013b', '#f0013b']}
                textStyle={styles.buttonText}
                alignSelf
                bR={6}
                normalAnimation={downloaded > 0}
                normalFill={`${100 - downloaded}%`}
                // bottm={switchButton ? 0 : -5}
                bottm={PLATFORM_IOS ? 10 : -5}
                // disabled={switchButton && downloadProgress > 1}
                onPress={() => {
                  if (switchButton) {
                    const finalExercises = exercise.filter((item: any) =>
                      selectedExercise.includes(item?.exercise_id),
                    );
                    if (finalExercises?.length > 0) {
                      AnalyticsConsole('S_SE_WC');
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
                  } else {
                    setDownloadProgress(0);
                    setSelectedIndex(-1);
                    setSwitchButton(true);
                  }
                }}
              />
            </View>
          )}
        </View>
      </Wrapper>
      <WorkoutsDescription data={item} open={visible} setOpen={setVisible} />
      <OverExerciseModal
        setOverExerciseVisible={setOverExerciseVisible}
        overExerciseVisible={overExerciseVisible}
      />
      <BottomSheet />
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
    lineHeight: 30,
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
  listContainer: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
  },
});
export default WorkoutCategories;
