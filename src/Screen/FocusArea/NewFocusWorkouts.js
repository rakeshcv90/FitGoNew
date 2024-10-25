import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Platform,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {BannerAdd} from '../../Component/BannerAdd';
import {bannerAdId} from '../../Component/AdsId';
import NativeAddTest from '../../Component/NativeAddTest';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import RBSheet from 'react-native-raw-bottom-sheet';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedLottieView from 'lottie-react-native';
import FastImage from 'react-native-fast-image';
import {localImage} from '../../Component/Image';
import Button from '../../Component/Button';
import WorkoutsDescription from '../NewWorkouts/WorkoutsDescription';
import {CircularProgressBase} from 'react-native-circular-progress-indicator';

import {
  setCoreCount,
  setCoreFilOpt,
  setEquipmentExercise,
  setExerciseInTime,
  setExerciseOutTime,
  setLowerBodyCount,
  setLowerBodyFilOpt,
  setUprBdyOpt,
  setUprBodyCount,
  setVideoLocation,
} from '../../Component/ThemeRedux/Actions';
import RNFetchBlob from 'rn-fetch-blob';
import GradientButton from '../../Component/GradientButton';
import {getActiveTrackIndex} from 'react-native-track-player/lib/src/trackPlayer';
import NewButton from '../../Component/NewButton';
import {showMessage} from 'react-native-flash-message';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import NewButton2 from '../../Component/NewButton2';
import moment from 'moment';
import OverExerciseModal from '../../Component/Utilities/OverExercise';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import BottomSheet1 from '../../Component/BottomSheet';

const format = 'hh:mm:ss';

