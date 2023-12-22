import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AppColor} from '../../Component/Color';
import Header from '../../Component/Headers/NewHeader';
import GradientText from '../../Component/GradientText';
import moment from 'moment';
import {Canvas, Circle, Line, vec} from '@shopify/react-native-skia';
import LinearGradient from 'react-native-linear-gradient';
import {DeviceWidth} from '../../Component/Config';
import ProgressButton from '../../Component/ProgressButton';
import GradientButton from '../../Component/GradientButton';

const WorkoutDays = ({navigation, route}: any) => {
  const {data} = route.params;
  const BlackCircle = () => {
    return (
      <Canvas
        style={{
          width: 40,
          height: 40,
        }}>
        <Circle cx={20} cy={20} color="#2F3133" r={20} />
        <Line
          p1={vec(14, 17)}
          p2={vec(19, 22)}
          strokeWidth={2}
          color={AppColor.WHITE}
        />
        <Line
          invertClip
          origin={vec(19, 22)}
          p1={vec(19, 22)}
          p2={vec(30, 14)}
          strokeWidth={2}
          color={AppColor.WHITE}
        />
      </Canvas>
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

  return (
    <View style={styles.container}>
      <Header header={data?.workout_title} backButton SearchButton={false} />
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
      <BlackCircle />
      <Phase index={1} percent={80} />
      <ProgressButton text='Start Training' />
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
});
