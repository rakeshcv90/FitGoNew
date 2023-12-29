import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {AppColor} from '../../Component/Color';
import Header from '../../Component/Headers/NewHeader';
import GradientText from '../../Component/GradientText';
import moment from 'moment';
import {Canvas, Circle, Group, Line, vec} from '@shopify/react-native-skia';
import LinearGradient from 'react-native-linear-gradient';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import ProgressButton from '../../Component/ProgressButton';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {localImage} from '../../Component/Image';
import {showMessage} from 'react-native-flash-message';

const WorkoutDays = ({navigation, route}: any) => {
  const {data} = route.params;
  const [selected, setSelected] = useState(0);
  const [phase, setPhase] = useState(1);
  const [openDay, setOpenDay] = useState(false);
  const [day, setDay] = useState(1);
  const [dayData, setDayData] = useState([]);

  const {allWorkoutData, getUserDataDetails} = useSelector(
    (state: any) => state,
  );

  let totalTime = 0;
  for (const day in data?.days) {
    if (day != 'Rest') {
      totalTime = totalTime + parseInt(data?.days[day]?.exercise_rest);
    }
  }
  const dispatch = useDispatch();
  const BlackCircle = ({indexes, select, index}: any) => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          marginRight: 10,
          marginLeft: 0,
          width: 40,
          overflow: 'hidden',
          height: select ? DeviceHeigth * 0.2 : DeviceHeigth * 0.1,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: index == 0 || index == 4 ? DeviceHeigth * 0.05 : 0,
        }}>
        {/* {index != 0 ? (
          <Canvas
            style={{
              width: 40,
              height: select
                ? (DeviceHeigth * 0.2) / 2.5
                : (DeviceHeigth * 0.1) / 3,
              left: 5,
              // backgroundColor: 'red',
            }}>
            {Array(100)
              .fill(1, 0, 21)
              .map((item, index) => {
                return (
                  <Group>
                    {index % 2 == 0 ? (
                      <Line
                        key={index}
                        p1={vec(15, 8 * (index + 1))}
                        p2={vec(15, 8 * (index + 2))}
                        strokeWidth={2}
                        color={'#2F3133'}
                      />
                    ) : (
                      <Line
                        key={index}
                        p1={vec(15, 8 * (index + 1))}
                        p2={vec(15, 8 * (index + 2))}
                        strokeWidth={2}
                        color="white"
                      />
                    )}
                  </Group>
                );
              })}
          </Canvas>
        ) : (
          <View
            style={{
              width: 40,
              height: select
                ? (DeviceHeigth * 0.2) / 2.5
                : (DeviceHeigth * 0.1) / 3,
            }}
          />
        )} */}
        {index < selected ? (
          <Image
            source={localImage.BlackCircle}
            style={{height: 30, width: 30}}
          />
        ) : (
          <Image
            source={localImage.GreyCircle}
            style={{height: 30, width: 30}}
          />
        )}
        {/* <Canvas
          style={{
            width: 40,
            height: select
              ? (DeviceHeigth * 0.2) / 4
              : (DeviceHeigth * 0.1) / 3,
            left: 5,
            // backgroundColor: 'red',
          }}>
          {Array(100)
            .fill(1, 0, 21)
            .map((item, index) => {
              return (
                <Group>
                  {index % 2 == 0 ? (
                    <Line
                      key={index}
                      p1={vec(15, 8 * (index + 1))}
                      p2={vec(15, 8 * (index + 2))}
                      strokeWidth={2}
                      color={'#2F3133'}
                    />
                  ) : (
                    <Line
                      key={index}
                      p1={vec(15, 8 * (index + 1))}
                      p2={vec(15, 8 * (index + 2))}
                      strokeWidth={2}
                      color="white"
                    />
                  )}
                </Group>
              );
            })}
        </Canvas> */}
      </View>
    );
  };

  const Phase = ({index, percent, select}: any) => {
    const gradientColors = ['#D5191A', '#941000'];
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: DeviceWidth * 0.8,
          alignSelf: 'flex-end',
        }}>
        <GradientText
          text={phase == 1 ? `Phase 1: Start Easily` : `Phase 2: Warm Ups`}
          fontSize={14}
          marginTop={0}
          y={20}
          width={
            phase == 1
              ? `Phase 1: Start Easily`.length * 8
              : `Phase 1: Warm Ups`.length * 8
          }
          colors={select ? gradientColors : ['#505050', '#505050']}
        />
        {select && (
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 5,
                width: DeviceWidth * 0.2,
                borderRadius: 5,
                overflow: 'hidden',
                backgroundColor: '#d9d9d9',
              }}>
              <LinearGradient
                colors={gradientColors}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                style={{
                  height: 5,
                  width: `${percent}%`,
                }}
              />
            </View>
            <GradientText
              text={`${percent}%`}
              fontSize={14}
              marginTop={0}
              y={20}
              width={50}
            />
          </View>
        )}
      </View>
    );
  };

  const Box = ({selected, item, index}: any) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          selected
            ? navigation.navigate('OneDay', {
                data: data,
                dayData: item,
                day: index,
              })
            : showMessage({
                message: `Please complete Day ${index - 1} Exercise First !!!`,
                type: 'danger',
              });
        }}
        style={[
          styles.box,
          {
            backgroundColor:
              index == 1 || index == 5
                ? '#F3F4F7'
                : index == 2 || index == 6
                ? '#EAEBFF'
                : index == 3 || index == 7
                ? '#FFE8E1'
                : '#CEF2F9',
            height: selected ? DeviceHeigth * 0.2 : DeviceHeigth * 0.1,
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: data?.workout_image_link}}
            style={{height: 80, width: 60, marginLeft: DeviceWidth * 0.12}}
            resizeMode="contain"
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 10,
              width: '80%',
            }}>
            <View>
              <Text
                style={[
                  styles.category,
                  {fontSize: 20},
                ]}>{`Day ${index}`}</Text>
              <Text style={styles.small}>
                {item?.exercise_rest} min | {item?.exercise_calories} Kcal
              </Text>
            </View>
            <Icons
              name={'chevron-right'}
              size={25}
              color={AppColor.INPUTTEXTCOLOR}
            />
          </View>
        </View>
        {selected && (
          <ProgressButton
            text="Start Training"
            w={DeviceWidth * 0.75}
            bR={10}
            fill={'20%'}
            h={DeviceHeigth * 0.08}
          />
        )}
      </TouchableOpacity>
    );
  };

  const Time = () => {
    return (
      <LinearGradient
        start={{x: 1, y: 0}}
        end={{x: 0, y: 1}}
        colors={['#941000', '#D5191A']}
        style={[
          {
            width: DeviceWidth,
            height: 100,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginLeft: -15,
            // justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 10,
          },
        ]}>
        <Text
          style={{
            color: AppColor.WHITE,
            fontSize: 18,
            lineHeight: 30,
            fontFamily: 'Poppins',
            fontWeight: '500',
          }}>
          Time
        </Text>
        <Text
          style={{
            color: AppColor.WHITE,
            fontSize: 28,
            lineHeight: 30,
            fontFamily: 'Poppins',
            fontWeight: '600',
          }}>
          {totalTime} min
        </Text>
      </LinearGradient>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        header={
          data?.workout_title == undefined ? 'Full Body' : data?.workout_title
        }
        backButton
        SearchButton={false}
      />
      <GradientText
        text={'Today'}
        fontWeight={'500'}
        fontSize={22}
        width={150}
        x={1}
      />
      <Text style={[styles.category, {marginTop: 10}]}>
        {moment().format('dddd DD MMMM')}
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          // flexDirection: 'row',
          alignItems: 'center',
        }}>
        {/* <View>
          {Array(7)
            .fill(1, 0, 7)
            .map((item, index) => (
              <View
                style={{
                  marginTop:
                    index == 0 ? DeviceHeigth * 0.08 : -DeviceHeigth * 0.01,
                  marginRight: 15,
                }}>
                <BlackCircle
                  indexes={index}
                  select={index != selected}
                  height={
                    selected == index && index == 0
                      ? 160
                      : 120
                      ? selected == index && index == 1
                        ? 170
                        : 120
                      : selected == index && index == 2
                      ? 170
                      : 120
                      ? selected == index && index == 3
                        ? 170
                        : 120
                      : 120
                      ? selected == index && index == 4
                        ? 170
                        : 120
                      : 120
                      ? selected == index && index == 5
                        ? 170
                        : 120
                      : 120
                      ? selected == index && index == 6
                        ? 170
                        : 120
                      : 120
                  }
                />
              </View>
            ))}
        </View> */}
        <View style={{alignSelf: 'flex-start'}}>
          {Object.values(data?.days).map((item: any, index: number) => {
            if (item == 'Rest') {
              return (
                <View>
                  <Text>Rest</Text>
                </View>
              );
            }
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                {index < 4 ? (
                  <BlackCircle index={index} select={index == selected} />
                ) : (
                  <View style={{width: 40}} />
                )}
                <View>
                  {(index == 0 || index == 4) && (
                    <Phase
                      index={index + 1}
                      percent={80}
                      select={index <= selected}
                    />
                  )}
                  <Box
                    selected={index == selected}
                    index={index + 1}
                    item={item}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <Time />
    </View>
  );
};

export default WorkoutDays;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
    paddingHorizontal: 15,
  },
  category: {
    fontFamily: 'Poppins',
    fontSize: 26,
    fontWeight: '600',
    color: AppColor.LITELTEXTCOLOR,
    lineHeight: 30,
  },
  small: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '500',
    color: AppColor.BoldText,
    lineHeight: 30,
  },
  box: {
    //   flex: 1,
    width: DeviceWidth * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.5,
        // shadowRadius: 10,
      },
      android: {
        elevation: 10,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.1,
        // shadowRadius: 10,
      },
    }),
  },
});