const NewFocusWorkouts = ({route, navigation}) => {
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getUperBodyFilOption = useSelector(
    state => state?.getUperBodyFilOption,
  );
  const getLowerBodyFilOpt = useSelector(state => state.getLowerBodyFilOpt);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const getCoreFiltOpt = useSelector(state => state.getCoreFiltOpt);
  const exerciseData = route?.params?.focusExercises;
  const searchCriteria = route?.params?.searchCriteria;
  const searchCriteriaRedux = route?.params?.searchCriteriaRedux;
  const [filterList, setFilterList] = useState(exerciseData);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const getUprBodyCount = useSelector(state => state.getUprBodyCount);
  const getLowerBodyCount = useSelector(state => state.getLowerBodyCount);
  const getCoreCount = useSelector(state => state.getCoreCount);
  const getExerciseCount = useSelector(state => state.getExerciseCount);
  const [visible, setVisible] = useState(false);
  const CategoryDetails = route.params?.CategoryDetails;
  const [item, setitem] = useState();
  const [downloaded, setDownloade] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState();
  const [searchFilterList, setSearchFilterList] = useState([]);
  const [start, setStart] = useState(false);
  const [overExerciseVisible, setOverExerciseVisible] = useState(false);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState(new Set());
  const [startSelection, setStartSelection] = useState(false);
  const getEquipmentExercise = useSelector(
    state => state?.getEquipmentExercise,
  );
  const bottomSheetRef = useRef();
  const dispatch = useDispatch();
  const uperBody = [
    {
      id: 1,
      title: 'Chest',
      ima: require('../../Icon/Images/NewImage2/chest.png'),
      exCount: getExerciseCount?.exCount1 ?? 0,
    },
    {
      id: 2,
      title: 'Back',
      ima: require('../../Icon/Images/NewImage2/back.png'),
      exCount: getExerciseCount?.exCount2 ?? 0,
    },
    {
      id: 3,
      title: 'Shoulders',
      ima: require('../../Icon/Images/NewImage2/shoulder.png'),
      exCount: getExerciseCount?.exCount3 ?? 0,
    },
    {
      id: 4,
      title: 'Arms',
      ima: require('../../Icon/Images/NewImage2/arms.png'),
      exCount: getExerciseCount?.exCount4 ?? 0,
    },
  ];

  const lowerBody = [
    {
      id: 1,
      title: 'Legs',
      ima: require('../../Icon/Images/NewImage2/calves.png'),
      exCount: getExerciseCount?.exCount1 ?? 0,
    },
    // {
    //   id: 2,
    //   title: 'Quads',
    //   ima: require('../../Icon/Images/NewImage2/quards.png'),
    //   exCount: getExerciseCount?.exCount2 ?? 0,
    // },
    {
      id: 2,
      title: 'Calves',
      ima: require('../../Icon/Images/NewImage2/calves.png'),
      exCount: getExerciseCount?.exCount3 ?? 0,
    },
  ];
  const core = [
    {
      id: 1,
      title: 'Abs',
      ima: require('../../Icon/Images/NewImage2/core.png'),
      exCount: getExerciseCount?.exCount1 ?? 0,
    },
    {
      id: 2,
      title: 'Cardio',
      ima: require('../../Icon/Images/NewImage2/Cardio.png'),
      exCount: getExerciseCount?.exCount2 ?? 0,
    },
  ];

  useEffect(() => {
    // delay for smooth animation
    setTimeout(() => {
      if (route?.params?.focusedPart == 'Upper Body' && getUprBodyCount == 0) {
        bottomSheetRef.current?.openSheet();
      } else if (
        route?.params?.focusedPart == 'Lower Body' &&
        getLowerBodyCount == 0
      ) {
        bottomSheetRef.current?.openSheet();
      } else if (route?.params?.focusedPart == 'Core' && getCoreCount == 0) {
        bottomSheetRef.current?.openSheet();
      }
      // else {
      //   bottomSheetRef.current?.openSheet();
      // }
    }, 1000);
  }, [route]);
  // automatic filter when user comes to this screen
  useEffect(() => {
    if (searchCriteriaRedux?.length == 0) {
      filterExercises(exerciseData, searchCriteria, getEquipmentExercise);
    } else {
      filterExercises(exerciseData, searchCriteriaRedux, getEquipmentExercise);
    }
  }, []);

  const getExerciseInTime = useSelector(state => state.getExerciseInTime);
  const getExerciseOutTime = useSelector(state => state.getExerciseOutTime);

  useEffect(() => {
    if (start && getExerciseOutTime == '') {
      dispatch(setExerciseInTime(moment().format(format)));
      dispatch(setExerciseOutTime(moment().add(45, 'minutes').format(format)));
      console.warn('STARTING', moment().format(format), getExerciseOutTime);
    }
    if (
      getExerciseInTime < getExerciseOutTime &&
      !start &&
      getExerciseOutTime != ''
    ) {
      console.warn('COMPLETEE', moment().format(format), getExerciseOutTime);
      dispatch(setExerciseInTime(moment().format(format)));
    }
  }, [getExerciseInTime, getExerciseOutTime, start]);

  const isFocused = useIsFocused();
  useEffect(() => {
    setDownloadProgress(0);
    setDownloade(0);
    setSelectedIndex(-1);
  }, [isFocused]);
  const filterExercises = (exercises, filterCriteria, adjust) => {
    let modifiedFilter = [...filterCriteria]; // Create a copy of filterCriteria
    if (filterCriteria.length === 0) {
      // Define the equipment filter logic
      const exerciseCat = exerciseEquip => {
        if (adjust === 0) {
          return exerciseEquip !== 'No Equipment'; // Exclude 'No Equipment' exercises if selected equipment
        }
        return exerciseEquip === 'No Equipment'; // Include only 'No Equipment' exercises otherwise
      };

      // Apply filter based on body part and equipment
      const filteredList = exercises.filter(exercise =>
        exerciseCat(exercise?.exercise_equipment),
      );
      dispatch(setEquipmentExercise(adjust));
      setFilterList(filteredList); // Update the filter list with the filtered results
    } else {
      // Handle 'Arms' replacement logic
      if (modifiedFilter.includes('Arms')) {
        modifiedFilter = modifiedFilter.filter(item => item !== 'Arms'); // Remove 'Arms'
        modifiedFilter.push('Biceps', 'Triceps', 'Forearms'); // Add specific muscles
      }

      // Check if 'Shoulders' is being added and remove 'Arms' if necessary
      if (modifiedFilter.includes('Shoulders')) {
        modifiedFilter = modifiedFilter.filter(item => item !== 'Arms');
      }

      // Define the equipment filter logic
      const exerciseCat = exerciseEquip => {
        if (adjust === 0) {
          return exerciseEquip !== 'No Equipment'; // Exclude 'No Equipment' exercises if selected equipment
        }
        return exerciseEquip === 'No Equipment'; // Include only 'No Equipment' exercises otherwise
      };

      // Apply filter based on body part and equipment
      const filteredList = exercises.filter(
        exercise =>
          modifiedFilter.includes(exercise.exercise_bodypart) &&
          exerciseCat(exercise?.exercise_equipment),
      );
      dispatch(setEquipmentExercise(adjust));
      setFilterList(filteredList); // Update the filter list with the filtered results
    }

    const focusedPart = route?.params?.focusedPart;
    if (focusedPart === 'Upper Body') {
      dispatch(setUprBdyOpt(filterCriteria));
    } else if (focusedPart === 'Lower Body') {
      dispatch(setLowerBodyFilOpt(filterCriteria));
    } else if (focusedPart === 'Core') {
      dispatch(setCoreFilOpt(filterCriteria));
    } else {
      return searchCriteria;
    }
  };
  const handleFilterVisibilty = () => {
    bottomSheetRef.current?.closeSheet();
    const focusedPart = route?.params?.focusedPart;
    if (focusedPart === 'Upper Body') {
      dispatch(setUprBodyCount(1));
    } else if (focusedPart === 'Lower Body') {
      dispatch(setLowerBodyCount(1));
    } else if (focusedPart === 'Core') {
      dispatch(setCoreCount(1));
    }
  };
  const updateFilteredCategories = text => {
    const filteredItems = filterList.filter(item =>
      item.exercise_title.toLowerCase().includes(text.toLowerCase()),
    );
    setSearchFilterList(filteredItems);
  };

  const getAdsDisplay = (index, item) => {
    const noOrNoobPlan =
      getPurchaseHistory?.plan == null || getPurchaseHistory?.plan == 'noob';
    if (filterList.length >= 1) {
      if (index == 0 && filterList.length > 1 && noOrNoobPlan) {
        return getNativeAdsDisplay();
      } else if ((index + 1) % 9 == 0 && filterList.length > 9) {
        if (index + 1 == filterList.length) return null;
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

  const BottomSheetContent = () => {
    const determineFilterCriteria = (
      route,
      getUperBodyFilOption,
      getLowerBodyFilOpt,
      getCoreFiltOpt,
      searchCriteria,
    ) => {
      const focusedPart = route?.params?.focusedPart;
      if (focusedPart === 'Upper Body') {
        return getUperBodyFilOption.length === 0
          ? searchCriteria
          : getUperBodyFilOption;
      } else if (focusedPart === 'Lower Body') {
        return getLowerBodyFilOpt.length === 0
          ? searchCriteria
          : getLowerBodyFilOpt;
      } else if (focusedPart === 'Core') {
        return getCoreFiltOpt.length === 0 ? searchCriteria : getCoreFiltOpt;
      } else {
        return searchCriteria;
      }
    };
    const [adjustSelected, setAdjustSelelcted] = useState(getEquipmentExercise);
    const [filterCritera, setFilterCriteria] = useState(
      determineFilterCriteria(
        route,
        getUperBodyFilOption,
        getLowerBodyFilOpt,
        getCoreFiltOpt,
        searchCriteria,
      ),
    );
    // handle whenever filter data changes
    const handleFilterChange = bodyPart => {
      setFilterCriteria(prev =>
        prev.includes(bodyPart)
          ? prev.filter(item => item !== bodyPart)
          : [...prev, bodyPart],
      );
    };
    // to check if there are any changes in filter
    const arraysAreEqual = (arr1, arr2) => {
      if (arr1.length !== arr2.length) return false;
      const sortedArr1 = [...arr1].sort();
      const sortedArr2 = [...arr2].sort();
      return sortedArr1.every((value, index) => value === sortedArr2[index]);
    };
    const isFilterChanged =
      !arraysAreEqual(
        filterCritera,
        determineFilterCriteria(
          route,
          getUperBodyFilOption,
          getLowerBodyFilOpt,
          getCoreFiltOpt,
          searchCriteria,
        ),
      ) || adjustSelected !== getEquipmentExercise; // extra condition for adjust change detection
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
    const isFullBody = route?.params?.focusedPart == 'Full Body';
    const checkFullHeight = isFullBody ? DeviceHeigth * 0.15 : 0;

    return (
      <View style={styles.listContainer}>
        <Icon
          name="close"
          size={27}
          color={AppColor.BLACK}
          onPress={() => bottomSheetRef.current?.closeSheet()}
          style={styles.closeStyle}
        />
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            lineHeight: 24,
            fontFamily: Fonts.MONTSERRAT_BOLD,
            color: '#1E1E1E',
            marginLeft: DeviceWidth * 0.06,
            textAlign: 'center',
          }}>
          {isFullBody ? 'Adjust' : 'Filter'}
        </Text>
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
        {!isFullBody && (
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              lineHeight: 24,
              fontFamily: Fonts.MONTSERRAT_BOLD,
              color: '#1E1E1E',

              width: DeviceWidth * 0.9,
              alignSelf: 'center',
            }}>
            {route?.params?.focusedPart}
          </Text>
        )}
        <View
          style={{
            //height: DeviceHeigth * 0.35,
            marginTop: 20,
            justifyContent: 'center',
            width: DeviceWidth * 0.9,
            alignSelf: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <FlatList
            data={
              route?.params?.focusedPart == 'Upper Body'
                ? uperBody
                : route?.params?.focusedPart == 'Lower Body'
                ? lowerBody
                : route?.params?.focusedPart == 'Core'
                ? core
                : []
            }
            numColumns={2}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => {
              return (
                <>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      handleFilterChange(item?.title);
                    }}
                    style={{
                      // marginHorizontal: 10,
                      marginEnd: 20,
                      width: DeviceWidth / 2.4,
                      //height: 124,
                      justifyContent: 'space-between',
                      marginBottom: 20,
                      alignSelf: 'center',
                      backgroundColor: '#F9F9F9',
                      flexDirection: 'row',
                      borderRadius: 10,
                      borderWidth: 1.5,
                      borderColor: filterCritera.includes(item.title)
                        ? AppColor.RED
                        : AppColor.LIGHTGREY2,
                    }}>
                    <View
                      style={{
                        width: 25,
                        height: 25,
                        top: 15,
                        left: 10,
                      }}
                    />
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={item.ima}
                        // onLoad={() => setImageLoad(false)}
                        defaultSource={localImage?.NOWORKOUT}
                        style={{
                          width: 50,
                          height: 60,
                          justifyContent: 'center',
                          alignSelf: 'center',
                        }}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 15,
                          fontWeight: '600',
                          lineHeight: 20,
                          marginVertical: 5,
                          textAlign: 'center',
                          fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                        }}>
                        {item.title}
                      </Text>
                    </View>
                    <Icon
                      name={
                        filterCritera.includes(item.title)
                          ? 'check-circle'
                          : 'checkbox-blank-circle-outline'
                      }
                      size={25}
                      color={
                        filterCritera.includes(item.title)
                          ? AppColor.RED
                          : AppColor.GRAY1
                      }
                      style={{marginTop: 8}}
                    />
                    <View />
                  </TouchableOpacity>
                </>
              );
            }}
          />
        </View>
        {!isFullBody && (
          <View
            style={{
              width: DeviceWidth,
              height: 1,
              backgroundColor: '#1E1E1E',
              opacity: 0.2,
              marginVertical: 10,
              alignSelf: 'center',
            }}
          />
        )}
        <View style={{width: DeviceWidth * 0.9, alignSelf: 'center'}}>
          {!isFullBody && (
            <Text
              style={{
                color: AppColor.BLACK,
                fontFamily: Fonts.HELVETICA_BOLD,
                fontSize: 16,
                marginBottom: 16,
              }}>
              Adjust
            </Text>
          )}
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
                <Icon
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
              filterExercises(exerciseData, filterCritera, adjustSelected);
              handleFilterVisibilty();
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
    );
  };
  // downloading video logic
  const sanitizeFileName = fileName => {
    fileName = fileName.replace(/\s+/g, '_');
    return fileName;
  };
  let StoringData = {},
    downloadCounter = 0;

  const downloadVideos = async (data, index, len) => {
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
            setDownloadProgress((received / total) * 100);
          })
          .then(res => {
            StoringData[data?.exercise_title] = res.path();
            downloadCounter++;
            setDownloade((downloadCounter / len) * 100);
          })

          .catch(err => {
            console.log(err, 'Video Download error');
          });
      }
    } catch (error) {
      console.log('ERRRR', error);
    }
    dispatch(setVideoLocation(StoringData));
  };
  const Start = () => {
    const exercise = filterList.filter(item =>
      selectedExerciseIds.has(item?.exercise_id),
    );
    setStart(true);
    AnalyticsConsole('S_E_FW');
    Promise.all(
      exercise?.map((item, index) => {
        return downloadVideos(item, index, exercise?.length);
      }),
    ).finally(() => {
      setDownloade(0);
      setStart(false);
      navigation.navigate('Exercise', {
        allExercise: exercise,
        currentExercise: exercise[0],
        data: CategoryDetails,
        day: -11,
        exerciseNumber: 0,
        trackerData: [],
        type: 'bodypart',
        challenge: false,
        isEventPage: false,
      });
    });
  };
  const handleIconPress = (item, index) => {
    if (
      getExerciseOutTime != '' &&
      moment().format(format) > getExerciseOutTime
    ) {
      setOverExerciseVisible(true);
    } else {
      setStart(true);
      downloadVideos(item, index, 1).finally(() => {
        setStart(false);
        setDownloade(0);
        setDownloadProgress(0);
        setSelectedIndex(-1);
        navigation.navigate('Exercise', {
          allExercise: [item],
          currentExercise: item,
          data: CategoryDetails,
          day: -11,
          exerciseNumber: 0,
          trackerData: [],
          type: 'bodypart',
          challenge: false,
          isEventPage: false,
        });
      });
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);
  const EmptyComponent = () => {
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
  const handleSelection = id => {
    setSelectedExerciseIds(prev => {
      const newSet = new Set(prev); //to maintain immutability
      if (newSet?.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  return (
    <>
      <View style={styles.container}>
        <Wrapper
          styles={{
            backgroundColor: '#FDFDFD',
          }}>
          <NewHeader1
            header={
              startSelection
                ? `${selectedExerciseIds?.size} Selected`
                : route?.params?.focusedPart
            }
            iconSource={require('../../Icon/Images/NewImage2/filter.png')}
            workoutCat={startSelection}
            onBackPress={() => {
              if (startSelection) {
                setStartSelection(false);
                setSelectedExerciseIds(new Set());
                return;
              }
              if (downloaded > 0) {
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
            onIconPress={() => {
              AnalyticsConsole('O_BS_FW');
              bottomSheetRef.current?.openSheet();
            }}
            icon={!startSelection}
            backButton
          />
          <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
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
              // top:
              //   DeviceHeigth <= 626 ? -DeviceWidth * 0.01 : -DeviceWidth * 0.05,
            }}>
            <Icons name="magnify" size={20} color={'#33333380'} />
            <TextInput
              placeholder="Search Exercise"
              placeholderTextColor="#33333380"
              value={searchQuery}
              onChangeText={text => {
                setSearchQuery(text);
                updateFilteredCategories(text);
              }}
              style={styles.inputText}
            />
          </View>

          <View style={styles.contentContainer}>
            <FlatList
              data={!!searchQuery ? searchFilterList : filterList}
              contentContainerStyle={{paddingBottom: DeviceHeigth * 0.1}}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item?.exercise_id.toString()}
              ListEmptyComponent={<EmptyComponent />}
              renderItem={({item, index}) => {
                const time = parseInt(item?.exercise_rest.split(' ')[0]);
                return (
                  <>
                    <TouchableOpacity
                      style={{
                        width: '100%',
                        marginVertical: 10,
                        paddingHorizontal: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        if (!visible) {
                          setVisible(true);
                          setitem(item);
                        }
                      }}>
                      <FastImage
                        fallback={true}
                        style={{
                          width: 75,
                          height: 75,
                          justifyContent: 'center',
                          alignSelf: 'center',
                          borderRadius: 5,
                          borderWidth: 1,
                          borderColor: '#D9D9D9',
                        }}
                        source={{
                          uri: item?.exercise_image_link,
                          headers: {Authorization: 'someAuthToken'},
                          priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                        defaultSource={localImage.NOWORKOUT}
                      />
                      <View
                        style={{
                          marginHorizontal: 16,
                          width:
                            DeviceHeigth >= 1024
                              ? DeviceWidth * 0.7
                              : DeviceWidth * 0.48,
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
                          {item?.exercise_title}
                        </Text>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text style={styles.txt2}>
                            {'Time - ' +
                              '1 x ' +
                              (time > 60
                                ? Math.floor(time / 60) + ' min'
                                : time + ' sec')}{' '}
                            |{' '}
                          </Text>
                          <Text style={styles.txt2}>
                            {'Set - ' + item?.exercise_sets}
                          </Text>
                        </View>
                      </View>
                      {selectedIndex == index && downloadProgress <= 5 ? (
                        <ActivityIndicator
                          color={AppColor.NEW_DARK_RED}
                          animating={
                            selectedIndex == index && downloadProgress <= 5
                          }
                          size={30}
                          style={{right: -15, padding: 2}}
                        />
                      ) : (
                        <TouchableOpacity
                          style={{right: -15, padding: 2}}
                          disabled={selectedIndex == index}
                          onPress={() => {
                            if (startSelection) {
                              handleSelection(item?.exercise_id);
                              return;
                            }
                            if (
                              selectedIndex == index ||
                              downloadProgress > 0
                            ) {
                            } else {
                              setSelectedIndex(index);
                              setDownloadProgress(5);
                              handleIconPress(item, index);
                            }
                          }}>
                          {startSelection ? (
                            <Icon
                              name={
                                selectedExerciseIds.has(item?.exercise_id)
                                  ? 'check-circle'
                                  : 'checkbox-blank-circle-outline'
                              }
                              size={25}
                              color={
                                selectedExerciseIds.has(item?.exercise_id)
                                  ? AppColor.RED
                                  : AppColor.GRAY1
                              }
                              style={{marginTop: 8}}
                            />
                          ) : (
                            <CircularProgressBase
                              value={
                                selectedIndex == index ? downloadProgress : 0
                              }
                              radius={16}
                              activeStrokeColor={AppColor.RED}
                              inActiveStrokeColor={AppColor.GRAY1}
                              activeStrokeWidth={3}
                              inActiveStrokeWidth={3}
                              maxValue={100}>
                              <Image
                                source={localImage.ExercisePlay}
                                tintColor={selectedIndex != index && '#565656'}
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
                    {index !== filterList.length - 1 && (
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
              }}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              // removeClippedSubviews={true}
            />
          </View>
          {!!searchQuery && searchFilterList?.length <= 0 ? null : (
            <NewButton
              position={'absolute'}
              bottom={10}
              title={
                selectedExerciseIds.size < 1
                  ? 'Select Exercises'
                  : 'Start Workout'
              }
              withAnimation={downloaded > 0}
              download={downloaded}
              onPress={() => {
                if (!startSelection) {
                  setStartSelection(true);
                  return;
                }
                if (selectedExerciseIds.size >= 1) {
                  Start();
                } else {
                  showMessage({
                    message: 'Please select exercises to start.',
                    type: 'info',
                    animationDuration: 500,
                    floating: true,
                    icon: {icon: 'auto', position: 'left'},
                  });
                }
              }}
            />
          )}

          {/* <BottomSheet /> */}

          <WorkoutsDescription
            data={item}
            open={visible}
            setOpen={setVisible}
          />
        </Wrapper>
      </View>
      <View style={styles.footer}>
        <BannerAdd bannerAdId={bannerAdId} />
      </View>
      <OverExerciseModal
        setOverExerciseVisible={setOverExerciseVisible}
        overExerciseVisible={overExerciseVisible}
      />
      <BottomSheet1 ref={bottomSheetRef}>
        <BottomSheetContent />
      </BottomSheet1>
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
  listContainer: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
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
  buttonText: {
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    lineHeight: 20,
    fontWeight: '500',
    zIndex: 1,
    color: AppColor.WHITE,
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
  shadow: {
    marginBottom: 10,
    shadowColor: 'grey',
    ...Platform.select({
      ios: {
        //shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  contentContainer: {
    flex: 1, // pushes the footer to the end of the screen
  },
  footer: {justifyContent: 'center'},
  box: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: AppColor.RED,
    borderColor: AppColor.RED,
    borderWidth: 1,
    marginVertical: DeviceHeigth * 0.015,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 7,
    shadowColor: 'grey',
    ...Platform.select({
      ios: {
        //shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  txt2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 30,
    // opacity: 0.7,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#1E1E1E',
  },
  closeStyle: {
    right: 8,
    marginTop: 6,
    position: 'absolute',
    zIndex: 1,
  },
});
export default NewFocusWorkouts;
