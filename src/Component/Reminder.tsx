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

  // async function handleNotificationClick(notification:any) {
  //   // Handle navigation or any other action here
  //   console.log('Notification clicked:', notification);
  // }
  async function onCreateTriggerNotification() {
    let selectedHours = parseInt(hours);
    let selectedMinutes = parseInt(min);

    if (type === 'PM' && selectedHours < 12) {
      selectedHours += 12;
    }

    if (type === 'AM' && selectedHours === 12) {
      selectedHours = 0;
    }

    const currentTime = new Date(Date.now());
    const selectedTime = new Date(Date.now());
    selectedTime.setHours(selectedHours);
    selectedTime.setMinutes(selectedMinutes);

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: selectedTime.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    };

    try {
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
      // if (Platform.OS === 'android') {
      //   // Register click handler
      //   messaging().onNotificationOpenedApp(handleNotificationClick);
      // } else {
       
      //   messaging().setBackgroundMessageHandler(async remoteMessage => {
      //     console.log('Message handled in the background!', remoteMessage);
         
      //     handleNotificationClick(remoteMessage.notification);
      //   });
      // }
    } catch (error) {
      showMessage({
        message: 'Time should be greater than Current Time',
        type: 'success',
        animationDuration: 500,

        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    }
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
