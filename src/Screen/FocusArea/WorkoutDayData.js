import {View, Text, StyleSheet, FlatList} from 'react-native';
import React, {useMemo} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';

const WorkoutDayData = ({navigation, route}) => {

    console.log('fddsf',  Object.values(route.params.item?.days));
  const renderItem = useMemo(
    () =>
      ({item}) => {
      
        // let totalTime = 0;
        // let totalExercise = 0;

        // for (const day in item?.days) {
        //   totalTime = totalTime + parseInt(item?.days[day]?.total_rest);
        //   totalExercise++;
        // }

        return (
          <>
            {/* <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate('WorkoutDayData',{item:item})
                  }}
                  style={{
                    width: '95%',
                    borderRadius: 10,
                    backgroundColor: '#FDFDFD',
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
                        shadowColor: '#000000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                      },
                      android: {
                        elevation: 4,
                      },
                    }),
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
    
                  <View>
                    {getProgress(item)}
                 
                  </View>
                </TouchableOpacity> */}
          </>
        );
      },
    [],
  );
  return (
    <>
      <NewHeader
        header={route?.params?.item?.workout_title}
        SearchButton={false}
        backButton={true}
      />
      <View style={styles.container}>
        <View style={[styles.meditionBox, {top: -20}]}>
          <FlatList
        //   Object.values(data?.days)
            data={ Object.values(route.params.item?.days)}
            //ListEmptyComponent={emptyComponent}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
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
export default WorkoutDayData;
