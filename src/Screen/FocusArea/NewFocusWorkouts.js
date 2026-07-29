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
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {AppColor, Fonts} from '../../Component/Color';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
// import {BannerAdd} from '../../Component/BannerAdd';
// import {bannerAdId} from '../../Component/AdsId';
// import NativeAddTest from '../../Component/NativeAd';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedLottieView from 'lottie-react-native';
import {localImage} from '../../Component/Image';
import Button from '../../Component/Button';
import WorkoutsDescription from '../NewWorkouts/WorkoutsDescription';

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
import NewButton from '../../Component/NewButton';
import {showMessage} from 'react-native-flash-message';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import NewButton2 from '../../Component/NewButton2';
import moment from 'moment';
import OverExerciseModal from '../../Component/Utilities/OverExercise';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import BottomSheet1 from '../../Component/BottomSheet';
import {CircularProgressBase} from 'react-native-circular-progress-indicator';
import {translate} from '../Translation/TranslationService';

const format = 'hh:mm:ss';

const AnimatedCard = ({index = 0, style, onPress, children}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);
  const scale = useSharedValue(1);

  useEffect(() => {
    const delay = Math.min(index, 6) * 55;
    opacity.value = withDelay(delay, withTiming(1, {duration: 320}));
    translateY.value = withDelay(delay, withTiming(0, {duration: 320}));
  }, []);

  const enterStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{translateY: translateY.value}],
  }));
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Animated.View style={enterStyle}>
      <Animated.View style={pressStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={style}
          onPressIn={() => {
            scale.value = withTiming(0.97, {duration: 100});
          }}
          onPressOut={() => {
            scale.value = withSpring(1, {damping: 14, stiffness: 220});
          }}
          onPress={onPress}>
          {children}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const FilterSelectCard = ({item, isSelected, onPress}) => {
  const scale = useSharedValue(1);
  const badgeScale = useSharedValue(1);
  const imageScale = useSharedValue(1);

  useEffect(() => {
    if (isSelected) {
      scale.value = withSpring(1.03, {damping: 12, stiffness: 240});
      imageScale.value = withSpring(1.08, {damping: 12, stiffness: 240});
      badgeScale.value = withSequence(
        withTiming(1.3, {duration: 100}),
        withSpring(1, {damping: 10, stiffness: 260}),
      );
    } else {
      scale.value = withSpring(1, {damping: 12, stiffness: 240});
      imageScale.value = withSpring(1, {damping: 12, stiffness: 240});
    }
  }, [isSelected]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));
  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{scale: badgeScale.value}],
  }));
  const imageStyle = useAnimatedStyle(() => ({
    transform: [{scale: imageScale.value}],
  }));

  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={{flex: 1}}>
      <Animated.View style={[styles.filterCard, cardStyle]}>
        {isSelected ? (
          <LinearGradient
            colors={['#FF2A54', '#E11D48']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.filterCardInner}>
            <Animated.View style={[styles.filterCardBadge, badgeStyle]}>
              <Icon name="check-bold" size={12} color="#E11D48" />
            </Animated.View>
            <Animated.View style={[styles.filterCardImageCircle, imageStyle]}>
              <Image
                source={item.ima}
                defaultSource={localImage?.NOWORKOUT}
                style={styles.filterCardImage}
                resizeMode="contain"
              />
            </Animated.View>
            <Text style={styles.filterCardTitleActive} numberOfLines={1}>
              {item.title}
            </Text>
          </LinearGradient>
        ) : (
          <View style={styles.filterCardInactive}>
            <Animated.View style={[styles.filterCardImageCircle, imageStyle]}>
              <Image
                source={item.ima}
                defaultSource={localImage?.NOWORKOUT}
                style={styles.filterCardImage}
                resizeMode="contain"
              />
            </Animated.View>
            <Text style={styles.filterCardTitleInactive} numberOfLines={1}>
              {item.title}
            </Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

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
  const [searchFocused, setSearchFocused] = useState(false);
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
      title: translate('chest'),
      ima: require('../../Icon/Images/NewImage2/chest.png'),
      exCount: getExerciseCount?.exCount1 ?? 0,
    },
    {
      id: 2,
      title: translate('back'),
      ima: require('../../Icon/Images/NewImage2/back.png'),
      exCount: getExerciseCount?.exCount2 ?? 0,
    },
    {
      id: 3,
      title: translate('shoulders'),
      ima: require('../../Icon/Images/NewImage2/shoulder.png'),
      exCount: getExerciseCount?.exCount3 ?? 0,
    },
    {
      id: 4,
      title: translate('arms'),
      ima: require('../../Icon/Images/NewImage2/arms.png'),
      exCount: getExerciseCount?.exCount4 ?? 0,
    },
  ];

  const lowerBody = [
    {
      id: 1,
      title: translate('legs'),
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
      title: translate('calves'),
      ima: require('../../Icon/Images/NewImage2/calves.png'),
      exCount: getExerciseCount?.exCount3 ?? 0,
    },
  ];
  const core = [
    {
      id: 1,
      title: translate('abs'),
      ima: require('../../Icon/Images/NewImage2/core.png'),
      exCount: getExerciseCount?.exCount1 ?? 0,
    },
    {
      id: 2,
      title: translate('cardio'),
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
      if (getEquipmentExercise !== adjust) {
        dispatch(setEquipmentExercise(adjust));
      }
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
      if (getEquipmentExercise !== adjust) {
        dispatch(setEquipmentExercise(adjust));
      }
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
          {/* <NativeAddTest type="image" media={false} /> */}
        </View>
      );
    } else {
      return (
        <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          {/* <NativeAddTest type="image" media={false} /> */}
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
          ? prev.length > 1
            ? prev.filter(item => item !== bodyPart)
            : [...prev]
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
        text: translate('withEquipment'),
      },
      {
        image: require('../../Icon/Images/NewHome/WithoutEquipment.png'),
        text: translate('withoutEquipment'),
      },
    ];
    const isFullBody = route?.params?.focusedPart == 'Full Body';
    const bodyPartData =
      route?.params?.focusedPart == 'Upper Body'
        ? uperBody
        : route?.params?.focusedPart == 'Lower Body'
        ? lowerBody
        : route?.params?.focusedPart == 'Core'
        ? core
        : [];

    return (
      <View style={styles.sheetMainContainer}>
        <View style={styles.sheetHeaderRow}>
          <View style={{width: 32}} />
          <Text style={styles.sheetFilterTitle}>
            {isFullBody ? translate('adjust') : translate('filter')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => bottomSheetRef.current?.closeSheet()}
            style={styles.sheetCloseBtn}>
            <Icon name="close" size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        <View style={styles.sheetHeaderDivider} />

        {isFullBody && (
          <Text style={styles.sheetCategoryHeading}>
            {route?.params?.focusedPart}
          </Text>
        )}

        {bodyPartData.length > 0 && (
          <>
            <Text style={styles.sheetCategoryHeading}>
              {translate('filter')}
            </Text>
            <View style={styles.filterCardsGrid}>
              {bodyPartData.map((item, index) => (
                <View key={index} style={styles.filterCardWrap}>
                  <FilterSelectCard
                    item={item}
                    isSelected={filterCritera.includes(item.title)}
                    onPress={() => handleFilterChange(item.title)}
                  />
                </View>
              ))}
            </View>
            <View style={styles.sheetHeaderDivider} />
          </>
        )}

        {!isFullBody && (
          <Text style={styles.sheetCategoryHeading}>{translate('adjust')}</Text>
        )}
        <View style={styles.sheetCardsRow}>
          {adjustArray.map((item, index) => (
            <View key={index} style={{flex: 1}}>
              <FilterSelectCard
                item={{title: item.text, ima: item.image}}
                isSelected={adjustSelected == index}
                onPress={() => setAdjustSelelcted(index)}
              />
            </View>
          ))}
        </View>

        <View style={styles.sheetHeaderDivider} />

        <View style={styles.sheetFooterRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setFilterCriteria([])}
            style={styles.clearAllButton}>
            <Text style={styles.clearAllButtonText}>
              {translate('clearAll')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.88}
            disabled={!isFilterChanged}
            onPress={() => {
              filterExercises(exerciseData, filterCritera, adjustSelected);
              handleFilterVisibilty();
            }}>
            <LinearGradient
              colors={[AppColor.RED, '#E11D48']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={[
                styles.showResultGradientBtn,
                !isFilterChanged && {opacity: 0.5},
              ]}>
              <Text style={styles.showResultBtnText}>
                {translate('showResult')}
              </Text>
            </LinearGradient>
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
      // Trigger background download asynchronously without blocking navigation
      downloadVideos(item, index, 1);

      // Navigate INSTANTLY (0ms delay)
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

      // Reset state in background after navigation starts
      setTimeout(() => {
        setStart(false);
        setDownloade(0);
        setDownloadProgress(0);
        setSelectedIndex(-1);
      }, 100);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (startSelection) {
          setStartSelection(false);
          setSelectedExerciseIds(new Set());
          return true;
        }
        return false;
      },
    );
    return () => backHandler.remove();
  }, [startSelection]);
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
          <View
            // colors={['#FFF1F4', '#FDFDFD']}
            // start={{x: 0.5, y: 0}}
            // end={{x: 0.5, y: 1}}
            style={styles.headerGradient}>
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
              style={[
                styles.searchBar,
                searchFocused && styles.searchBarFocused,
              ]}>
              <Icons
                name="magnify"
                size={18}
                color={searchFocused ? AppColor.RED : '#9CA3AF'}
              />
              <TextInput
                placeholder="Search Exercise"
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onChangeText={text => {
                  setSearchQuery(text);
                  updateFilteredCategories(text);
                }}
                style={styles.inputText}
              />
              {!!searchQuery && (
                <TouchableOpacity
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                  onPress={() => setSearchQuery('')}>
                  <Icon name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <Text style={styles.resultCountText}>
            {(!!searchQuery ? searchFilterList : filterList)?.length ?? 0}{' '}
            {translate('exercises')}
          </Text>

          <View style={styles.contentContainer}>
            <FlatList
              data={!!searchQuery ? searchFilterList : filterList}
              contentContainerStyle={{
                paddingTop: 8,
                paddingBottom: DeviceHeigth * 0.1,
              }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item?.exercise_id.toString()}
              ListEmptyComponent={<EmptyComponent />}
              renderItem={({item, index}) => {
                const time = parseInt(item?.exercise_rest.split(' ')[0]);
                return (
                  <>
                    <AnimatedCard
                      index={index}
                      style={styles.card}
                      onPress={() => {
                        if (startSelection) {
                          handleSelection(item?.exercise_id);
                          return;
                        } else if (!visible) {
                          setVisible(true);
                          setitem(item);
                        }
                      }}>
                      <LinearGradient
                        colors={['#FF2A54', '#E11D48']}
                        style={styles.cardAccent}
                      />
                      <Image
                        style={styles.cardImage}
                        source={{
                          uri:
                            item?.exercise_image_link ?? localImage.NOWORKOUT,
                        }}
                        resizeMode={'contain'}
                      />
                      <View style={styles.cardTextWrap}>
                        <Text numberOfLines={1} style={styles.cardTitle}>
                          {item?.exercise_title}
                        </Text>
                        <View style={styles.cardMetaRow}>
                          <View style={[styles.metaBadge, styles.timeBadge]}>
                            <Icon
                              name="clock-outline"
                              size={12}
                              color="#7C3AED"
                            />
                            <Text
                              style={[
                                styles.metaBadgeText,
                                {color: '#7C3AED'},
                              ]}>
                              {'1 x ' +
                                (time > 60
                                  ? Math.floor(time / 60) + ' min'
                                  : time + ' sec')}
                            </Text>
                          </View>
                          <View style={[styles.metaBadge, styles.setBadge]}>
                            <Icon name="repeat" size={12} color="#059669" />
                            <Text
                              style={[
                                styles.metaBadgeText,
                                {color: '#059669'},
                              ]}>
                              {'Set ' + item?.exercise_sets}
                            </Text>
                          </View>
                        </View>
                      </View>
                      {selectedIndex == index && downloadProgress <= 5 ? (
                        <View style={styles.actionWrap}>
                          <ActivityIndicator
                            color="#E11D48"
                            animating
                            size={22}
                          />
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.actionWrap}
                          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
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
                            <View
                              style={[
                                styles.checkboxChip,
                                selectedExerciseIds.has(item?.exercise_id) &&
                                  styles.checkboxChipActive,
                              ]}>
                              <Icon
                                name={
                                  selectedExerciseIds.has(item?.exercise_id)
                                    ? 'check-circle'
                                    : 'checkbox-blank-circle-outline'
                                }
                                size={22}
                                color={
                                  selectedExerciseIds.has(item?.exercise_id)
                                    ? '#E11D48'
                                    : '#9CA3AF'
                                }
                              />
                            </View>
                          ) : selectedIndex == index ? (
                            <CircularProgressBase
                              value={downloadProgress}
                              radius={18}
                              activeStrokeColor="#E11D48"
                              inActiveStrokeColor="#FFD9E0"
                              activeStrokeWidth={3}
                              inActiveStrokeWidth={3}
                              maxValue={100}>
                              <Image
                                source={localImage.ExercisePlay}
                                tintColor="#E11D48"
                                resizeMode="contain"
                                style={{
                                  width: 14,
                                  height: 14,
                                  marginLeft: 2,
                                }}
                              />
                            </CircularProgressBase>
                          ) : (
                            <LinearGradient
                              colors={['#FF2A54', '#E11D48']}
                              start={{x: 0, y: 0}}
                              end={{x: 1, y: 1}}
                              style={styles.playCircle}>
                              <Image
                                source={localImage.ExercisePlay}
                                tintColor="#FFFFFF"
                                resizeMode="contain"
                                style={{
                                  width: 14,
                                  height: 14,
                                  marginLeft: 2,
                                }}
                              />
                            </LinearGradient>
                          )}
                        </TouchableOpacity>
                      )}
                    </AnimatedCard>
                    {getAdsDisplay(index, item)}
                  </>
                );
              }}
              initialNumToRender={8}
              maxToRenderPerBatch={8}
              windowSize={5}
              updateCellsBatchingPeriod={50}
              removeClippedSubviews={Platform.OS === 'android'}
            />
          </View>
          {!!searchQuery && searchFilterList?.length <= 0 ? null : (
            <View style={styles.ctaWrap}>
              <LinearGradient
                colors={['#FF2A54', '#E11D48']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.ctaGradient}>
                <View style={styles.ctaIconCircle}>
                  <Icon
                    name={
                      selectedExerciseIds.size < 1
                        ? 'format-list-checks'
                        : 'play'
                    }
                    size={16}
                    color="#E11D48"
                  />
                </View>
                <View style={{flex: 1}}>
                  <NewButton
                    ButtonWidth={'100%'}
                    buttonColor="transparent"
                    pH={0}
                    pV={0}
                    bR={20}
                    fontFamily={Fonts.MONTSERRAT_BOLD}
                    title={
                      selectedExerciseIds.size < 1
                        ? 'Select Exercises'
                        : 'Start Workout'
                    }
                    fontSize={15}
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
                </View>
              </LinearGradient>
            </View>
          )}

          {/* <BottomSheet /> */}

          <WorkoutsDescription
            data={item}
            open={visible}
            setOpen={setVisible}
            id={item?.exercise_id ?? item?.id}
          />
        </Wrapper>
      </View>
      <View style={styles.footer}>
        {/* <BannerAdd bannerAdId={bannerAdId} /> */}
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
  sheetMainContainer: {
    width: DeviceWidth,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 10,
  },
  sheetFilterTitle: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#1F2937',
  },
  sheetCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetHeaderDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },
  sheetCategoryHeading: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#1F2937',
    marginBottom: 10,
  },
  filterCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sheetCardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
  },
  filterCardWrap: {
    width: '47%',
    marginBottom: 10,
  },
  filterCard: {
    width: '100%',
    height: 84,
    borderRadius: 16,
    overflow: 'hidden',
  },
  filterCardInner: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  filterCardInactive: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1.5,
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  filterCardBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterCardImageCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  filterCardImage: {
    width: 24,
    height: 24,
  },
  filterCardTitleActive: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
  },
  filterCardTitleInactive: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#374151',
  },
  sheetFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 4,
  },
  clearAllButton: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  clearAllButtonText: {
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#E11D48',
    textDecorationLine: 'underline',
  },
  showResultGradientBtn: {
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: AppColor.RED,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  showResultBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: Fonts.MONTSERRAT_BOLD,
  },
  inputText: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Montserrat',
    color: '#1E1E1E',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    lineHeight: 20,
    fontWeight: '500',
    zIndex: 1,
    color: AppColor.WHITE,
  },
  headerGradient: {
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  searchBar: {
    width: '92%',
    height: 52,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchBarFocused: {
    borderColor: AppColor.RED,
  },
  resultCountText: {
    marginTop: 14,
    marginBottom: 4,
    marginLeft: 20,
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#9CA3AF',
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 10,
    paddingLeft: 20,
    paddingRight: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4.5,
  },
  cardImage: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  cardTextWrap: {
    flex: 1,
    marginHorizontal: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 19,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#111827',
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9,
    marginRight: 6,
    marginTop: 2,
    borderWidth: 1,
  },
  timeBadge: {
    backgroundColor: '#F5F3FF',
    borderColor: '#DDD6FE',
  },
  setBadge: {
    backgroundColor: '#D1FAE5',
    borderColor: '#A7F3D0',
  },
  metaBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    marginLeft: 4,
  },
  actionWrap: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.35,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  checkboxChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  checkboxChipActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  ctaWrap: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  ctaGradient: {
    width: DeviceWidth * 0.9,
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    gap: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#FF2A54',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  ctaIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default NewFocusWorkouts;
