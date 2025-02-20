import React, { useEffect } from 'react'
import { AlarmNotification } from '../Reminder';
import { setIsAlarmEnabled } from '../ThemeRedux/Actions';
import { useDispatch, useSelector } from 'react-redux';
import notifee from '@notifee/react-native';

const setDefaultAlarm = () => {
  const isAlarmEnabled = useSelector((state: any) => state.isAlarmEnabled);
  const dispatch = useDispatch()
    useEffect(() => {
        if (!isAlarmEnabled) {
          notifee.getTriggerNotificationIds().then(res => console.log(res, 'ISDA'));
          const currenTime = new Date();
          currenTime.setHours(7);
          currenTime.setMinutes(0);
          AlarmNotification(currenTime)
            .then(res => console.log('ALARM SET', res))
            .catch(errr => {
              console.log('Alarm error', errr);
              currenTime.setDate(currenTime.getDate() + 1);
              AlarmNotification(currenTime);
            });
          dispatch(setIsAlarmEnabled(true));
        }
      }, [isAlarmEnabled]);
}

export default setDefaultAlarm