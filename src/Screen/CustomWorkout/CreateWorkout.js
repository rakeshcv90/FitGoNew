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
// import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/FontAwesome5';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import ActivityLoader from '../../Component/ActivityLoader';
import AnimatedLottieView from 'lottie-react-native';
import {setCustomWorkoutData} from '../../Component/ThemeRedux/Actions';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {BannerAdd} from '../../Component/BannerAdd';
import {bannerAdId} from '../../Component/AdsId';
import NativeAddTest from '../../Component/NativeAd';
import moment from 'moment';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import VersionNumber, {appVersion} from 'react-native-version-number';
import {ReviewApp} from '../../Component/ReviewApp';

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

  const completeProfileData = useSelector(state => state.completeProfileData);
  const {getUserID} = useSelector(state => state);
  const [bodyPart, setBodyPart] = useState(
    completeProfileData?.focusarea[0].bodypart_title,
  );
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const avatarRef = React.createRef();
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
                width: '90%',
                borderRadius: 10,

                marginVertical: 8,
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                padding: 5,
                paddingVertical: 8,

                justifyContent: 'space-between',
                backgroundColor: AppColor.WHITE,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    height: 70,
                    width: 70,
                    borderRadius: 5,
                    borderWidth: 0.5,
                    borderColor: 'lightgrey',
                    marginLeft: -12,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{
                      width: 60,
                      height: 60,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      // backgroundColor:'red',
                      marginHorizontal: -7,
                    }}
                    source={{
                      uri: getStoreVideoLoc[item?.exercise_title + 'Image']
                        ? 'file://' +
                          getStoreVideoLoc[item?.exercise_title + 'Image']
                        : item.exercise_image_link ?? localImage.NOWORKOUT,
                    }}
                    resizeMode={'contain'}
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
                      {'Time : '}
                      {item?.exercise_rest}
                    </Text>
                  </View>
                </View>
              </View>
              <Image
                source={isSelected ? localImage.Minus : localImage.Plus}
                style={{width: 20, height: 20}}
                resizeMode="contain"
                tintColor={AppColor.RED}
              />
            </TouchableOpacity>
            {index !== completeProfileData?.focusarea?.length - 1 && (
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
      },
    [selectedItems, bodyPart],
  );
  const getAdsDisplay = (index, item) => {
    const noOrNoobPlan =
      getPurchaseHistory?.plan == null || getPurchaseHistory?.plan == 'noob';
    if (filteredCategories.length > 1) {
      if (noOrNoobPlan && index == 0) {
        return getNativeAdsDisplay();
      } else if ((index + 1) % 8 == 0 && filteredCategories.length > 8) {
        return getNativeAdsDisplay();
      } else {
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
    AnalyticsConsole(`Custom_Wrk_BUTTON`);

    if (selectedItems.length <= 0) {
      showMessage({
        message: 'Please select exercise ',
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

      try {
        const res = await axios(`${NewAppapi.USER_CUSTOM_WORKOUT}`, {
          data: payload,
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (res.data.msg == 'data inserted successfully') {
          getUserDetailData();
        } else {
          setForLoading(false);
        }
      } catch (error) {
        setForLoading(false);

        showMessage({
          message: 'Something went wrong please try again!',
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      }
    }
  };
  const nav = () => navigation.goBack();

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
        showMessage({
          message: 'Workout created successfully.',
          type: 'success',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        dispatch(setCustomWorkoutData(responseData?.data?.workout_data));
        setForLoading(false);
        ReviewApp(nav);
      }
    } catch (error) {
      console.log('GET-USER-DATA', error);
      setForLoading(false);
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
      {forLoading ? <ActivityLoader /> : ''}
      <View style={styles.container}>
        <View style={styles.shadow}>
          <DietPlanHeader
            header={route?.params?.workoutTitle}
            shadow
            left={
              DeviceHeigth >= 1024 ? DeviceWidth * 0.045 : DeviceWidth * 0.02
            }
          />
          <View
            style={{
              width: '95%',
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
              marginVertical: 5,
              height: DeviceHeigth * 0.05,
              alignItems: 'center',
              // zIndex: -1,
              justifyContent: 'center',
              alignSelf: 'center',
              width: '100%',
              left: -10,
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
                          : AppColor.RED,
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
        </View>

        <View style={[styles.meditionBox]}>
          <FlatList
            data={filteredCategories}
            contentContainerStyle={{paddingBottom: DeviceHeigth * 0.25}}
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
        <View
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            height: 45,
            backgroundColor: AppColor.RED,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            alignSelf: 'center',
            bottom: Platform.OS == 'ios' ? 20 : 10,
          }}>
          <TouchableOpacity
            style={{
              //width: 180,
              height: 40,

              borderRadius: 10,
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
        </View>
      </View>
      {/* {bannerAdsDisplay()} */}
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
    top: 0,
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
  listView: {
    paddingLeft: 15,
    paddingRight: 15,
    height: 30,

    borderRadius: 25,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
});
export default CreateWorkout;
