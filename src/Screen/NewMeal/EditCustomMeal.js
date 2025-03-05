import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import ActivityLoader from '../../Component/ActivityLoader';
import {useDispatch, useSelector} from 'react-redux';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import {
  setCustomDietData,
  setCustomWorkoutData,
  setEnteredCurrentEvent,
  setEnteredUpcomingEvent,
  setMealTypeData,
  setOfferAgreement,
  setPlanType,
  setPurchaseHistory,
  setUserProfileData,
} from '../../Component/ThemeRedux/Actions';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {BannerAdd} from '../../Component/BannerAdd';
import {bannerAdId} from '../../Component/AdsId';
import FitText from '../../Component/Utilities/FitText';
import {localImage} from '../../Component/Image'
import VersionNumber from 'react-native-version-number';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import {EnteringEventFunction} from '../Event/EnteringEventFunction';

const EditCustomMeal = ({navigation, route}) => {
  const [forLoading, setForLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getCustomDietData = useSelector(state => state.getCustomDietData);
  const getDietFilterData = useSelector(state => state?.getDietFilterData);
  const [filterMealList, setFilterMealList] = useState(
    route?.params?.totalMealData,
  );
  dispatch = useDispatch();

  useEffect(() => {
    filterData();
  }, [filterMealList]);
  const filterData = () => {
    const MealIds = [];

    getCustomDietData.map(item => MealIds.push(item.diet_id));
    setSelectedItems(MealIds);
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
              <Image
                style={{
                  width: 100,
                  height: 100,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderRadius: 10,
                }}
                source={{
                  uri: item.diet_image??localImage.NOWORKOUT,
                }}
                resizeMode={'cover'}
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
  const UpdateCustomMealList = async () => {
    const url =
      'https://fitme.cvinfotechserver.com/adserver/public/api/test_update_custom_diet';

    setForLoading(true);
    const payload = new FormData();

    for (var i = 0; i < selectedItems.length; i++) {
      payload.append('meal_id[]', selectedItems[i]);
    }

    payload.append('user_id', getUserDataDetails?.id);
    payload.append('version', VersionNumber.appVersion);

    try {
      const res = await axios(`${url}`, {
        data: payload,
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
   

      if (res?.data?.msg == 'diet updated successfully.') {
        showMessage({
          message: 'Meal updated successfully.',
          type: 'success',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
     
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

  const getUserDetailData = async () => {
    try {
      const responseData = await axios.get(
        `${NewAppapi.ALL_USER_DETAILS}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails?.id}`,
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
        setForLoading(false);
        dispatch(setCustomWorkoutData(responseData?.data?.workout_data));
        dispatch(setOfferAgreement(responseData?.data?.additional_data));

        dispatch(setUserProfileData(responseData?.data?.profile));
        dispatch(setCustomDietData(responseData?.data?.diet_data));
        navigation?.goBack();
      }
    } catch (error) {
      console.log('GET-USER-DATA UpdateMeal List', error);
      setForLoading(false);
   
    }
  };
  return (
    <View style={styles.container}>
      {forLoading ? <ActivityLoader /> : ''}
      <DietPlanHeader
        header={'Edit meals'}
        SearchButton={false}
        shadow
        backPressCheck={true}
        onPress={() => {
          navigation?.goBack();

          dispatch(setMealTypeData(-1));
        }}
        onPressImage={() => {
          // refStandard.current.open();
        }}
        source={require('../../Icon/Images/NewImage2/filter.png')}
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
              UpdateCustomMealList();
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
    width: DeviceWidth * 0.45,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    marginBottom: 5,
    padding: 15,
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
export default EditCustomMeal;
