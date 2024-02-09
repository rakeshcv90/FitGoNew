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
import moment from 'moment';
import {DeviceHeigth, DeviceWidth} from './Config';
import {AppColor} from './Color';

const Reminder = ({visible, setVisible, setAlarmIsEnabled}: any) => {
  const typeData = ['AM', 'PM'];
  const hourData = Array(12)
    .fill(0)
    .map((item: any, index, arr) => arr[index] + index + 1);
  const minData = Array(60)
    .fill(0)
    .map((item: any, index, arr) => arr[index] + index);

  const [hours, setHours] = useState('');
  const [min, setMin] = useState('');
  const [type, setType] = useState('AM');

  async function onCreateTriggerNotification() {
    // const date = moment().add(1, 'days');

    // Assuming you have 'hours', 'minutes', and 'type' variables
    let selectedHours = parseInt(hours);
    let selectedMinutes = parseInt(min);

    // If 'type' is 'PM' and the selected hours are less than 12, add 12 hours
    if (type === 'PM' && selectedHours < 12) {
      selectedHours += 12;
    }

    // If 'type' is 'AM' and the selected hours is 12, set hours to 0 (midnight)
    if (type === 'AM' && selectedHours === 12) {
      selectedHours = 0;
    }

    // Set the hours, minutes, and seconds of the date
    // date.set({hours: selectedHours, minutes: selectedMinutes, seconds: 0});

    // Now 'date' holds the updated date and time
    // const tomorrow = moment()
    //   .add(1, 'days')
    //   .set({hours: 12, minutes: 24, seconds: 0});
    // const trigger = {
    //   type: TriggerType.TIMESTAMP,
    //   timestamp: tomorrow.unix(), // fire in 3 hours
    // };
    const date = new Date(Date.now());
    date.setHours(selectedHours);
    date.setMinutes(selectedMinutes);
    // date.setHours(selectedHours+5);
    // date.setMinutes(selectedMinutes+30);

    // Create a time-based trigger
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(), // fire at 11:10am (10 minutes before meeting)
      repeatFrequency: RepeatFrequency.DAILY,
    };
    // Create a trigger notification
    await notifee.createTriggerNotification(
      {
        title: 'Exercise Time',
        body: `It's time to Exercise`,
        android: {
          channelId: 'temporary_channel',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
          actions: [
            {
              title: 'Action 1',
              pressAction: {
                id: 'action_1',
              },
            },
            {
              title: 'Action 2',
              pressAction: {
                id: 'action_2',
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
    setAlarmIsEnabled(true);
    setVisible(false);
  }
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
            <Picker
              style={{flex: 1}}
              selectedValue={hours}
              onValueChange={(itemValue: any, itemIndex) => {
                setHours(itemValue);
              }}>
              {hourData.map((hr: any) => (
                <Picker.Item label={hr} value={hr} color={AppColor.BLACK} />
              ))}
            </Picker>
            <Picker
              style={{flex: 1}}
              selectedValue={min}
              onValueChange={(itemValue: any, itemIndex) => {
                setMin(itemValue);
              }}>
              {minData.map((hr: any) => (
                <Picker.Item label={hr} value={hr} color={AppColor.BLACK} />
              ))}
            </Picker>
            <Picker
              style={{flex: 1}}
              selectedValue={type}
              onValueChange={(itemValue: any, itemIndex) => {
                setType(itemValue);
              }}>
              {typeData.map((hr: any) => (
                <Picker.Item label={hr} value={hr} color={AppColor.BLACK} />
              ))}
            </Picker>
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
                setAlarmIsEnabled(false);
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

const styles = StyleSheet.create({});
