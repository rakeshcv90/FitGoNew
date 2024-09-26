import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import {AppColor, Fonts} from '../../Component/Color';
import RBSheet from 'react-native-raw-bottom-sheet';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import FitText from '../../Component/Utilities/FitText';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';
import {BannerAdd} from '../../Component/BannerAdd';
import {bannerAdId} from '../../Component/AdsId';
import FastImage from 'react-native-fast-image';
import {showMessage} from 'react-native-flash-message';

import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import ActivityLoader from '../../Component/ActivityLoader';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import VersionNumber from 'react-native-version-number';
import {
  setCustomDietData,
  setMealTypeData,
} from '../../Component/ThemeRedux/Actions';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';

const CustomMealList = ({navigation, route}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getCustomDietData = useSelector(state => state.getCustomDietData);
  const getDietFilterData = useSelector(state => state?.getDietFilterData);
  dispatch = useDispatch();

  const [filterMealList, setFilterMealList] = useState(
    route?.params?.totalMealData,
  );

  const [forLoading, setForLoading] = useState(false);

  const refStandard = useRef();
  const meal_type = [
    {
      id: 1,
      title: 'Veg',
      ima: require('../../Icon/Images/InAppRewards/Veg.png'),
    },
    {
      id: 2,
      title: 'Nonveg',
      ima: require('../../Icon/Images/InAppRewards/Nonveg.png'),
    },
  ];
  useEffect(() => {
    updateFilteredCategories(getDietFilterData);
  }, [getDietFilterData]);
  const BottomSheet = () => {
    const [selectedItem, setSelectedItem] = useState(getDietFilterData);
    return (
      <>
        <RBSheet
          ref={refStandard}
          // draggable
          closeOnPressMask={false}
          customModalProps={{
            animationType: 'slide',
            statusBarTranslucent: true,
          }}
          customStyles={{
            container: {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              height:
                DeviceHeigth >= 1024
                  ? DeviceHeigth * 0.32
                  : DeviceHeigth >= 856
                  ? DeviceHeigth * 0.4
                  : DeviceHeigth <= 667
                  ? DeviceHeigth <= 625
                    ? DeviceHeigth * 0.55
                    : DeviceHeigth * 0.5
                  : DeviceHeigth * 0.42,
            },
            draggableIcon: {
              width: 80,
            },
          }}>
          <View style={styles.listContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: DeviceWidth * 0.9,
                alignSelf: 'center',
                alignItems: 'center',
                // top: -10,
              }}>
              <View />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  lineHeight: 24,
                  fontFamily: Fonts.MONTSERRAT_BOLD,
                  color: '#1E1E1E',
                  marginLeft: DeviceWidth * 0.06,
                }}>
                Filter
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  refStandard.current.close();
                }}>
                <Icons name={'close'} size={24} color={AppColor.BLACK} />
              </TouchableOpacity>
            </View>
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
              Food Categories
            </Text>
            <View
              style={{
                //height: DeviceHeigth * 0.35,
                marginTop: 20,
                justifyContent: 'center',
                width: DeviceWidth * 0.9,
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <FlatList
                data={meal_type}
                numColumns={2}
                // contentContainerStyle={{paddingBottom: DeviceHeigth * 0.0}}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => {
                  return (
                    <>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          setSelectedItem(index);
                        }}
                        style={{
                          // marginHorizontal: 10,
                          marginEnd: 20,
                          width: DeviceWidth / 2.4,
                          //height: 124,
                          justifyContent: 'center',
                          marginBottom: 20,
                          alignSelf: 'center',
                          backgroundColor: '#F9F9F9',
                          alignItems: 'center',
                          borderRadius: 10,
                          borderWidth: 1.5,
                          borderColor:
                            selectedItem == index ? AppColor.RED : '#fff',
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
                            paddingBottom: 20,
                          }}>
                          <Image
                            source={item.ima}
                            // onLoad={() => setImageLoad(false)}
                            defaultSource={localImage?.NOWORKOUT}
                            style={{
                              width: 60,
                              height: 60,
                              top: -10,
                              justifyContent: 'center',
                              alignSelf: 'center',
                            }}
                            resizeMode="contain"
                          />
                          <FitText
                            type="SubHeading"
                            value={item?.title}
                            fontWeight="700"
                            fontSize={15}
                            lineHeight={20}
                            color={AppColor.BLACK}
                            fontFamily={Fonts.MONTSERRAT_REGULAR}
                          />
                        </View>

                        <View />
                      </TouchableOpacity>
                    </>
                  );
                }}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={100}
                removeClippedSubviews={true}
              />
            </View>
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
            <View
              style={{
                width: DeviceWidth * 0.9,
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <FitText
                type="normal"
                value="Clear All"
                color={AppColor.RED}
                fontSize={15}
                textDecorationLine="underline"
                onPress={() => {
                  setSelectedItem(-1);
                  dispatch(setMealTypeData(-1));
                  refStandard.current.close();
                  // updateFilteredCategories(getDietFilterData);
                }}
              />

              <TouchableOpacity
                onPress={() => {
                  // setSelectedItem(-1);
                  // updateFilteredCategories(getDietFilterData);
                  dispatch(setMealTypeData(selectedItem));
                  refStandard.current.close();
                }}
                style={{
                  width: 150,
                  height: 50,
                  backgroundColor: AppColor.RED,
                  borderRadius: 6,
                  // alignSelf: 'flex-end',
                  justifyContent: 'center',
                  alignItems: 'center',
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
        </RBSheet>
      </>
    );
  };
  const selectedMealData = data => {
    const index = selectedItems.indexOf(data);

    const newSelectedItems = [...selectedItems];
    if (index === -1) {
      newSelectedItems.push(data);
    } else {
      newSelectedItems.splice(index, 1);
    }

    setSelectedItems(newSelectedItems);
  };
  const renderItem1 = useMemo(
    () =>
      ({index, item}) => {
        const isSelected = selectedItems?.includes(item?.diet_id);

        return (
          <>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                selectedMealData(item?.diet_id);
              }}
              style={{
                borderRadius: 10,
                marginVertical: 10,
                paddingVertical: 5,
                paddingHorizontal: 5,
                alignSelf: 'center',
                borderWidth: 1,
                borderColor: isSelected ? AppColor.RED : AppColor.WHITE,
                width: '95%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <FastImage
                fallback={true}
                style={{
                  width: 100,
                  height: 100,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderRadius: 10,
                }}
                source={{
                  uri: item.diet_image,
                  headers: {Authorization: 'someAuthToken'},
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
                defaultSource={localImage.NOWORKOUT}
              />
              <View
                style={{
                  width: DeviceWidth * 0.45,
                  top: 10,
                  left:
                    DeviceHeigth >= 1024
                      ? -DeviceHeigth * 0.1
                      : -DeviceHeigth * 0.02,
                }}>
                <FitText
                  type="SubHeading"
                  value={item?.diet_title}
                  fontWeight="700"
                  fontSize={14}
                  lineHeight={24}
                  color={AppColor.LITELTEXTCOLOR}
                  numberOfLines={1}
                  fontFamily={Fonts.MONTSERRAT_REGULAR}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 15,
                  }}>
                  <Image
                    source={localImage.Step1}
                    style={{width: 17, height: 17}}
                    resizeMode="contain"
                    tintColor={AppColor.RED}
                  />
                  <Text
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: 13,
                      fontWeight: '500',
                      color: AppColor.BLACK,
                      marginHorizontal: 5,
                      opacity: 0.7,
                    }}>
                    {item?.diet_calories} kcal
                  </Text>
                </View>
              </View>
              <Image
                source={isSelected ? localImage.Minus : localImage.Plus}
                style={{
                  width: 20,
                  height: 20,
                  top: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
                resizeMode="contain"
                tintColor={'#f0013b'}
              />
            </TouchableOpacity>
            {index !== (route?.params?.totalMealData).length - 1 && (
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
    [selectedItems, filterMealList],
  );

  const createMealPlan = async () => {
    AnalyticsConsole(`Custom_Meal_BUTTON`);
    const url =
      'https://fitme.cvinfotechserver.com/adserver/public/api/test_create_custom_diet';
    if (selectedItems.length <= 0) {
      showMessage({
        message: 'Please select meal',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    } else {
      setForLoading(true);
      const payload = new FormData();

      for (var i = 0; i < selectedItems.length; i++) {
        payload.append('meal_id[]', selectedItems[i]);
      }
      payload.append('version', VersionNumber?.appVersion);
      payload.append('user_id', getUserDataDetails?.id);
      // console.log("Payload",payload)
      try {
        const res = await axios(`${url}`, {
          // const res = await axios(`${NewAppapi.CUSTOM_MEAL}`, {
          data: payload,
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (res.data.msg == 'diet updated successfully.') {
          showMessage({
            message: 'Custom diet created successfully.',
            type: 'success',
            animationDuration: 500,
            floating: true,
            icon: {icon: 'auto', position: 'left'},
          });
          getUserDetailData();
        } else {
          getUserDetailData();
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
  const getUserDetailData = async () => {
    try {
      const responseData = await axios.get(
        `${NewAppapi.ALL_USER_DETAILS}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails.id}`,
      );
      setForLoading(false);
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
        dispatch(setCustomDietData(responseData?.data?.diet_data));
        navigation?.goBack();
      }
    } catch (error) {
      console.log('GET-USER-DATA', error);
    }
  };
  const updateFilteredCategories = test => {
    let filteredItems = [];
    if (test == -1) {
      setFilterMealList(route?.params?.totalMealData),
        refStandard.current.close();
    } else if (test == 0) {
      filteredItems = (route?.params?.totalMealData).filter(
        item => item?.meal_type.toLowerCase() == 'veg',
      );
      refStandard.current.close();
      setFilterMealList(filteredItems);
    } else {
      filteredItems = (route?.params?.totalMealData).filter(
        item => item?.meal_type.toLowerCase() == 'non_veg',
      );
      refStandard.current.close();
      setFilterMealList(filteredItems);
    }
  };
  return (
    <View style={styles.container}>
      {forLoading ? <ActivityLoader /> : ''}
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <Wrapper styles={{backgroundColor: AppColor.WHITE}}>
        <NewHeader1
          header={'Select meals'}
          backButton
          onBackPress={() => {
            navigation?.goBack();
            dispatch(setMealTypeData(-1));
          }}
          onIconPress={() => {
            refStandard.current.open();
          }}
          iconSource={require('../../Icon/Images/NewImage2/filter.png')}
        />
      <View
        style={{
          flex: 9,

          //alignSelf: 'center',
          // alignItems: 'center',
          justifyContent: 'center',
        }}>
        <FlatList
          data={filterMealList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 10}}
          renderItem={renderItem1}
        />
        <TouchableOpacity
          onPress={() => {
            if (selectedItems.length > 0) {
              createMealPlan();
            } else {
              showMessage({
                message:
                  'Select a meal from the given list to create your personalized diet plan!',
                type: 'danger',
                animationDuration: 500,
                floating: true,
                icon: {icon: 'auto', position: 'left'},
              });
            }
          }}
          activeOpacity={0.7}
          style={{
            padding: 10,
            flexDirection: 'row',
            borderRadius: 30,
            backgroundColor: 'red',
            position: 'absolute',
            bottom: 10,
            right: 0,
            justifyContent: 'space-between',
            alignItems: 'center',
            shadowColor: 'rgba(0, 0, 0, 1)',
            ...Platform.select({
              ios: {
                shadowColor: '#000000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.3,
                shadowRadius: 4,
              },
              android: {
                elevation: 10,
              },
            }),
          }}>
          <Image
            source={localImage.Plus}
            tintColor={AppColor.WHITE}
            style={{width: 20, height: 20, marginHorizontal: 10}}
          />
          <Text style={styles.button}>{'Add Custom'}</Text>

          <Text style={[styles.button, {marginHorizontal: 5}]}>
            ({selectedItems?.length})
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          justifyContent: 'flex-end',
        }}>
        <BannerAdd bannerAdId={bannerAdId} />
      </View>
      <BottomSheet />
     </Wrapper>
    </View>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: AppColor.WHITE,
  },
  listContainer: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
  },
  button: {
    fontSize: 15,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    textAlign: 'center',

    color: AppColor.WHITE,
    fontWeight: '600',
    backgroundColor: 'transparent',
    //lineHeight: 25,
  },
  listItem2: {
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
  },
  imageView: {
    // backgroundColor: AppColor.GRAY1,
    height: 95,
    width: 95,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#33333333',
    borderStyle: 'dotted',

    borderWidth: 2,
  },
});
export default CustomMealList;
