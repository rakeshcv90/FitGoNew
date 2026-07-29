import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import notifee, {
  AndroidImportance,
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import LinearGradient from 'react-native-linear-gradient';
import {BlurView} from '@react-native-community/blur';
import {showMessage} from 'react-native-flash-message';
import {DeviceWidth} from './Config';
import {Fonts} from './Color';
import FitIcon from './Utilities/FitIcon';

export const AlarmNotification = async (time: any) => {
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: time.getTime(),
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
      },
      ios: {
        categoryId: 'Alarm',
        sound: 'fitme_notification.wav',
        foregroundPresentationOptions: {
          badge: true,
          banner: true,
          sound: true,
        },
      },
      id: 'Timer',
    },
    trigger,
  );
};

const Reminder = ({
  visible,
  setVisible,
  setAlarmIsEnabled,
  setNotificationTimer,
}: any) => {
  const [selectedHourNum, setSelectedHourNum] = useState<number>(7);
  const [selectedMinNum, setSelectedMinNum] = useState<number>(0);
  const [type, setType] = useState<'AM' | 'PM'>('AM');

  const incrementHour = () => {
    setSelectedHourNum(prev => (prev >= 12 ? 1 : prev + 1));
  };

  const decrementHour = () => {
    setSelectedHourNum(prev => (prev <= 1 ? 12 : prev - 1));
  };

  const incrementMin = () => {
    setSelectedMinNum(prev => (prev >= 55 ? 0 : prev + 5));
  };

  const decrementMin = () => {
    setSelectedMinNum(prev => (prev <= 0 ? 55 : prev - 5));
  };

  async function onCreateTriggerNotification() {
    let selectedHours = selectedHourNum;
    let selectedMinutes = selectedMinNum;

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
    selectedTime.setSeconds(0);

    const minimumTime = new Date(currentTime.getTime() + 5 * 60 * 1000);
    const minimumSelectedTime = new Date(selectedTime.getTime());

    if (minimumSelectedTime <= minimumTime) {
      showMessage({
        message:
          'Reminder time should be at least 5 minutes ahead of current time.',
        type: 'info',
        animationDuration: 500,
        duration: 3000,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
      setVisible(false);
    } else {
      try {
        await AlarmNotification(selectedTime);
        setNotificationTimer(selectedTime);
        setAlarmIsEnabled(true);
        setVisible(false);
        showMessage({
          message: `Daily reminder set for ${selectedHourNum}:${selectedMinNum
            .toString()
            .padStart(2, '0')} ${type}`,
          type: 'success',
          animationDuration: 500,
          duration: 2500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } catch (error) {
        showMessage({
          message: 'Time should be greater than Current Time',
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        setVisible(false);
      }
    }
  }

  const formattedDisplayHour = selectedHourNum.toString().padStart(2, '0');
  const formattedDisplayMin = selectedMinNum.toString().padStart(2, '0');

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={() => {
        setVisible(false);
      }}
      transparent>
      <View style={styles.modalBackdrop}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={4}
          reducedTransparencyFallbackColor="black"
        />

        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        />

        <View style={styles.modalCard}>
          {/* Top Handle Bar */}
          <View style={styles.handleBar} />

          {/* Header Row */}
          <View style={styles.headerRow}>
            <LinearGradient
              colors={['#FF9500', '#FF5E00']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.bellIconBox}>
              <FitIcon
                name="notifications"
                type="Ionicons"
                size={22}
                color="#FFFFFF"
              />
            </LinearGradient>
            <View style={{flex: 1, marginLeft: 12}}>
              <Text style={styles.titleText}>Daily Reminder</Text>
              <Text style={styles.subtitleText}>
                Set your daily workout alarm
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={styles.closeBtn}
              activeOpacity={0.7}>
              <FitIcon
                name="close"
                type="Ionicons"
                size={18}
                color="#64748B"
              />
            </TouchableOpacity>
          </View>

          {/* Clock Display Box */}
          <View style={styles.clockDisplayBox}>
            <LinearGradient
              colors={['#FFF7ED', '#FFEDD5']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.clockDigit}>{formattedDisplayHour}</Text>
            <Text style={styles.clockColon}>:</Text>
            <Text style={styles.clockDigit}>{formattedDisplayMin}</Text>
            <View style={styles.clockTypeBadge}>
              <Text style={styles.clockTypeText}>{type}</Text>
            </View>
          </View>

          {/* Custom Time Selector Controls */}
          <View style={styles.selectorCard}>
            {/* Hours & Minutes Steppers Row */}
            <View style={styles.steppersRow}>
              {/* Hour Control */}
              <View style={styles.stepperCol}>
                <Text style={styles.stepperLabel}>HOUR</Text>
                <View style={styles.stepperBox}>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    activeOpacity={0.7}
                    onPress={decrementHour}>
                    <FitIcon name="remove" type="Ionicons" size={20} color="#EA580C" />
                  </TouchableOpacity>
                  <Text style={styles.stepValueText}>{formattedDisplayHour}</Text>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    activeOpacity={0.7}
                    onPress={incrementHour}>
                    <FitIcon name="add" type="Ionicons" size={20} color="#EA580C" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.stepperColon}>:</Text>

              {/* Minute Control */}
              <View style={styles.stepperCol}>
                <Text style={styles.stepperLabel}>MINUTE</Text>
                <View style={styles.stepperBox}>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    activeOpacity={0.7}
                    onPress={decrementMin}>
                    <FitIcon name="remove" type="Ionicons" size={20} color="#EA580C" />
                  </TouchableOpacity>
                  <Text style={styles.stepValueText}>{formattedDisplayMin}</Text>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    activeOpacity={0.7}
                    onPress={incrementMin}>
                    <FitIcon name="add" type="Ionicons" size={20} color="#EA580C" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* AM / PM Segmented Switch */}
            <View style={styles.periodSegmentRow}>
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => setType('AM')}
                style={styles.periodSegmentBtn}>
                {type === 'AM' ? (
                  <LinearGradient
                    colors={['#FF9500', '#FF5E00']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={StyleSheet.absoluteFill}
                  />
                ) : null}
                <Text
                  style={[
                    styles.periodSegmentText,
                    type === 'AM' && styles.periodSegmentTextActive,
                  ]}>
                  AM (Morning)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => setType('PM')}
                style={styles.periodSegmentBtn}>
                {type === 'PM' ? (
                  <LinearGradient
                    colors={['#FF9500', '#FF5E00']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={StyleSheet.absoluteFill}
                  />
                ) : null}
                <Text
                  style={[
                    styles.periodSegmentText,
                    type === 'PM' && styles.periodSegmentTextActive,
                  ]}>
                  PM (Evening)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Quick Minute Presets Row */}
            <View style={styles.quickPresetsRow}>
              {[0, 15, 30, 45].map(m => {
                const isActive = selectedMinNum === m;
                return (
                  <TouchableOpacity
                    key={m}
                    activeOpacity={0.8}
                    onPress={() => setSelectedMinNum(m)}
                    style={[
                      styles.presetChip,
                      isActive && styles.presetChipActive,
                    ]}>
                    <Text
                      style={[
                        styles.presetChipText,
                        isActive && styles.presetChipTextActive,
                      ]}>
                      :{m.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Action Buttons Row */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              activeOpacity={0.7}
              onPress={() => setVisible(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtnWrapper}
              activeOpacity={0.88}
              onPress={onCreateTriggerNotification}>
              <LinearGradient
                colors={['#FF9500', '#FF5E00']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.saveBtn}>
                <FitIcon
                  name="alarm"
                  type="Ionicons"
                  size={18}
                  color="#FFFFFF"
                />
                <Text style={styles.saveBtnText}>Set Reminder</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Reminder;

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: DeviceWidth * 0.9,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.18,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 14,
  },
  bellIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#FF5E00',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  titleText: {
    fontSize: 18,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitleText: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Clock Display Box
  clockDisplayBox: {
    width: '100%',
    height: 68,
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FED7AA',
    marginBottom: 14,
    gap: 4,
  },
  clockDigit: {
    fontSize: 34,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 1,
  },
  clockColon: {
    fontSize: 30,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#EA580C',
    marginHorizontal: 2,
    bottom: 2,
  },
  clockTypeBadge: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 10,
  },
  clockTypeText: {
    fontSize: 13,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Custom Time Selector Controls Card
  selectorCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
    gap: 12,
  },
  steppersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperCol: {
    flex: 1,
    alignItems: 'center',
  },
  stepperLabel: {
    fontSize: 10,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 6,
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%',
    justifyContent: 'space-between',
  },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepValueText: {
    fontSize: 18,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#0F172A',
  },
  stepperColon: {
    fontSize: 22,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#94A3B8',
    marginHorizontal: 8,
    top: 10,
  },

  // AM / PM Segmented Switch
  periodSegmentRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 3,
    gap: 4,
  },
  periodSegmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  periodSegmentText: {
    fontSize: 13,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#64748B',
  },
  periodSegmentTextActive: {
    color: '#FFFFFF',
  },

  // Quick Presets Row
  quickPresetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  presetChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetChipActive: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C',
  },
  presetChipText: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#64748B',
  },
  presetChipTextActive: {
    color: '#FFFFFF',
  },

  // Button Row
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelBtnText: {
    color: '#64748B',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 14,
    fontWeight: '700',
  },
  saveBtnWrapper: {
    flex: 1.5,
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
    borderRadius: 16,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 14,
    fontWeight: '800',
  },
});
