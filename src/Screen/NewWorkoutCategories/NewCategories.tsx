import {Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {AppColor, Fonts, PLATFORM_IOS} from '../../Component/Color';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import FitIcon from '../../Component/Utilities/FitIcon';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {setEquipmentExercise} from '../../Component/ThemeRedux/Actions';
import {useDispatch, useSelector} from 'react-redux';
import CategoriesList from './CategoriesList';
import GradientButton from '../../Component/GradientButton';
import NewButton2 from '../../Component/NewButton2';
import NewButton from '../../Component/NewButton';
import {showMessage} from 'react-native-flash-message';
import {downloadVideos} from './categoriesHelper';
import BottomSheet1 from '../../Component/BottomSheet';
import BottomSheetContent from './BottomSheetContent';
import {useIsFocused} from '@react-navigation/native';

const NewCategories = ({navigation, route}: any) => {
  const {categoryExercise, CategoryDetails} = route?.params;

  const bottomSheetRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');
  const [exercise, setExercise] = useState([]);
  const [filteredExercise, setFilteredExercise] = useState([]);
  const [switchButton, setSwitchButton] = useState(false);
  const [selectedExIDs, setSeletedExIDs] = useState<number[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);

  const dispatch = useDispatch();
  const getEquipmentExercise = useSelector(
    (state: any) => state.getEquipmentExercise,
  );
  const focused = useIsFocused();

  useEffect(() => {
    filterExercises(getEquipmentExercise);
    if (focused) {
      setProgressPercent(0);
    }
  }, [focused]);

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
    bottomSheetRef.current?.closeSheet();
  };

  const searchFunction = (text: string) => {
    setSearchValue(text);
    const searchArray = exercise.filter((item: any) =>
      item?.exercise_title.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredExercise(searchArray);
  };

  const handleProgress = (value: number) => setProgressPercent(value);

  const onPress = () => {
    if (switchButton) {
      AnalyticsConsole('S_SE_WC');
      const finalExercises = exercise.filter((item: any) =>
        selectedExIDs.includes(item?.exercise_id),
      );

      Promise.all(
        finalExercises?.map((item: any, index: number) => {
          return downloadVideos(item, index, handleProgress);
        }),
      ).finally(() => {
        setSwitchButton(false);
        setProgressPercent(0);
        navigation.navigate('Exercise', {
          allExercise: finalExercises,
          currentExercise: finalExercises[0],
          data: CategoryDetails,
          day: -12,
          exerciseNumber: 0,
          trackerData: [],
          type: 'focus',
          challenge: false,
          isEventPage: false,
        });
      });
    } else {
      setSwitchButton(true);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: AppColor.WHITE}}>
      <Wrapper styles={{}}>
        <NewHeader1
          header={
            switchButton
              ? `${selectedExIDs.length} selected`
              : CategoryDetails?.bodypart_title == undefined
              ? CategoryDetails?.title
              : CategoryDetails?.bodypart_title
          }
          backButton
          workoutCat={switchButton}
          onBackPress={() => {
            if (progressPercent > 0 && switchButton) {
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
              setSeletedExIDs([]);
              setSwitchButton(false);
              setProgressPercent(0);
            } else {
              navigation?.goBack();
            }
          }}
          onIconPress={() => {
            AnalyticsConsole('O_BS_FW');
            bottomSheetRef.current?.openSheet();
          }}
          icon
          iconSource={require('../../Icon/Images/NewImage2/filter.png')}
        />
        <View style={styles.container}>
          <View
            style={[
              styles.inputTextContainer,
              searchFocused && styles.inputTextContainerFocused,
            ]}>
            <FitIcon
              type="MaterialCommunityIcons"
              name="magnify"
              size={18}
              color={searchFocused ? AppColor.RED : '#9CA3AF'}
            />
            <TextInput
              placeholder="Search Exercise"
              placeholderTextColor="#9CA3AF"
              value={searchValue}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onChangeText={searchFunction}
              style={styles.inputText}
            />
            {!!searchValue && (
              <TouchableOpacity
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                onPress={() => searchFunction('')}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name="close-circle"
                  size={18}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            )}
          </View>
          <CategoriesList
            exerciseData={filteredExercise}
            switchButton={switchButton}
            CategoryDetails={CategoryDetails}
            selectedExIDs={selectedExIDs}
            setSeletedExIDs={setSeletedExIDs}
            progressPercent={progressPercent}
            setProgressPercent={setProgressPercent}
          />

          <View style={styles.ctaWrap}>
            <LinearGradient
              colors={
                switchButton && selectedExIDs.length === 0
                  ? ['#D1D5DB', '#9CA3AF']
                  : ['#FF2A54', '#E11D48']
              }
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.ctaGradient}>
              <View style={styles.ctaIconCircle}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name={
                    !switchButton || selectedExIDs.length < 1
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
                    progressPercent > 0
                      ? `Downloading`
                      : switchButton
                      ? `Start Workout`
                      : 'Select Exercises'
                  }
                  fontSize={15}
                  disabled={switchButton && selectedExIDs.length == 0}
                  onPress={onPress}
                  withAnimation={switchButton && progressPercent > 0}
                  download={progressPercent}
                />
              </View>
            </LinearGradient>
          </View>
        </View>
      </Wrapper>
      <BottomSheet1 ref={bottomSheetRef}>
        <BottomSheetContent
          bottomSheetRef={bottomSheetRef}
          filterExercises={filterExercises}
          getEquipmentExercise={getEquipmentExercise}
        />
      </BottomSheet1>
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
  inputTextContainer: {
    width: '92%',
    height: 52,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: (DeviceWidth * 0.1) / 8,
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
  inputTextContainerFocused: {
    borderColor: AppColor.RED,
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

export default NewCategories;
