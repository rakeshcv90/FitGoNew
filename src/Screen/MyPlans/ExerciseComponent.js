import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import NewButton from '../../Component/NewButton';
import {FlatList} from 'react-native';
import WorkoutsDescription from '../NewWorkouts/WorkoutsDescription';
import moment from 'moment';
export const ExerciseComponetWithoutEvents = ({dayObject, day, onPress}) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  return (
    <View style={styles.View1}>
      <View style={[styles.View2,{justifyContent:'flex-start'}]}>
        <Image
          source={{uri: dayObject?.image}}
          style={styles.img}
          resizeMode="contain"
        />
        <View style={styles.View3}>
          <Text style={styles.txt1}>{dayObject?.title ?? 'Power hour'}</Text>
          <Text style={styles.txt2}>{day ?? 'Monday'}</Text>
        </View>
      </View>
      <NewButton title={'Start'} onPress={onPress} />
      <Text
        style={[
          styles.txt3,
          {width: DeviceWidth * 0.9, alignSelf: 'center', marginVertical: 15},
        ]}>
        {dayObject?.exercises?.length
          ? dayObject?.exercises?.length + ' Exercises'
          : '10 Exercises'}
      </Text>
      <FlatList
        data={dayObject?.exercises}
        showsVerticalScrollIndicator={false}
        style={{
          width: DeviceWidth * 0.9,
          alignSelf: 'center',
          marginBottom: DeviceHeigth * 0.4,
        }}
        renderItem={({item, index}) => (
          <View key={index}>
            <TouchableOpacity
              style={[styles.button,{justifyContent:'flex-start'}]}
              onPress={() => {
                setData(item);
                setOpen(true);
              }}>
              <View style={[styles.View4,]}>
                <Image
                  source={{uri: item?.exercise_image_link}}
                  style={{height: 70, width: 70}}
                  resizeMode="contain"
                  defaultSource={localImage.NOWORKOUT}
                />
              </View>
              <View style={{marginLeft: 15}}>
                <Text style={[styles.txt3, {marginVertical: 6}]}>
                  {item?.exercise_title}
                </Text>
                <Text style={styles.txt2}>
                  {'Time - ' + item?.exercise_rest}
                </Text>
              </View>
            </TouchableOpacity>
            {dayObject?.exercises.length - 1 == index ? null : (
              <View style={styles.border} />
            )}
          </View>
        )}
      />
      <WorkoutsDescription data={data} open={open} setOpen={setOpen} />
    </View>
  );
};
export const ExerciseComponentWithEvent = ({
  dayObject,
  day,
  onPress,
  navigation,
}) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  return (
    <View style={styles.View1}>
      <View style={styles.View2}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={{uri: dayObject?.image}}
            style={styles.img}
            resizeMode="contain"
          />
          <View style={styles.View3}>
            <Text style={styles.txt1}>{dayObject?.title ?? 'Power hour'}</Text>
            <Text style={styles.txt2}>{day ?? '--'}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={{}}
          onPress={() =>
            navigation.navigate('AddWorkouts', {
              dayExercises: dayObject?.exercises,
              day: day,
            })
          }>
          {day == moment().format('dddd') ? (
            <Image source={localImage.EditPen} style={styles.edit} />
          ) : null}
        </TouchableOpacity>
      </View>
      {day == moment().format('dddd') ? (
        <NewButton title={'Start'} onPress={onPress} />
      ) : null}
      <Text
        style={[
          styles.txt3,
          {width: DeviceWidth * 0.9, alignSelf: 'center', marginVertical: 15},
        ]}>
        {dayObject?.exercises?.length
          ? dayObject?.exercises?.length + ' Exercises'
          : '10 Exercises'}
      </Text>
      <FlatList
        data={dayObject?.exercises}
        showsVerticalScrollIndicator={false}
        style={{
          width: DeviceWidth * 0.9,
          alignSelf: 'center',
          marginBottom: DeviceHeigth * 0.4,
        }}
        renderItem={({item, index}) => (
          <View key={index}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setData(item);
                setOpen(true);
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.View4}>
                  <Image
                    source={{uri: item?.exercise_image_link}}
                    style={{height: 70, width: 70}}
                    resizeMode="contain"
                    defaultSource={localImage.NOWORKOUT}
                  />
                </View>
                <View style={{marginLeft: 15, width: DeviceWidth * 0.55}}>
                  <Text style={[styles.txt3]}>{item?.exercise_title}</Text>
                  <Text style={styles.txt2}>
                    {'Time - ' + item?.exercise_rest}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            {dayObject?.exercises.length - 1 == index ? null : (
              <View style={styles.border} />
            )}
          </View>
        )}
      />
      <WorkoutsDescription data={data} open={open} setOpen={setOpen} />
    </View>
  );
};
const styles = StyleSheet.create({
  View1: {
    width: DeviceWidth * 0.95,
    alignSelf: 'center',
  },
  View2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: DeviceWidth * 0.9,
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  View3: {
    marginLeft: 10,
  },
  View4: {
    borderWidth: 1,
    borderColor: AppColor.GRAY1,
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  View5: {
    // flexDirection:
  },
  border: {
    height: 0,
    borderWidth: 0.2,
    borderColor: AppColor.GRAY1,
  },
  img: {
    height: 70,
    width: 70,
  },
  edit: {height: 23, width: 23, alignItems: 'flex-end'},
  //txts
  txt1: {
    color: AppColor.BLACK,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 20,
    marginBottom: 4,
  },
  txt2: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: AppColor.BLACK,
    fontSize: 16,
    lineHeight: 30,
  },
  txt3: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    color: AppColor.BLACK,
    fontSize: 18,
    textAlign: 'left',
  },
  //  buttons
  button: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
