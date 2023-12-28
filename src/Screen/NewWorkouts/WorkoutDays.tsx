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

const WorkoutDays = ({navigation, route}: any) => {
  const {data} = route.params;
  const [selected, setSelected] = useState(5);
  const BlackCircle = ({indexes, height, select}: any) => {
    return (
      <View style={{backgroundColor: 'white'}}>
        <Canvas
          style={{
            width: 40,
            height: height,
            top: -25,
          }}>
          <Circle cx={15} cy={15} color="#2F3133" r={15} />
          <Line
            p1={vec(9, 12)}
            p2={vec(15, 20)}
            strokeWidth={2}
            color={AppColor.WHITE}
          />
          <Line
            invertClip
            origin={vec(14, 20)}
            p1={vec(14, 20)}
            p2={vec(25, 10)}
            strokeWidth={2}
            color={AppColor.WHITE}
          />
          {Array(100)
            .fill(1, 0, 21)
            .map((item, index) => {
              if (indexes == 6) return;
              return (
                <Group>
                  {index <= 2 ? null : index % 2 == 0 ? (
                    <Line
                      key={index}
                      p1={vec(15, 8 * (index + 1))}
                      p2={vec(15, 8 * (index + 2))}
                      strokeWidth={2}
                      color={select ? '#2F3133' : 'blue'}
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
      </View>
    );
  };

  const Phase = ({index, percent}: any) => {
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
          text={`Phase ${index}: Start Easily`}
          fontSize={14}
          marginTop={0}
          y={20}
          width={`Phase ${index}: Start Easily`.length * 8}
        />
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
      </View>
    );
  };

  const Box = ({selected, data, index}: any) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          //   flex: 1,
          width: DeviceWidth * 0.8,
          backgroundColor: '#F3F4F7',
          height: selected ? DeviceHeigth * 0.2 : DeviceHeigth * 0.1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          borderRadius: 15,
          marginVertical: 5,
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
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: data?.image_path}}
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
              <Text style={[styles.category, {fontSize: 20}]}>{index}</Text>
              <Text style={styles.small}>12 | 45kcal</Text>
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
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View>
          {Array(7)
            .fill(1, 0, 7)
            .map((item, index) => (
              <View
                style={{
                  marginTop:
                    index == selected && index == 0
                      ? DeviceHeigth * 0.125
                      : selected != index && index == 0
                      ? DeviceHeigth * 0.1
                      : 0,
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
        </View>
        <View style={{alignSelf: 'flex-start'}}>
          <Phase index={1} percent={80} />
          {Array(7)
            .fill(1, 0, 7)
            .map((item, index) => (
              <Box selected={index == selected} index={index + 1} data={item} />
            ))}
        </View>
      </ScrollView>
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
});
