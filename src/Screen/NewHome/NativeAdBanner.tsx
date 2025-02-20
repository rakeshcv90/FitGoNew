import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {AppColor} from '../../Component/Color';
import PredefinedStyles from '../../Component/Utilities/PredefineStyles';
import FitText from '../../Component/Utilities/FitText';
import {ExerciseCount} from '../../Icon/ExerciseCount';
import {ExerciseKcal} from '../../Icon/ExerciseKcal';
import {ExerciseTime} from '../../Icon/ExerciseTime';
import {ScrollView} from 'react-native';
import {DeviceWidth} from '../../Component/Config';
import NativeAddTest from '../../Component/NativeAddTest';
import {API_CALLS} from '../../API/API_CALLS';
import {useSelector} from 'react-redux';

type Props = {
  loader: boolean;
};

const arr = [
  {
    id: 1,
    val: 'Exercises',
    img: <ExerciseCount size={20} stroke="#007AFF" />,
    color: '#cce4ff',
  },
  {
    id: 2,
    val: 'kcal',
    img: <ExerciseKcal size={20} stroke="#FF9500" />,
    color: '#FFC1071A',
  },
  {
    id: 3,
    val: 'minutes',
    img: <ExerciseTime size={20} stroke="#34C759" />,
    color: '#EAF7ED',
  },
];
const TripView = ({data, val}: {data: (typeof arr)[0]; val: number}) => (
  <View style={{alignItems: 'center'}}>
    <View
      style={[
        styles.imgContainer,
        {
          backgroundColor: data.color,
        },
      ]}>
      {data.img}
    </View>
    <FitText
      type="SubHeading"
      value={val + ''}
      color={AppColor.PrimaryTextColor}
    />
    <FitText
      type="normal"
      value={data.val}
      color={AppColor.SecondaryTextColor}
    />
  </View>
);

const NativeAdBanner = ({loader}: Props) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState({
    total_calories: 0,
    total_exercise_count: 0,
    total_time: 0,
  });
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );

  useEffect(() => {
    API_CALLS.getHomeHistory(getUserDataDetails?.id, setData).then(() =>
      setCurrentIndex(0),
    );
    const timer = setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({x: DeviceWidth, animated: true});
        setCurrentIndex(1);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [loader]);

  return (
    <ImageBackground
      source={require('./BG.png')}
      resizeMode="cover"
      style={{padding: 20}}>
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={event => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / DeviceWidth,
            );
            setCurrentIndex(newIndex);
          }}
          scrollEventThrottle={16}>
          <View style={[styles.page, {width: DeviceWidth, padding: 10}]}>
            <FitText
              type="SubHeading"
              marginHorizontal={10}
              fontWeight="700"
              value="Daily Progress"
            />
            <FitText
              type="normal"
              marginHorizontal={10}
              value="Check your daily progress report"
            />
            <View style={[PredefinedStyles.rowBetween, {width: '90%'}]}>
              {arr.map(item => (
                <TripView
                  key={item.id}
                  data={item}
                  val={
                    item.id == 1
                      ? data?.total_exercise_count
                      : item.id == 2
                      ? data?.total_calories
                      : data?.total_time
                  }
                />
              ))}
            </View>
          </View>
          <View style={[styles.page, {width: DeviceWidth}]}>
            <NativeAddTest media={false} width="53%" type="image" />
          </View>
        </ScrollView>
      </View>
      <View style={[PredefinedStyles.rowCenter, {marginTop: 15}]}>
        {[1, 2].map(i => (
          <View
            style={[
              styles.box,
              {
                backgroundColor:
                  currentIndex == i - 1 ? AppColor.RED : '#D9D9D9',
              },
            ]}
          />
        ))}
      </View>
    </ImageBackground>
  );
};

export default NativeAdBanner;

const styles = StyleSheet.create({
  imgContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
  },
  container: {
    borderRadius: 20,
    backgroundColor: AppColor.WHITE,
    // padding: 10,
    overflow: 'hidden',
  },
  page: {
    justifyContent: 'center',
    // alignItems: 'center',
  },
  box: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginHorizontal: 2,
  },
});
