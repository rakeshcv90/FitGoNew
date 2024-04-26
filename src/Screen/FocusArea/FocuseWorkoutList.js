import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {StyleSheet} from 'react-native';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import AnimatedLottieView from 'lottie-react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import {localImage} from '../../Component/Image';

const FocuseWorkoutList = ({navigation, route}) => {
  const [data, setData] = useState([]);
  const getCustttomeTimeCal = useSelector(state => state.getCustttomeTimeCal);
  console.log('userId-->', getCustttomeTimeCal.length);
  useEffect(() => {
    setData(route?.params?.bodyexercise);
  }, [route?.params]);

  const renderItem = useMemo(
    () =>
      ({item}) => {
        let totalTime = 0;
        let totalExercise = 0;

        for (const day in item?.days) {
          totalTime = totalTime + parseInt(item?.days[day]?.total_rest);
          totalExercise++;
        }

        return (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('WorkoutDays', {
                  data: item,
                  challenge: false,
                });
              }}
              style={{
                width: '95%',
                borderRadius: 10,
                backgroundColor: AppColor.WHITE,
                marginVertical: 8,
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                padding: 5,
                borderColor: '#D9D9D9',
                borderWidth: 1,

                shadowColor: 'rgba(0, 0, 0, 1)',
                ...Platform.select({
                  ios: {
                    //shadowColor: '#000000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                  },
                  android: {
                    elevation: 3,
                  },
                }),
                // shadowColor: 'rgba(0, 0, 0, 1)',
                // ...Platform.select({
                //   ios: {
                //     shadowColor: '#000000',
                //     shadowOffset: {width: 0, height: 2},
                //     shadowOpacity: 0.1,
                //     shadowRadius: 4,
                //   },
                //   android: {
                //     elevation: 4,
                //   },
                // }),
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={{uri: item.workout_image_link}}
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
                <View style={{marginHorizontal: 25, top: 10}}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: '600',
                      color: '#202020',
                      lineHeight: 25,
                      fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    }}>
                    {item?.workout_title}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginVertical: 5,
                      alignItems: 'center',
                    }}>
                    <Icons name="timer-outline" size={18} color={'#000'} />

                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '500',
                        color: '#505050',
                        lineHeight: 15,
                        fontFamily: Fonts.MONTSERRAT_MEDIUM,
                      }}>
                      {' '}
                      {totalTime > 60
                        ? `${(totalTime / 60).toFixed(0)} Min`
                        : `${totalTime} sec`}{' '}
                    </Text>
                    <Text>{'  '}</Text>
                    <Icons name="calendar-today" size={18} color={'#000'} />
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '500',
                        color: '#505050',
                        lineHeight: 15,
                        fontFamily: Fonts.MONTSERRAT_MEDIUM,
                      }}>
                      {'  '}
                      {item?.workout_duration}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      top: -8,
                      alignItems: 'center',
                    }}>
                    <AnimatedLottieView
                      source={require('../../Icon/Images/NewImage/Eye.json')}
                      speed={0.5}
                      autoPlay
                      onPress={() => {
                        console.log('zXCzcxzcxz');
                      }}
                      style={{width: 22, height: 22}}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: '#202020',
                        lineHeight: 15,
                        fontFamily: Fonts.MONTSERRAT_MEDIUM,
                      }}>
                      {' '}
                      {item?.total_workout_views}
                    </Text>
                    <Text>{'      '}</Text>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        left: -10,
                      }}>
                      <AnimatedLottieView
                        source={require('../../Icon/Images/NewImage/Heart.json')}
                        speed={0.5}
                        autoPlay
                        // resizeMode='cover'
                        style={{width: 40, height: 40}}
                      />
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '600',
                          color: '#202020',
                          lineHeight: 15,
                          fontFamily: Fonts.MONTSERRAT_MEDIUM,
                        }}>
                        {' '}
                        {item?.total_workout_like}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View>{getProgress(item, totalTime)}</View>
            </TouchableOpacity>
          </>
        );
      },
    [],
  );

  const getProgress = useMemo(() => (item, totalTime) => {
    let resulttime = 0;
    if (getCustttomeTimeCal?.length > 0) {
      let time = getCustttomeTimeCal.filter(item1 => {
        return item1.workout_id == item.workout_id;
      });

      let remainingTime = time[0].totalRestTime;
      resulttime = ((remainingTime / totalTime) * 100).toFixed(0);
    } else {
      resulttime = 0;
    }

    return (
      <View>
        {resulttime == 100 ? (
          <AnimatedLottieView
            source={require('../../Icon/Images/NewImage/compleate.json')}
            speed={0.5}
            autoPlay
            resizeMode="cover"
            style={{width: 50, height: 60, right: -10}}
          />
        ) : resulttime == 0 ? (
          <Image
            source={localImage.Next}
            resizeMode="contain"
            style={{width: 40, height: 40}}
          />
        ) : (
          <CircularProgress
            value={resulttime}
            radius={20}
            progressValueColor={'rgb(197, 23, 20)'}
            inActiveStrokeColor={'#A9A9A9'}
            activeStrokeColor={'rgb(219, 92, 0)'}
            maxValue={100}
            valueSuffix={'%'}
            //titleColor={'black'}
            titleStyle={{
              textAlign: 'center',
              fontSize: 15,
              fontWeight: '500',
              lineHeight: 15,
              fontFamily: 'Poppins',
              color: 'rgb(0, 0, 0)',
            }}
          />
        )}
      </View>
    );
  });
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
            height: DeviceHeigth * 0.6,
          }}
        />
      </View>
    );
  };
  return (
    <>
      <NewHeader
        header={
          route?.params?.item?.bodypart_title == undefined
            ? route?.params?.item?.title
            : route?.params?.item?.bodypart_title
        }
        SearchButton={false}
        backButton={true}
      />
      <View style={styles.container}>
        <View style={[styles.meditionBox, {top: -20}]}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            ListEmptyComponent={emptyComponent}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={true}
          />
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },

  meditionBox: {
    backgroundColor: 'white',
  },
});
export default FocuseWorkoutList;
