import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import BottomSheet from 'react-native-easy-bottomsheet';
import {AppColor} from '../../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message';

const BottomSheetExercise = ({
  isVisible,
  setVisible,
  exerciseData,
  setCurrentData,
  setPlayW,
  setPause,
  setRandomCount,
  playTimerRef,
  currentExercise,
  setSeconds
}: any) => {
  const Box = ({selected, item, index}: any) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={1}
        onPress={() => {
          // setVisible(false);
          // setCurrentData(item);
          if (currentExercise?.exercise_title == item?.exercise_title) {
            showMessage({
              message: 'Current Exercise',
              type: 'info',
              animationDuration: 500,
              floating: true,
              icon: {icon: 'auto', position: 'left'},
            });
          } else {
            setVisible(false);
            setCurrentData(item);
            setSeconds(parseInt(item?.exercise_rest.split(' ')[0]))
            setPlayW(0);
            setPause(false);
            setRandomCount(index);
            clearInterval(playTimerRef.current);
          }
        }}
        style={[
          styles.box,
          {
            backgroundColor: AppColor.WHITE,
            height: DeviceHeigth * 0.1,
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: item?.exercise_image}}
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
              <Text style={[styles.small, {fontSize: 14}]}>
                {item?.exercise_title}
              </Text>
              <Text style={styles.small}>{item?.exercise_rest}</Text>
            </View>
            <Icons
              name={'chevron-right'}
              size={25}
              color={AppColor.INPUTTEXTCOLOR}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <BottomSheet
        bottomSheetTitle={'Next Exercises'}
        bottomSheetIconColor="#000000"
        bottomSheetStyle={{
          backgroundColor: 'white',
          maxHeight: '65%',
          minHeight: '25%',
          marginBottom:Platform.OS=='ios'?-DeviceHeigth*0.05:0
        }}
        bottomSheetTitleStyle={{
          color: '#1E1E1E',
          fontWeight: '500',
          fontFamily: 'Poppins',
          fontSize: 20,
          lineHeight: 30,
        }}
        onBackdropPress={true}
        onRequestClose={() => setVisible(!isVisible)}
        bottomSheetVisible={isVisible}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {exerciseData.map((item: any, index: number) => (
            <Box selected={-1} index={index + 1} item={item} />
          ))}
        </ScrollView>
      </BottomSheet>
    </View>
  );
};

export default BottomSheetExercise;

const styles = StyleSheet.create({
  category: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
    color: AppColor.BoldText,
    lineHeight: 30,
  },
  small: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '500',
    color: AppColor.LITELTEXTCOLOR,
    lineHeight: 30,
  },
  box: {
    // flex: 1,
    width: DeviceWidth * 0.95,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    borderRadius: 15,
    marginLeft: -20,
    // marginVertical: 5,
  },
});
