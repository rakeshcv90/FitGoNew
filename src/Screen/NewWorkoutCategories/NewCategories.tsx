import {SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
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
          <View style={styles.inputTextContainer}>
            <FitIcon
              type="FontAwesome5"
              name="search"
              size={18}
              color={'#333333E5'}
            />
            <TextInput
              placeholder="Search Exercise"
              placeholderTextColor="#33333380"
              value={searchValue}
              onChangeText={searchFunction}
              style={styles.inputText}
            />
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

          <NewButton
            bottom={10}
            title={
              progressPercent > 0
                ? `Downloading`
                : switchButton
                ? `Start Workout`
                : 'Select Exercises'
            }
            fontSize={20}
            disabled={switchButton && selectedExIDs.length == 0}
            buttonColor={
              switchButton
                ? selectedExIDs.length == 0
                  ? AppColor.GRAY1
                  : AppColor.RED
                : AppColor.RED
            }
            onPress={onPress}
            withAnimation={switchButton && progressPercent > 0}
            download={progressPercent}
          />
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

export default NewCategories;

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
    width: '90%',
    height: 50,
    alignSelf: 'center',
    backgroundColor: '#F3F5F5',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    marginVertical: (DeviceWidth * 0.1) / 8,
    justifyContent: 'center',
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
