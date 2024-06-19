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
import React, {useEffect, useMemo, useRef, useState} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import {useDispatch, useSelector} from 'react-redux';
//import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/FontAwesome5';
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
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';

const EditCustomWorkout = ({navigation, route}) => {
  const data = route?.params?.item;
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getAllExercise = useSelector(state => state.getAllExercise);
  const [workoutList, setWorkoutList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [forLoading, setForLoading] = useState(false);
  const completeProfileData = useSelector(state => state.completeProfileData);
  const [bodyPart, setBodyPart] = useState(
    completeProfileData?.focusarea[0].bodypart_title,
  );
  const [filteredCategories, setFilteredCategories] = useState([]);

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
  }, [filteredCategories]);
  const filterData = () => {
    const ExerciseIds = [];

    data.exercise_data.map(item => ExerciseIds.push(item.exercise_id));
    setSelectedItems(ExerciseIds);
  };

  const renderItem1 = useMemo(
    () =>
      ({item, index}) => {
        const isSelected = selectedItems?.includes(item?.exercise_id);

        return (
          <>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                selectedExercise(item?.exercise_id);
              }}
              style={{
                width: '100%',
                borderRadius: 10,
                backgroundColor: '#FDFDFD',
                marginVertical: 8,
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'space-between',
                // paddingHorizontal: 20,
                padding: 5,

                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={{uri: item.exercise_image_link}}
                  style={{
                    width: 80,
                    height: 80,
                    justifyContent: 'center',
                    alignSelf: 'center',

                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#D9D9D9',
                    //marginHorizontal: -7,
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
            {index !== filteredCategories.length - 1 && (
              <View
                style={{
                  width: '100%',
                  height: 1,

                  alignItems: 'center',
                  backgroundColor: '#33333314',
                }}
              />
            )}
          </>
        );
      },
    [selectedItems,filteredCategories],
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

    try {
      const res = await axios(`${NewAppapi.EDIT_CUSTOM_WORKOUY}`, {
        data: payload,
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res?.data?.msg == 'data updated successfully') {
        showMessage({
          message: 'Workout updated successfully.',
          type: 'success',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        getCustomWorkout();
        getUserDetailData();
      } else {
        setForLoading(false);
        showMessage({
          message: 'Something went wrong please try again!',
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
  const getUserDetailData = async () => {
    try {
      const responseData = await axios.get(
        `${NewAppapi.ALL_USER_DETAILS}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails?.id}`,
      );

      if (
        responseData?.data?.msg ==
        'Please update the app to the latest version.'
      ) {
        showMessage({
          message: responseData?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        setForLoading(false);
        dispatch(setCustomWorkoutData(responseData?.data?.workout_data));
        navigation.navigate('CustomWorkout');
      }
    } catch (error) {
      console.log('GET-USER-DATA', error);
      setForLoading(false);
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
      <DietPlanHeader
        header={'Edit Custom Workout'}
        shadow
        left={DeviceHeigth >= 1024 ? DeviceWidth * 0.045 : DeviceWidth * 0.02}
      />
      {forLoading ? <ActivityLoader /> : ''}
      <View style={styles.container}>
        <View style={{width: '95%', alignSelf: 'center'}}>
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
              top: -DeviceWidth * 0.05,
            }}>
            <Icons name="search" size={18} color={'#333333E5'} />
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
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              width: '100%',
              alignSelf: 'center',
            }}>
            <FlatList
              data={completeProfileData?.focusarea}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[
                    styles.listView,
                    {
                      backgroundColor:
                        bodyPart == item.bodypart_title ? '#A937371A' : '#fff',
                      borderWidth: bodyPart != item.bodypart_title ? 1 : 0,
                      borderColor:
                        bodyPart != item.bodypart_title
                          ? '#33333333'
                          : '#A937371A',
                      marginLeft: index == 0 ? DeviceWidth * 0.06 : 0,
                      marginRight:
                        index == completeProfileData?.focusarea?.length - 1
                          ? DeviceWidth * 0.06
                          : 5,
                    },
                  ]}
                  onPress={() => {
                    setBodyPart(item.bodypart_title);
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '500',
                      lineHeight: 16,
                      textAlign: 'center',
                      color:
                        bodyPart != item.bodypart_title
                          ? '#333333E5'
                          : '#A93737',
                      fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    }}>
                    {item.bodypart_title}
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              removeClippedSubviews={true}
            />
          </View>
          <View
            style={[
              styles.meditionBox,
              {paddingBottom: 300, top: DeviceHeigth * 0.03},
            ]}>
            <FlatList
              // data={filteredCategories}
              data={[
                ...filteredCategories.filter(item =>
                  selectedItems.includes(item.exercise_id),
                ),
                ...filteredCategories.filter(
                  item => !selectedItems.includes(item.exercise_id),
                ),
              ]}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
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
          colors={['#A93737', '#A93737']}
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
            <Text style={styles.button}>{'Update Workout '}</Text>

            <Text style={[styles.button, {marginHorizontal: -5}]}>
              ({selectedItems?.length}){' '}
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
  listView: {
    paddingLeft: 15,
    paddingRight: 15,
    height: 30,

    borderRadius: 25,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default EditCustomWorkout;
