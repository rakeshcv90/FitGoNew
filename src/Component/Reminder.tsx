import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import notifee, {
  AndroidImportance,
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

import {DeviceHeigth, DeviceWidth} from './Config';
import {AppColor} from './Color';
import {showMessage} from 'react-native-flash-message';
import messaging from '@react-native-firebase/messaging';
import CustomPicker from './CustomPicker';

export const AlarmNotification = async (time: any) => {
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: time.getTime(), // fire at 11:10am (10 minutes before meeting)
    repeatFrequency: RepeatFrequency.DAILY,
  };
  await notifee.createTriggerNotification(
    {
      title: 'Exercise Time',
      body: `It's time to Exercise`,
      android: {
        channelId: 'Time',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
        actions: [
          {
            title: 'Add +5',
            pressAction: {
              id: 'Plus_Five',
            },
          },
          {
            title: 'Stop',
            pressAction: {
              id: 'Stop',
            },
          },
          // Add more actions as needed
        ],
      },
      ios: {
        categoryId: 'Alarm',
        foregroundPresentationOptions: {
          badge: true,
          banner: true,
          sound: false,
        },
      },
      id: 'Timer',
    },
    trigger,
  );
  console.log(trigger.timestamp);
};
const Reminder = ({
  visible,
  setVisible,
  setAlarmIsEnabled,
  setNotificationTimer,
}: any) => {
  const typeData = ['AM', 'PM'];
  const hourData = Array(12)
    .fill(0)
    .map((item: any, index, arr) => arr[index] + index + 1);
  const minData = Array(60)
    .fill(0)
    .map((item: any, index, arr) => arr[index] + index);

  const [hours, setHours] = useState(1);
  const [min, setMin] = useState(0);
  const [type, setType] = useState('AM');

  async function onCreateTriggerNotification() {
    // const date = moment().add(1, 'days');

    // Assuming you have 'hours', 'minutes', and 'type' variables
    let selectedHours = hours;
    let selectedMinutes = min;

    // If 'type' is 'PM' and the selected hours are less than 12, add 12 hours
    if (type === 'PM' && selectedHours < 12) {
      selectedHours += 12;
    }

    // If 'type' is 'AM' and the selected hours is 12, set hours to 0 (midnight)
    if (type === 'AM' && selectedHours === 12) {
      selectedHours = 0;
    }

    const currentTime = new Date(Date.now());
    const selectedTime = new Date(Date.now());
    selectedTime.setHours(selectedHours);
    selectedTime.setMinutes(selectedMinutes);
    try {
      AlarmNotification(selectedTime);
      setNotificationTimer(selectedTime);
      setAlarmIsEnabled(true);
      setVisible(false);
    } catch (error) {
      showMessage({
        message: 'Time should be greater than Current Time',
        type: 'success',
        animationDuration: 500,

        floating: true,
      });
    }
  }
  const outputRange = [0.8, 1.4, 2.2, 1.4, 0.8];
  return (
    <Modal
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
        setAlarmIsEnabled(false);
      }}
      transparent>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: DeviceWidth * 0.8,
            height: DeviceHeigth * 0.3,
            backgroundColor: AppColor.WHITE,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            ...Platform.select({
              ios: {
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.3,
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
          }}>
          <Text
            style={{
              color: AppColor.LITELTEXTCOLOR,
              fontSize: 16,
              fontWeight: '700',
              fontFamily: 'Poppins',
              lineHeight: 25,
            }}>
            Schedule an Alarm
          </Text>
          <View
            style={{
              flexDirection: 'row',
              height: '70%',
            }}>
            <CustomPicker
              items={hourData}
              onIndexChange={(index: number) => {
                setHours(index);
              }}
              itemHeight={30}
              toggle={''}
              ActiveIndex={hours}
              textStyle={styles.textStyle}
              width={DeviceWidth / 6}
              outputRange={outputRange}
            />
            <CustomPicker
              items={minData}
              onIndexChange={(index: number) => {
                setMin(index);
              }}
              itemHeight={30}
              toggle={''}
              ActiveIndex={min}
              textStyle={styles.textStyle}
              width={DeviceWidth / 6}
              outputRange={outputRange}
            />
            <CustomPicker
              items={typeData}
              onIndexChange={(index: number) => {
                setType(typeData[index]);
              }}
              itemHeight={30}
              toggle={''}
              ActiveIndex={type}
              textStyle={styles.textStyle}
              width={DeviceWidth / 6}
              outputRange={outputRange}
            />
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              width: '90%',
            }}>
            <TouchableOpacity
              onPress={() => {
                setVisible(false);
              }}>
              <Text
                style={{
                  color: '#8B8E96',
                  fontSize: 16,
                  fontWeight: '600',
                  fontFamily: 'Poppins',
                  lineHeight: 25,
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onCreateTriggerNotification}>
              <Text
                style={{
                  color: '#ED4530',
                  fontSize: 16,
                  fontWeight: '600',
                  fontFamily: 'Poppins',
                  lineHeight: 25,
                }}>
                Set
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Reminder;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#ED4530',
  },
});
