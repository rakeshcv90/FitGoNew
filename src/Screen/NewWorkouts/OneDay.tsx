import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor} from '../../Component/Color';
import {Image} from 'react-native';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

const OneDay = ({navigation, route}: any) => {
  const {data, dayData, day} = route.params;
  const [exerciseData, setExerciseData] = useState([]);
  const [open, setOpen] = useState(false);
  const {allWorkoutData, getUserDataDetails} = useSelector(
    (state: any) => state,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    allWorkoutApi();
    setTimeout(() => {
      setOpen(true);
    }, 1000);
  }, []);

  const allWorkoutApi = async () => {
    try {
      const res = await axios({
        url:
          NewAppapi.Get_DAYS +
          '?day=' +
          day +
          '&workout_id=' +
          data?.workout_id,
      });
      if (res.data) {
        console.log(res.data, 'DaysData');
        setExerciseData(res.data);
      }
    } catch (error) {
      console.error(error, 'DaysAPIERror');
      setExerciseData([]);
    }
  };

  const Box = ({selected, item, index}: any) => {
    console.log(item);
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          navigation.navigate('OneDay', {
            data: data,
            dayData: item,
            day: index,
          });
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
              <Text style={[styles.small, {fontSize: 14}]}>
                {item?.exercise_title}
              </Text>
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
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: AppColor.WHITE,
        // flexDirection: 'row',
      }}>
      <Image
        source={{uri: data?.workout_image_link}}
        style={{
          height: DeviceWidth / 1.5,
          width: DeviceWidth * 0.95,
          marginTop: DeviceHeigth * 0.1,
        }}
        resizeMode="contain"
      />
      <Modal
        visible={open}
        onRequestClose={() => null}
        animationType="slide"
        transparent>
        <View style={{height: DeviceHeigth * 0.4, marginLeft: 5}}>
          <TouchableOpacity
            onPress={() => {
              setOpen(false);
              navigation.goBack();
            }}
            style={{
              marginTop: DeviceHeigth * 0.1,
            }}>
            <Icons
              name={'chevron-left'}
              size={30}
              color={AppColor.INPUTTEXTCOLOR}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 30,
              lineHeight: 40,
              fontFamily: 'Poppins',
            }}>
            Day {day}
          </Text>
          <Text
            style={{
              fontWeight: '400',
              fontSize: 14,
              lineHeight: 30,
              fontFamily: 'Poppins',
              color: AppColor.BoldText,
              marginVertical: 5
            }}>
            <Icons
              name={'clock-outline'}
              size={15}
              color={AppColor.INPUTTEXTCOLOR}
            />
            {` ${dayData?.exercise_rest} Min. `}
            <Icons name={'fire'} size={15} color={AppColor.INPUTTEXTCOLOR} />
            {` ${dayData?.exercise_calories} Kcal`}
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {exerciseData.map((item, index) => (
              <Box selected={-1} index={index + 1} item={item} />
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default OneDay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
    // alignItems: 'center',
    height: DeviceHeigth * 0.6,
    width: DeviceWidth,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    bottom: 0,
    position: 'absolute',
    padding: 20,
    // paddingTop: 50,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 5,
        // shadowRadius: 10,
      },
      android: {
        elevation: 10,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.9,
        // shadowRadius: 10,
      },
    }),
  },
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
