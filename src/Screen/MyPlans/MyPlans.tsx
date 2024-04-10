import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import NewHeader from '../../Component/Headers/NewHeader';
import Play from '../NewWorkouts/Exercise/Play';
import {localImage} from '../../Component/Image';
import {DeviceWidth, NewAppapi} from '../../Component/Config';
import moment from 'moment';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import GradientText from '../../Component/GradientText';
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from '../../Component/GradientButton';
import axios from 'axios';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

const WeekArray = Array(7)
  .fill(0)
  .map(
    (item, index) =>
      (item = moment()
        .add(index, 'days')
        .subtract(moment().isoWeekday() - 1, 'days')
        .format('ddd')),
  );
const TABS = createMaterialTopTabNavigator();

const WeekTab = ({state, descriptors, navigation}: any) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: DeviceWidth * 0.01,
        marginTop: DeviceWidth * 0.02,
        height: DeviceWidth * 0.12,
      }}>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        return (
          <TouchableOpacity
            onPress={onPress}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor:
                label == moment().format('ddd') ? '#FFDEDE' : 'white',
              borderColor:
                label == moment().format('ddd') ? '#D5191A' : 'white',
              borderRadius: label == moment().format('ddd') ? 25 : 0,
              paddingHorizontal: 5,
              borderWidth: label == moment().format('ddd') ? 1.5 : 0,
              width: 45,
              height: 45,
            }}>
            {/* {isFocused ? (
              <View
                style={{
                  flexDirection: 'row',
                }}>
                {label?.split('')?.map((item: string, index: number) => (
                  <Text
                    style={[
                      styles.labelStyle,
                      {
                        color: index < 1 ? '#D5191A' : '#941000',
                        // color: 'transparent',
                        fontWeight: '600',
                      },
                    ]}>
                    {item}
                  </Text>
                ))}
              </View>
            ) : ( */}
            <Text
              style={[
                styles.labelStyle,
                {
                  color: isFocused ? AppColor.RED1 : AppColor.BoldText,
                  fontWeight: '600',
                },
              ]}>
              {label}
            </Text>
            {/* )} */}
            <View>
              {isFocused ? (
                <>
                  <View
                    style={{
                      width: DeviceWidth * 0.05,
                      height: 1,
                    }}
                  />
                  <LinearGradient
                    colors={['#D5191A', '#941000']}
                    start={{x: 0, y: 1}}
                    end={{x: 1, y: 0}}
                    style={{
                      width: DeviceWidth * 0.03,
                      height: 2,
                      backgroundColor: 'red',
                      alignSelf: 'center',
                    }}
                  />
                </>
              ) : (
                <View
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: 5,
                    backgroundColor: AppColor.BoldText,
                  }}
                />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Box = ({item, index}: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const avatarRef = React.createRef();

  return (
    <TouchableOpacity style={styles.box} activeOpacity={0.9} onPress={() => {}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {/* <View
          style={{
            height: 60,
            width: 60,
            // backgroundColor: AppColor.WHITE,
            // borderRadius: 10,
          }}> */}
        {/* {isLoading && (
            <ShimmerPlaceholder
              style={{height: 75, width: 75, alignSelf: 'center'}}
              autoRun
              ref={avatarRef}
            />
          )} */}
        <Image
          source={{uri: item?.exercise_image}}
          onLoad={() => setIsLoading(false)}
          style={{
            height: 50,
            width: 50,
            alignSelf: 'center',
          }}
          resizeMode="contain"
        />
        <View
          style={{
            alignItems: 'center',
            marginHorizontal: 20,
          }}>
          <View>
            <Text
              style={{
                fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                fontSize: 14,
                fontWeight: '500',
                color: AppColor.LITELTEXTCOLOR,
                lineHeight: 20,
              }}>
              {item?.exercise_title}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: Fonts.MONTSERRAT_MEDIUM,
                  fontSize: 12,
                  fontWeight: '600',
                  color: AppColor.BoldText,
                  lineHeight: 30,
                }}>
                Set:
                <Text style={styles.small}>
                  {' '}
                  {item?.exercise_rest}
                  {'   '}
                </Text>
                Reps:
                <Text style={styles.small}>
                  {' '}
                  {item?.exercise_rest}
                  {'   '}
                </Text>
                Time:
                <Text style={styles.small}>
                  {' '}
                  {item?.exercise_rest}
                  {'   '}
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const MyPlans = ({navigation}: any) => {
  const [exerciseData, setExerciseData] = useState([]);
  useEffect(() => {
    allWorkoutApi();
  }, []);

  const allWorkoutApi = async () => {
    try {
      const res = await axios({
        url: NewAppapi.Get_DAYS + '?day=' + 1 + '&workout_id=' + 4,
      });
      if (res.data) {
        setExerciseData(res.data);
      }
    } catch (error) {
      console.error(error, 'DaysAPIERror');
      setExerciseData([]);
    }
  };
  const WeekDay = () => {
    return (
      <View style={{backgroundColor: AppColor.WHITE, flex: 1}}>
        <FlatList
          data={exerciseData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}: any) => <Box item={item} index={index} />}
        />
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: AppColor.WHITE,
      }}>
      <NewHeader
        header={'Workout Plan'}
        SearchButton={false}
        backButton={false}
      />
      <View style={{flex: 1, marginTop: -DeviceWidth * 0.1}}>
        <Text style={[styles.semiBold, {marginLeft: 10}]}>
          Get Fit{' '}
          {
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text
                style={[
                  styles.semiBold,
                  {color: AppColor.NewGray, lineHeight: 25, fontWeight: 'bold'},
                ]}>
                .
              </Text>
            </View>
          }{' '}
          Week 1
        </Text>
        <TABS.Navigator tabBar={props => <WeekTab {...props} />}>
          {WeekArray.map((item: string, index: number) => (
            <TABS.Screen name={item} component={WeekDay} />
          ))}
        </TABS.Navigator>
        <GradientButton
          text="Start Workout"
          alignSelf
          flex={0.2}
          Image={localImage.StartWorkoutButton}
          ImageStyle={{
            width: DeviceWidth * 0.05,
            height: DeviceWidth * 0.05,
            marginRight: DeviceWidth * 0.01,
          }}
          //   h={60}
        />
      </View>
    </SafeAreaView>
  );
};

export default MyPlans;

const styles = StyleSheet.create({
  semiBold: {
    color: AppColor.NewBlack,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 16,
    lineHeight: 30,
    fontWeight: '700',
  },
  labelStyle: {
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 20,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
  },
  category: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
    color: AppColor.BoldText,
    lineHeight: 30,
  },
  small: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 12,
    fontWeight: '500',
    color: AppColor.BoldText,
    lineHeight: 30,
  },
  box: {
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D9D9D9',
    backgroundColor: '#FDFDFD',
    width: DeviceWidth * 0.95,
    padding: 10,
    marginVertical: 7,
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
  },
});
