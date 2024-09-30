import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import DietPlanHeader from '../Component/Headers/DietPlanHeader';
import {AnalyticsConsole} from '../Component/AnalyticsConsole';
import {AppColor, Fonts} from '../Component/Color';
import NewMealList from '../Screen/NewMeal/NewMealList';
import CustomMealList from '../Screen/NewMeal/CustomMealList';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {localImage} from '../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import FitText from '../Component/Utilities/FitText';
import {useDispatch, useSelector} from 'react-redux';
import {setMealTypeData} from '../Component/ThemeRedux/Actions';
import CreateMealList from '../Screen/NewMeal/CreateMealList';
import {useIsFocused} from '@react-navigation/native';
import NewHeader1 from '../Component/Headers/NewHeader1';
import Wrapper from '../Screen/WorkoutCompleteScreen/Wrapper';
import BottomSheet1 from '../Component/BottomSheet';

const Tab = createMaterialTopTabNavigator();

const DietPlatTabBar = ({navigation}) => {
  const getCustomDietData = useSelector(state => state.getCustomDietData);
  const refStandard = useRef();
  const mealData = useSelector(state => state.mealData);
  const isFocused = useIsFocused();
  const [showSearchButton, setShowSearchButton] = useState(true);

  useEffect(() => {
    if (!isFocused) {
      setShowSearchButton(true);
    }
  }, [isFocused]);
  const meal_type = [
    {
      id: 1,
      title: 'Veg',
      ima: require('../Icon/Images/InAppRewards/Veg.png'),
    },
    {
      id: 2,
      title: 'Non-Veg',
      ima: require('../Icon/Images/InAppRewards/Nonveg.png'),
    },
  ];

  const BottomSheetContent = () => {
    const getDietFilterData = useSelector(state => state?.getDietFilterData);
    const dispatch = useDispatch();
    const [selectedItem, setSelectedItem] = useState(getDietFilterData);
    return (
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
              refStandard.current.closeSheet();
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
            flex: 1,
            //height: DeviceHeigth * 0.35,
            marginTop: 20,
            justifyContent: 'center',
            width: DeviceWidth * 0.9,
            alignSelf: 'center',
            alignItems: 'center',
            flexDirection: 'row'
          }}>
          {meal_type.map((item, index) => {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedItem(index);
                }}
                style={{
                  marginHorizontal: 10,
                  // marginEnd: 20,
                  width: DeviceWidth / 2.4,
                  //height: 124,
                  justifyContent: 'center',
                  marginBottom: 20,
                  alignSelf: 'center',
                  backgroundColor: '#F9F9F9',
                  alignItems: 'center',
                  borderRadius: 10,
                  borderWidth: 1.5,
                  borderColor: selectedItem == index ? AppColor.RED : '#fff',
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
            );
          })}
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
              refStandard.current.closeSheet();
            }}
          />

          <TouchableOpacity
            onPress={() => {
              dispatch(setMealTypeData(selectedItem));
              refStandard.current.closeSheet();
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
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <Wrapper styles={{backgroundColor: AppColor.WHITE}}>
        <NewHeader1
          header={'Diet plan'}
          backButton
          icon={showSearchButton ? true : false}
          onBackPress={() => {
            navigation?.goBack();
          }}
          onIconPress={() => {
            AnalyticsConsole('Diet_Item_Click');
            refStandard.current.openSheet();
          }}
          iconSource={require('../Icon/Images/NewImage2/filter.png')}
        />
        <Tab.Navigator
          initialRouteName="Breakfast"
          screenOptions={{
            tabBarLabelStyle: {fontSize: 11, fontWeight: '700'},
            tabBarInactiveTintColor: AppColor.CHECKBOXCOLOR,
            tabBarActiveTintColor: AppColor.BLACK,
            tabBarStyle: {backgroundColor: AppColor.WHITE},
            tabBarItemStyle: {
              // width: 'auto',
            },
            tabBarContentContainerStyle: {
              // justifyContent: 'space-between', // Distribute tabs evenly
            },
            tabBarIndicatorStyle: {backgroundColor: AppColor.RED},
          }}
          screenListeners={{
            state: e => {
              const route = e.data.state.routes[e.data.state.index];
              setShowSearchButton(route.name !== 'My meal');
            },
          }}>
          <Tab.Screen
            name="Breakfast"
            component={NewMealList}
            initialParams={{data: mealData?.breakfast}}
          />
          <Tab.Screen
            name="Lunch"
            component={NewMealList}
            initialParams={{data: mealData?.lunch}}
          />
          <Tab.Screen
            name="Dinner"
            component={NewMealList}
            initialParams={{data: mealData?.dinner}}
          />
          {getCustomDietData.length > 0 && (
            <Tab.Screen name="My meal" component={CreateMealList} />
          )}
        </Tab.Navigator>
        <BottomSheet1 ref={refStandard}>
          <BottomSheetContent />
        </BottomSheet1>
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
});
export default DietPlatTabBar;
