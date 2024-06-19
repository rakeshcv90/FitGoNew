import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  BackHandler,
  SafeAreaView,
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
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import AnimatedLottieView from 'lottie-react-native';
import {CircularProgressBase} from 'react-native-circular-progress-indicator';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
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
import {TextInput} from 'react-native-paper';
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
    if (len == 1) {
      setSelectedIndex(index);
    }
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

            if (!progressUpdateTimeout) {
              progressUpdateTimeout = setTimeout(() => {
                setDownloadProgress(downloadProgressRef.current);
                progressUpdateTimeout = null;
              }, 1000); // Update state every second
            }
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
    if (switchButton) {
      handleItems(item, selectedExercise, setSelectedExercise);
    } else {
      AnalyticsConsole(`${item?.exercise_title?.split(' ')[0]}_DESC`);
      setVisible(true);
    }
  };

  const handleIconPress = (item: any, index: number) => {
    if (switchButton) {
      handleItems(item, selectedExercise, setSelectedExercise);
    } else {
      downloadVideos(item, index, 1).finally(() => {
        setDownloade(0);
        setDownloadProgress(0);
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
                  {/* {item?.exercise_id} */}
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={[styles.small, {textTransform: 'capitalize'}]}>
                    {item?.exercise_rest}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  handleIconPress(item, index);
                  console.log('index--->', index);
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
            <WorkoutsDescription
              data={item}
              open={visible}
              setOpen={setVisible}
            />
          </View>
        );
      },
    [selectedExercise, switchButton],
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
    Promise.all(
      exercise?.map((item: any, index: number) => {
        return downloadVideos(item, index, exercise?.length);
      }),
    ).finally(() => {
      setDownloade(0);
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
        backPressCheck={switchButton}
        onPress={() => {
          setSelectedExercise([]);
          setSwitchButton(false);
          setItemsLength(0);
        }}
        h={Platform.OS == 'ios' ? DeviceWidth * 0.2 : DeviceWidth * 0.15}
        key={CategoryDetails?.id}
      />
      <View style={styles.container}>
        <View
          style={{
            marginVertical: (DeviceWidth * 0.1) / 8,
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
                downloaded
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
              bottm={switchButton ? 0 : -5}
              onPress={() => {
                if (switchButton) {
                  const finalExercises = exercise.filter((item: any) =>
                    selectedExercise.includes(item?.exercise_id),
                  );
                  if (finalExercises?.length > 0) {
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
                bR={6}
                // bottm={5}
                onPress={() => setSwitchButton(true)}
              />
            )}
          </View>
        )}
      </View>
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
});
export default WorkoutCategories;
