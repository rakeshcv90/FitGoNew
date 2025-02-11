import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {ExerciseData} from '../NewWorkouts/Exercise/ExerciseUtilities/useExerciseHook';
import FitText from '../../Component/Utilities/FitText';
import NativeAddTest from '../../Component/NativeAddTest';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import {localImage} from '../../Component/Image';
import FitIcon from '../../Component/Utilities/FitIcon';
import {showMessage} from 'react-native-flash-message';
import WorkoutsDescription from '../NewWorkouts/WorkoutsDescription';
import CircleProgress from '../../Component/Utilities/ProgressCircle';
import {downloadVideos, EmptyComponent} from './categoriesHelper';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

type ListProps = {
  exerciseData: Array<ExerciseData>;
  switchButton: boolean;
  CategoryDetails: any;
  selectedExIDs: Array<number>;
  setSeletedExIDs: Function;
  progressPercent: number;
  setProgressPercent: Function;
};

type RenderItemProps = {
  item: ExerciseData;
  index: number;
  switchButton: boolean;
  handleSelect: (id: number) => void;
  isSelected: boolean;
  progressPercent: number;
  onPlay: (item: ExerciseData) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
};

type PlayProps = {
  progressPercent: number;
  currentIndex: number;
  index: number;
  onPlay: () => void;
};

const PlaySelect = ({
  onPlay,
  progressPercent,
  currentIndex,
  index,
}: PlayProps) => {
  return (
    <TouchableOpacity onPress={onPlay} style={{}}>
      <CircleProgress
        radius={13}
        progress={currentIndex == index ? progressPercent : 100}
        strokeWidth={2}
        changingColorsArray={['#530014', AppColor.RED]}
        forCategoryList
        secondayCircleColor={AppColor.RED}>
        <Image
          source={localImage.ExercisePlay}
          tintColor={currentIndex == index ? AppColor.RED : '#565656'}
          resizeMode="contain"
          style={{
            width: 12,
            height: 12,
            alignSelf: 'center',
          }}
        />
      </CircleProgress>
    </TouchableOpacity>
  );
};

const RenderItem = ({
  index,
  item,
  switchButton,
  isSelected,
  progressPercent,
  currentIndex,
  onPlay,
  handleSelect,
  setCurrentIndex,
}: RenderItemProps) => {
  const time = parseInt(item?.exercise_rest.split(' ')[0]);
  const showAds = index + 1 == 2 || (index + 1) % 8 == 0;
  const [visible, setVisible] = useState(false);

  const onSelect = () => {
    switchButton ? handleSelect(item.exercise_id) : setVisible(true);
  };
  const onPlayPress = () => {
    setCurrentIndex(index);
    onPlay(item);
  };

  return (
    <>
      <TouchableOpacity
        key={index}
        onPress={onSelect}
        activeOpacity={switchButton ? 0.8 : 1}
        style={styles.boxContainer}>
        <View style={styles.boxImage}>
          <Image
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignSelf: 'center',
            }}
            source={{
              uri: item?.exercise_image_link??localImage.NOWORKOUT,
            }}
            resizeMode={'contain'}
          />
        </View>
        <View
          style={{
            marginHorizontal: 15,
            width: DeviceHeigth >= 1024 ? '80%' : '65%',
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
            onPress={onSelect}
            style={[
              styles.boxIconView,
              {
                backgroundColor: isSelected ? '#f0013b' : 'white',
                borderColor: isSelected ? '#f0013b' : '#33333399',
              },
            ]}>
            {isSelected && (
              <FitIcon
                type="FontAwesome5"
                name="check"
                color="white"
                size={10}
              />
            )}
          </TouchableOpacity>
        ) : (
          <PlaySelect
            progressPercent={progressPercent}
            onPlay={onPlayPress}
            currentIndex={currentIndex}
            index={index}
          />
        )}
      </TouchableOpacity>
      <View
        style={{
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        {showAds && <NativeAddTest type="image" media={false} />}
      </View>
      <WorkoutsDescription data={item} open={visible} setOpen={setVisible} />
    </>
  );
};

const CategoriesList = ({
  exerciseData,
  switchButton,
  CategoryDetails,
  selectedExIDs,
  setSeletedExIDs,
  progressPercent,
  setProgressPercent,
}: ListProps) => {
  const navigation: any = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(-1);

  const handleProgress = (value: number) => setProgressPercent(value);

  useFocusEffect(
    useCallback(() => {
      setCurrentIndex(-1);
    }, []),
  );

  const onPlay = (item: ExerciseData) => {
    AnalyticsConsole('S_E_S_WC');
    downloadVideos(item, 1, handleProgress).finally(() => {
      navigation.navigate('Exercise', {
        allExercise: [item],
        currentExercise: item,
        data: CategoryDetails,
        day: -12,
        exerciseNumber: 0,
        trackerData: [],
        type: 'focus',
        challenge: false,
        isEventPage: false,
      });
    });
  };

  const handleSelect = useCallback(
    (id: number) => {
      const newSelectedItems = new Set(selectedExIDs);
      if (newSelectedItems.has(id)) {
        newSelectedItems.delete(id);
      } else {
        if (selectedExIDs.length > 9) {
          showMessage({
            message: 'You can select upto 10 exercises at a time.',
            type: 'info',
            animationDuration: 500,
            floating: true,
          });
          return;
        }
        newSelectedItems.add(id);
      }
      setSeletedExIDs(Array.from(newSelectedItems));
    },
    [selectedExIDs],
  );

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={exerciseData}
        keyExtractor={item => item.exercise_id.toString()}
        ListEmptyComponent={<EmptyComponent />}
        renderItem={({item, index}: {item: ExerciseData; index: number}) => (
          <RenderItem
            key={index}
            index={index}
            item={item}
            switchButton={switchButton}
            handleSelect={handleSelect}
            isSelected={selectedExIDs.includes(item.exercise_id)}
            progressPercent={progressPercent}
            onPlay={onPlay}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  small: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 12,
    fontWeight: '500',
    color: '#1E1E1ECC',
    lineHeight: 30,
  },
});

export default CategoriesList;
