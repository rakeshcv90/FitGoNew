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
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {BannerAdd} from '../../Component/BannerAdd';
import {bannerAdId} from '../../Component/AdsId';
import NativeAddTest from '../../Component/NativeAddTest';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const CreateWorkout = ({navigation, route}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const customWorkoutData = useSelector(state => state.customWorkoutData);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getAllExercise = useSelector(state => state.getAllExercise);
  const getStoreVideoLoc = useSelector(state => state.getStoreVideoLoc);
  const [workoutList, setWorkoutList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [forLoading, setForLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(0);
  const animation = useSharedValue(0);
  const completeProfileData = useSelector(state => state.completeProfileData);
  const {getUserID} = useSelector(state => state);
  const [bodyPart, setBodyPart] = useState(
    completeProfileData?.focusarea[0].bodypart_title,
  );
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const avatarRef = React.createRef();
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
  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.bodypart_title}</Text>
      </View>
    );
  };
  const renderItem1 = useMemo(
    () =>
      ({index, item}) => {
        const isSelected = selectedItems?.includes(item?.exercise_id);

        return (
          <>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                selectedExercise(item?.exercise_id);
              }}
              style={{
                width: '97%',
                borderRadius: 10,
                // backgroundColor: '#FDFDFD',
                marginVertical: 8,
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                //padding: 5,
                // borderColor: '#D9D9D9',
                borderColor: isSelected ? 'red' : AppColor.GRAY2,
                borderWidth: 1,
                justifyContent: 'space-between',
                backgroundColor: AppColor.WHITE,
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
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* {isLoading && (
                  // <ActivityIndicator
                  //   style={styles.loader}
                  //   size="small"
                  //   color="#0000ff"
                  // />
                  <ShimmerPlaceholder
                    style={styles.loader}
                    ref={avatarRef}
                    autoRun
                  />
                )} */}
                <View
                  style={{
                    width: 81,
                    height: 81,
                    borderRadius: 10,
                    borderColor: 'black',
                    borderWidth: 1,
                    //backgroundColor:"red"
                  }}>
                  <Image
                    onLoad={() => setIsLoading(false)}
                    // source={{uri: item.exercise_image_link}}
                    source={{
                      uri: getStoreVideoLoc[item?.exercise_title + 'Image']
                        ? 'file://' +
                          getStoreVideoLoc[item?.exercise_title + 'Image']
                        : item.exercise_image_link,
                    }}
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
                </View>
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
                        fontWeight: '600',
                        color: '#202020',
                        lineHeight: 30,

                        fontFamily: Fonts.MONTSERRAT_MEDIUM,
                      }}>
                      {'Set: '}
                      {item?.exercise_sets}
                    </Text>
                    <Text
                      style={{
                        fontSize: 30,
                        fontWeight: '600',
                        color: '#202020',
                        lineHeight: 20,
                        marginHorizontal: 10,
                        fontFamily: Fonts.MONTSERRAT_MEDIUM,
                      }}>
                      .
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: '#202020',
                        lineHeight: 30,

                        fontFamily: Fonts.MONTSERRAT_MEDIUM,
                      }}>
                      {'Reps: '}
                      {item?.exercise_reps}
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
            {getAdsDisplay(index, item)}
          </>
        );
      },
    [selectedItems],
  );

  const getAdsDisplay = (index, item) => {
    if (filteredCategories.length > 1) {
      if (index == 0) {
        return getNativeAdsDisplay();
      } else if ((index + 1) % 8 == 0) {
        return getNativeAdsDisplay();
      }
    }
  };
  const getNativeAdsDisplay = () => {
    if (getPurchaseHistory.length > 0) {
      if (
        getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
      ) {
        return null;
      } else {
        return (
          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',

              //  top: DeviceHeigth * 0.1,
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

            //top: DeviceHeigth * 0.1,
          }}>
          <NativeAddTest type="image" media={false} />
        </View>
      );
    }
  };
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
    // console.log("user_Id",getUserID,getUserDataDetails?.id)
    if (selectedItems.length <= 0) {
      showMessage({
        message: 'Please Select Exercise ',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    } else {
      setForLoading(true);
      const payload = new FormData();

      for (var i = 0; i < selectedItems.length; i++) {
        payload.append('exercises[]', selectedItems[i]);
      }
      payload.append('workout_name', route?.params?.workoutTitle);
      payload.append('user_id', getUserDataDetails?.id) ?? getUserID;
      // payload.append('id', getUserID != 0 ? getUserID : null);
      payload.append('image', {
        name: route?.params?.workoutImg?.fileName,
        type: route?.params?.workoutImg?.type,
        uri: route?.params?.workoutImg?.uri,
      });
      console.log('Payload--->', payload);
      try {
        const res = await axios(`${NewAppapi.USER_CUSTOM_WORKOUT}`, {
          data: payload,
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (res.data.msg == 'data inserted successfully') {
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
    }
  };
  const getCustomWorkout = async () => {
    try {
      const data = await axios.get(
        `${NewAppapi.GET_USER_CUSTOM_WORKOUT}?user_id=${getUserDataDetails?.id}`,
      );

      if (data?.data?.msg != 'data not found.') {
        setForLoading(false);
        showMessage({
          message: 'Workout create Successful',
          type: 'success',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        dispatch(setCustomWorkoutData(data?.data?.data));
        navigation.goBack();
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
        header={route?.params?.workoutTitle}
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
                width: DeviceWidth * 0.95,
                height: 50,
                zIndex: 1,

                paddingHorizontal: 10,
                backgroundColor: value == 1 ? '#e7e7e7' : AppColor.WHITE,
                alignSelf: 'flex-end',
                flexDirection: 'row',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: value == 1 ? 20 : 10,
              },
              animatedStyle,
            ]}>
            <TextInput
              style={{width: '100%', color: 'black'}}
              placeholder={'Search here......'}
              placeholderTextColor={'gray'}
              value={searchQuery}
              onChangeText={text => {
                setSearchQuery(text);
                updateFilteredCategories(text);
              }}
            />
            <TouchableOpacity
              //style={{marginRight:10}}
              onPress={() => {
                setSearchQuery('');
                if (animation.value == 1) {
                  animation.value = 0;
                  setValue(0);
                } else {
                  animation.value = 1;
                  setValue(1);
                }
              }}>
              <Image
                style={{width: 15, height: 15}}
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
              showsVerticalScrollIndicator={false}
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
            width: 180,
            height: 40,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            alignSelf: 'center',
            bottom: Platform.OS == 'ios' ? 20 : 10,
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
            <Text style={styles.button}>{'Add Exercise'}</Text>

            <Text style={[styles.button, {marginHorizontal: -5}]}>
              ({selectedItems?.length})
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
      <BannerAdd bannerAdId={bannerAdId} />
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
  loader: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: AppColor.GRAY,

    height: 50,
    width: 50,
    borderRadius: 100 / 2,
  },
});
export default CreateWorkout;
