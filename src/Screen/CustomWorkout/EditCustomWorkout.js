import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, {useEffect, useMemo, useState} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import {useDispatch, useSelector} from 'react-redux';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import ActivityLoader from '../../Component/ActivityLoader';
import AnimatedLottieView from 'lottie-react-native';
import {setCustomWorkoutData} from '../../Component/ThemeRedux/Actions';
import VersionNumber from 'react-native-version-number';

const EditCustomWorkout = ({navigation, route}) => {
  const data = route?.params?.item;
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const customWorkoutData = useSelector(state => state.customWorkoutData);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getAllExercise = useSelector(state => state.getAllExercise);
  const [workoutList, setWorkoutList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [forLoading, setForLoading] = useState(false);
  const [value, setValue] = useState(0);
  const animation = useSharedValue(0);
  const completeProfileData = useSelector(state => state.completeProfileData);
  const [bodyPart, setBodyPart] = useState(
    completeProfileData?.focusarea[0].bodypart_title,
  );
  const [filteredCategories, setFilteredCategories] = useState([]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width:
        animation.value == 1
          ? withTiming(DeviceWidth * 0.85, {duration: 500})
          : withTiming(0, {duration: 500}),
    };
  });
  useEffect(() => {
    const datalist = getAllExercise?.filter(listdata => {
      if (bodyPart == 'Biceps') {
        return listdata.exercise_bodypart == 'Triceps';
      } else if (bodyPart == 'Quads') {
        return listdata.exercise_bodypart == 'Abs';
      } else if (bodyPart == 'Calves') {
        return listdata.exercise_bodypart == 'Legs';
      } else {
        return listdata.exercise_bodypart == bodyPart;
      }
    });

    setWorkoutList(datalist);
    setFilteredCategories(datalist);
  }, [bodyPart]);
  useEffect(() => {
    filterData(route?.params?.item);
  }, []);
  const filterData = () => {
    const ExerciseIds = [];

    data.exercise_data.map(item => ExerciseIds.push(item.exercise_id));
    setSelectedItems(ExerciseIds);
  };
  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.bodypart_title}</Text>
      </View>
    );
  };

  const renderItem1 = useMemo(
    () =>
      ({item}) => {
        const isSelected = selectedItems?.includes(item?.exercise_id);

        return (
          <>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                selectedExercise(item?.exercise_id);
              }}
              style={{
                width: '95%',
                borderRadius: 10,
                backgroundColor: '#FDFDFD',
                marginVertical: 8,
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                padding: 5,
                // borderColor: '#D9D9D9',
                borderColor: isSelected ? 'red' : AppColor.GRAY2,
                borderWidth: 1,
                justifyContent: 'space-between',
                shadowColor: 'rgba(0, 0, 0, 1)',
                ...Platform.select({
                  ios: {
                    shadowColor: '#000000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                  },
                  android: {
                    elevation: 4,
                  },
                }),
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={{uri: item.exercise_image_link}}
                  style={{
                    width: 80,
                    height: 80,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    // backgroundColor:'red',
                    marginHorizontal: -7,
                  }}
                  resizeMode="contain"
                />
                <View
                  style={{
                    marginHorizontal: 15,
                    justifyContent: 'center',
                    width: DeviceWidth * 0.45,
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 17,
                      fontWeight: '600',
                      color: '#202020',
                      lineHeight: 25,
                      fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    }}>
                    {item?.exercise_title}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: '#202020',
                        lineHeight: 30,

                        fontFamily: Fonts.MONTSERRAT_MEDIUM,
                      }}>
                      {'Time : '}
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color: '#202020',
                          lineHeight: 30,

                          fontFamily: Fonts.MONTSERRAT_MEDIUM,
                        }}>
                        {' '}
                        {item?.exercise_rest}
                      </Text>
                    </Text>
                    
                  </View>
                </View>
              </View>
              <Image
                source={isSelected ? localImage.Minus : localImage.Plus}
                style={{width: 20, height: 20}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </>
        );
      },
    [selectedItems],
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

            height: DeviceHeigth * 0.5,
          }}
        />
      </View>
    );
  };
  const selectedExercise = data => {
    const index = selectedItems.indexOf(data);

    const newSelectedItems = [...selectedItems];
    if (index === -1) {
      newSelectedItems.push(data);
    } else {
      newSelectedItems.splice(index, 1);
    }

    setSelectedItems(newSelectedItems);
  };

  const submitCustomExercise = async () => {
    setForLoading(true);
    const payload = new FormData();

    for (var i = 0; i < selectedItems.length; i++) {
      payload.append('exercises[]', selectedItems[i]);
    }
    payload.append('workout_name', data?.workout_name);
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('version', VersionNumber.appVersion);
    payload.append('custom_workout_id', data?.custom_workout_id);
    console.log('dvdvdvxcvsdfds', payload);
    try {
      const res = await axios(`${NewAppapi.EDIT_CUSTOM_WORKOUY}`, {
        data: payload,
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('dvdvdvxcvsdfds', res.data);
      if (res?.data?.msg == 'data updated successfully') {
        showMessage({
          message: res?.data?.msg,
          type: 'success',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        getCustomWorkout();
      } else {
        setForLoading(false);
        showMessage({
          message: 'Something went wrong pleasr try again',
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      }
    } catch (error) {
      setForLoading(false);
      console.log(error);
      showMessage({
        message: 'Something went wrong pleasr try again',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    }
  };
  const getCustomWorkout = async () => {
    try {
      const data = await axios.get(
        `${NewAppapi.GET_USER_CUSTOM_WORKOUT}?user_id=${getUserDataDetails?.id}`,
      );

      if (data?.data?.msg != 'data not found.') {
        setForLoading(false);

        dispatch(setCustomWorkoutData(data?.data?.data));
        navigation.navigate('CustomWorkout');
      } else {
        dispatch(setCustomWorkoutData([]));
      }
    } catch (error) {
      setForLoading(false);
      showMessage({
        message: 'Something went wrong pleasr try again',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
      console.log('Custom Workout Error', error);
      dispatch(setCustomWorkoutData([]));
    }
  };
  const updateFilteredCategories = test => {
    const filteredItems = workoutList.filter(item =>
      item.exercise_title.toLowerCase().includes(test.toLowerCase()),
    );

    setFilteredCategories(filteredItems);
  };
  return (
    <>
      <NewHeader
        header={'Custom Workout'}
        SearchButton={false}
        backButton={true}
      />
      {forLoading ? <ActivityLoader /> : ''}
      <View style={styles.container}>
        <View style={{width: '95%', alignSelf: 'center'}}>
          <Animated.View
            style={[
              {
                top: -10,
                width: DeviceWidth * 0.85,
                height: 50,
                zIndex: 1,

                paddingHorizontal: 10,
                backgroundColor: value == 1 ? '#e7e7e7' : AppColor.WHITE,
                alignSelf: 'flex-end',
                flexDirection: 'row',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: value == 1 ? 30 : 40,
              },
              animatedStyle,
            ]}>
            <TextInput
              style={{width: '90%'}}
              placeholder={'Search here......'}
              value={searchQuery}
              onChangeText={text => {
                setSearchQuery(text);
                updateFilteredCategories(text);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                if (animation.value == 1) {
                  animation.value = 0;
                  setValue(0);
                } else {
                  animation.value = 1;
                  setValue(1);
                }
              }}>
              <Image
                style={{width: 20, height: 20}}
                source={value == 0 ? localImage.Search : localImage.Cross}
              />
            </TouchableOpacity>
          </Animated.View>
          {value == 0 && (
            <View style={{top: -DeviceHeigth * 0.06}}>
              <Text
                style={{
                  color: '#202020',
                  fontFamily: Fonts.MONTSERRAT_BOLD,
                  fontWeight: '700',
                  lineHeight: 30,
                  fontSize: 18,
                  alignItems: 'center',
                }}>
                Your Routine
              </Text>
            </View>
          )}
          <View
            style={{
              top: value == 1 ? 20 : -25,
            }}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={completeProfileData?.focusarea}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={bodyPart}
              value={bodyPart}
              onChange={item => {
                setBodyPart(item.bodypart_title);
              }}
              renderItem={renderItem}
            />
          </View>
          <View
            style={[
              styles.meditionBox,
              {paddingBottom: 300, top: value == 1 ? DeviceHeigth * 0.05 : 0},
            ]}>
            <FlatList
              data={filteredCategories}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem1}
              ListEmptyComponent={emptyComponent}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              removeClippedSubviews={true}
            />
          </View>
        </View>
        <LinearGradient
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          // colors={['#941000', '#D01818']}
          colors={['#D01818', '#941000']}
          style={{
            width: DeviceWidth * 0.55,
            height: 40,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            alignSelf: 'center',
            bottom: Platform.OS == 'ios' ? 35 : 10,
          }}>
          <TouchableOpacity
            style={{
              width: 180,
              height: 40,

              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
            onPress={() => {
              submitCustomExercise();
            }}
            activeOpacity={0.5}>
            <Image
              source={localImage.Plus}
              tintColor={AppColor.WHITE}
              style={{width: 20, height: 20}}
            />
            <Text style={styles.button}>{'Update Custom '}</Text>

            <Text style={[styles.button, {marginHorizontal: -5}]}>
              ({selectedItems?.length})
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    backgroundColor: AppColor.WHITE,
  },
  searchBar: {
    backgroundColor: '#FDFDFD',
    borderWidth: 0.5,
    borderColor: '#e7e7e7',
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeholderStyle: {
    fontSize: 16,
    color: AppColor.BLACK,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: AppColor.BLACK,
  },
  dropdown: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D5191A',
    width: DeviceWidth * 0.4,
    padding: 10,
    height: 50,
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    color: AppColor.BLACK,
  },
  meditionBox: {
    backgroundColor: 'white',
  },
  button: {
    fontSize: 15,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    textAlign: 'center',
    marginHorizontal: 10,
    color: AppColor.WHITE,
    fontWeight: '600',
    backgroundColor: 'transparent',
    //lineHeight: 25,
  },
});
export default EditCustomWorkout;
