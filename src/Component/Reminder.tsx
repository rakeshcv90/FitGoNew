import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import notifee, {AndroidImportance, TriggerType} from '@notifee/react-native';
import moment from 'moment';

const Reminder = () => {
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
    const date = moment().add(1, 'days');

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
    date.set({hours: selectedHours, minutes: selectedMinutes, seconds: 0});

    // Now 'date' holds the updated date and time
    const tomorrow = moment().add(1, 'days').set({ hours: selectedHours, minutes: selectedMinutes, seconds: 0 });
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp:tomorrow.unix(), // fire in 3 hours
    };

    // Create a trigger notification
    await notifee.createTriggerNotification(
      {
        title: 'Exercise Time',
        body: 'Testing Local Notification',
        android: {
          channelId: 'Alarm',
          importance: AndroidImportance.MIN,
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
  }
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Picker
          style={{flex: 1}}
          selectedValue={hours}
          onValueChange={(itemValue: any, itemIndex) => {
            setHours(itemValue);
          }}>
          {hourData.map((hr: any) => (
            <Picker.Item label={hr} value={hr} />
          ))}
        </Picker>
        <Picker
          style={{flex: 1}}
          selectedValue={min}
          onValueChange={(itemValue: any, itemIndex) => {
            setMin(itemValue);
          }}>
          {minData.map((hr: any) => (
            <Picker.Item label={hr} value={hr} />
          ))}
        </Picker>
        <Picker
          style={{flex: 1}}
          selectedValue={type}
          onValueChange={(itemValue: any, itemIndex) => {
            setType(itemValue);
          }}>
          {typeData.map((hr: any) => (
            <Picker.Item label={hr} value={hr} />
          ))}
        </Picker>
      </View>
      <TouchableOpacity onPress={onCreateTriggerNotification}>
        <Text>OK</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Reminder;

const styles = StyleSheet.create({});
