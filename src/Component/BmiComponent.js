import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {AppColor, Fonts} from './Color';
import {DeviceWidth, DeviceHeigth} from './Config';
import {TextInput} from 'react-native-paper';
import {useMemo, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AnalyticsConsole} from './AnalyticsConsole';
import {setBmi} from './ThemeRedux/Actions';
import {showMessage} from 'react-native-flash-message';
import {translate} from '../Screen/Translation/TranslationService';
export const BmiMeter = ({getBmi}) => {
  const numericBmi = parseFloat(getBmi || '0');
  const [containerWidth, setContainerWidth] = useState(0);

  // Map BMI 14 to 36 onto 0% to 100% position
  const positionPercent = useMemo(() => {
    if (!numericBmi || isNaN(numericBmi)) return 50;
    const minBmi = 14;
    const maxBmi = 36;
    const clamped = Math.min(Math.max(numericBmi, minBmi), maxBmi);
    return ((clamped - minBmi) / (maxBmi - minBmi)) * 100;
  }, [numericBmi]);

  const categoryColor = useMemo(() => {
    if (numericBmi <= 0) return '#64748B';
    if (numericBmi < 18.5) return '#3B82F6';
    if (numericBmi < 25) return '#10B981';
    if (numericBmi < 30) return '#F59E0B';
    return '#EF4444';
  }, [numericBmi]);

  const categoryText = useMemo(() => {
    if (numericBmi <= 0) return translate('noData');
    if (numericBmi < 18.5) return translate('underWeight');
    if (numericBmi < 25) return translate('normal');
    return translate('overWeight');
  }, [numericBmi]);

  const meterWidth = containerWidth > 0 ? containerWidth : DeviceWidth * 0.8;
  const pointerLeft = (meterWidth * positionPercent) / 100;

  // Clamp tooltip left position so badge never overflows card bounds
  const badgeWidthEstimate = 125;
  const clampedBadgeLeft = Math.max(
    0,
    Math.min(pointerLeft - badgeWidthEstimate / 2, meterWidth - badgeWidthEstimate),
  );

  return (
    <View
      style={styles.meterContainer}
      onLayout={e => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) setContainerWidth(w);
      }}>
      {/* Floating Pointer & Tooltip Container */}
      <View style={styles.tooltipContainerRow}>
        <View
          style={[
            styles.tooltipWrapper,
            {
              left: clampedBadgeLeft,
            },
          ]}>
          <View style={[styles.tooltipBadge, {backgroundColor: categoryColor}]}>
            <Text numberOfLines={1} style={styles.tooltipText}>
              {numericBmi > 0 ? numericBmi.toFixed(1) : '--'} • {categoryText}
            </Text>
          </View>
        </View>

        {/* Down Arrow sitting exactly above the pointer line */}
        <View
          style={[
            styles.tooltipArrow,
            {
              left: Math.max(4, Math.min(pointerLeft - 5, meterWidth - 10)),
              borderTopColor: categoryColor,
            },
          ]}
        />
      </View>

      {/* Multi-Color Gradient Meter Bar */}
      <View style={styles.gradientBarWrapper}>
        <LinearGradient
          colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.gradientBar}
        />
        {/* Pointer Line Indicator */}
        <View
          style={[
            styles.pointerLine,
            {
              left: Math.max(4, Math.min(pointerLeft - 1.5, meterWidth - 4)),
              backgroundColor: '#FFFFFF',
            },
          ]}
        />
      </View>

      {/* Gauge Scale Labels */}
      <View style={styles.scaleLabelsRow}>
        <View style={styles.scaleTickItem}>
          <View style={[styles.scaleDot, {backgroundColor: '#3B82F6'}]} />
          <Text style={styles.scaleText}>18.5</Text>
        </View>
        <View style={styles.scaleTickItem}>
          <View style={[styles.scaleDot, {backgroundColor: '#10B981'}]} />
          <Text style={styles.scaleText}>25.0</Text>
        </View>
        <View style={styles.scaleTickItem}>
          <View style={[styles.scaleDot, {backgroundColor: '#F59E0B'}]} />
          <Text style={styles.scaleText}>30.0</Text>
        </View>
      </View>
    </View>
  );
};
// for modal content
const WeightHeight = ({
  arr,
  heading,
  value,
  setValue,
  setHeightType,
  setWeightType,
  heightInch,
  setHeightInch,
}) => {
  const [selectedItem, setSelectedItem] = useState(0);
  return (
    <View style={{marginTop: 14}}>
      <Text style={styles.inputHeadingText}>{heading}</Text>
      <View style={styles.inputRowContainer}>
        {heading == translate('height') && selectedItem == 0 ? (
          <View style={{flexDirection: 'row', gap: 8}}>
            <TextInput
              style={{width: DeviceWidth * 0.22, backgroundColor: '#FFFFFF'}}
              underlineColor="transparent"
              placeholder="ft"
              placeholderTextColor="#94A3B8"
              mode="outlined"
              keyboardType="decimal-pad"
              activeUnderlineColor="transparent"
              maxLength={1}
              theme={{roundness: 12}}
              outlineColor="#E2E8F0"
              activeOutlineColor="#667EEA"
              value={value}
              onChangeText={txt => {
                if (txt < 4 && txt != '') {
                  setValue('');
                  showMessage({
                    message: translate('heightTooLow'),
                    type: 'info',
                    animationDuration: 500,
                    floating: true,
                    icon: {icon: 'auto', position: 'left'},
                  });
                } else {
                  setValue(txt);
                }
              }}
            />
            <TextInput
              style={{width: DeviceWidth * 0.22, backgroundColor: '#FFFFFF'}}
              underlineColor="transparent"
              mode="outlined"
              keyboardType="decimal-pad"
              activeUnderlineColor="transparent"
              placeholder="in"
              placeholderTextColor="#94A3B8"
              maxLength={2}
              theme={{roundness: 12}}
              outlineColor="#E2E8F0"
              activeOutlineColor="#667EEA"
              value={heightInch}
              onChangeText={txt => {
                if (txt > 12) {
                  setHeightInch('');
                  showMessage({
                    message: translate('inchLimit'),
                    type: 'info',
                    animationDuration: 500,
                    floating: true,
                    icon: {icon: 'auto', position: 'left'},
                  });
                } else {
                  setHeightInch(txt);
                }
              }}
            />
          </View>
        ) : (
          <TextInput
            style={{width: DeviceWidth * 0.46, backgroundColor: '#FFFFFF'}}
            underlineColor="transparent"
            mode="outlined"
            keyboardType="decimal-pad"
            placeholder={
              heading == translate('weight') && selectedItem == 0
                ? translate('kg')
                : heading == translate('weight') && selectedItem == 1
                ? translate('lbs')
                : translate('cm')
            }
            placeholderTextColor="#94A3B8"
            activeUnderlineColor="transparent"
            maxLength={3}
            theme={{roundness: 12}}
            outlineColor="#E2E8F0"
            activeOutlineColor="#667EEA"
            value={value}
            onChangeText={txt => {
              setValue(txt);
            }}
          />
        )}

        {/* Unit Selector Pills */}
        <View style={styles.unitSelectorGroup}>
          {arr.map((v, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.88}
              onPress={() => {
                setSelectedItem(i);
                if (heading == translate('weight')) {
                  setWeightType(i == 0 ? translate('kg') : translate('lbs'));
                } else {
                  setHeightType(i == 0 ? translate('ft') : translate('cm'));
                }
              }}>
              {selectedItem === i ? (
                <LinearGradient
                  colors={['#667EEA', '#764BA2']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.unitPillSelected}>
                  <Text style={styles.unitPillTextSelected}>{v}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.unitPillInactive}>
                  <Text style={styles.unitPillTextInactive}>{v}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

// Modern BMI Modal
export const BMImodal = ({setModalVisible, modalVisible, dispatch}) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [heightInch, setHeightInch] = useState('');
  const [heightType, setHeightType] = useState('ft');
  const [weightType, setWeightType] = useState('kg');
  let newHeight = height + '.' + heightInch;

  const HandleSubmitBMI = () => {
    if (
      weight === '' ||
      newHeight === '' ||
      height === '' ||
      isNaN(weight) ||
      isNaN(height) ||
      weight < 10 ||
      weight > 300
    ) {
      Alert.alert(translate('pleaseEnterValid'), '', [
        {
          text: 'Ok',
          onPress: () => {},
        },
      ]);
    } else {
      AnalyticsConsole(`Submit_BMI_BUTTON`);
      const BMI =
        (weightType == translate('kg') ? weight : weight / 2.2) /
        (heightType == translate('ft') ? newHeight * 0.3048 : height / 100) **
          2;
      dispatch(
        setBmi({
          Bmi: BMI.toFixed(2),
          userHeight:
            heightType == translate('ft')
              ? newHeight + heightType
              : height + heightType,
          userWeight: weight + weightType,
        }),
      );
      setModalVisible(false);
      setHeight('');
      setWeight('');
      setHeightType('ft');
      setWeightType('kg');
      setHeightInch('');
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContentCard}>
          {/* Header */}
          <View style={styles.modalHeaderRow}>
            <View style={styles.modalHeaderTitleGroup}>
              <View style={styles.modalHeaderIconBadge}>
                <Icon name="scale-bathroom" size={20} color="#667EEA" />
              </View>
              <View>
                <Text style={styles.modalTitleText}>BMI Calculator</Text>
                <Text style={styles.modalSubText}>
                  Update weight & height to calculate
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseCircle}>
              <Icon name="close" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalDivider} />

          {/* Form Fields */}
          <WeightHeight
            arr={[translate('kg'), translate('lbs')]}
            heading={translate('weight')}
            value={weight}
            setValue={setWeight}
            setWeightType={setWeightType}
          />
          <WeightHeight
            arr={[translate('ft'), translate('cm')]}
            heading={translate('height')}
            value={height}
            setValue={setHeight}
            setHeightInch={setHeightInch}
            heightInch={heightInch}
            setHeightType={setHeightType}
          />

          <View style={styles.modalDivider} />

          {/* Action Submit Button */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => HandleSubmitBMI()}
            style={styles.submitBmiBtnWrapper}>
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.submitBmiBtn}>
              <Text style={styles.submitBmiBtnText}>
                {translate('calculate')} BMI
              </Text>
              <Icon name="arrow-right" size={18} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
// Calories and action report
export const CaloriesActionReport = ({arr}) => {
  return (
    <View style={{backgroundColor: AppColor.LIGHTGREY2, borderRadius: 8}}>
      {arr.map((v, i) => (
        <View key={i}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: 10,
              paddingVertical: 4,
            }}>
            <View style={styles.View5}>
              <Image
                source={v?.img}
                style={{height: 30, width: 30}}
                resizeMode="contain"
              />
              <Text style={[styles.txt2, {marginLeft: 8}]}>{v.txt}</Text>
            </View>
            <Text style={[styles.txt1, {color: AppColor.RED}]}>{v.value}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  meterContainer: {
    width: '100%',
    paddingVertical: 10,
  },
  tooltipContainerRow: {
    width: '100%',
    height: 32,
    position: 'relative',
    marginBottom: 4,
  },
  tooltipWrapper: {
    position: 'absolute',
    top: 0,
  },
  tooltipBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  tooltipText: {
    fontSize: 11,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },

  gradientBarWrapper: {
    width: '100%',
    height: 14,
    borderRadius: 7,
    position: 'relative',
    overflow: 'hidden',
  },
  gradientBar: {
    width: '100%',
    height: '100%',
    borderRadius: 7,
  },
  pointerLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3,
    borderRadius: 1.5,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 2,
  },

  scaleLabelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  scaleTickItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scaleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  scaleText: {
    fontSize: 10.5,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    fontWeight: '600',
  },

  View1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  View2: {},
  View5: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txt1: {
    fontSize: 18,
    color: AppColor.BLACK,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontWeight: '600',
  },
  txt2: {
    color: AppColor.BLACK,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 18,
    marginVertical: 15,
  },
  txt3: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 17,
  },
  View3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button1: {
    borderRadius: 6,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    height: DeviceHeigth * 0.07,
    width: DeviceWidth * 0.15,
  },
  button2: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f0013b',
    borderRadius: 6,
  },
  modalContent: {
    padding: 20,
    borderRadius: 8,
    width: DeviceWidth * 0.95,
    position: 'absolute',
    top: DeviceHeigth / 6,
    marginHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowOffset: {height: 5, width: 0},
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  modalContentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: DeviceWidth * 0.9,
    maxWidth: 400,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalHeaderTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalHeaderIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitleText: {
    fontSize: 16.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubText: {
    fontSize: 11,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    marginTop: 1,
  },
  modalCloseCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },

  inputHeadingText: {
    fontSize: 13,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#0F172A',
    fontWeight: '700',
    marginBottom: 6,
  },
  inputRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  unitSelectorGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  unitPillSelected: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitPillTextSelected: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  unitPillInactive: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitPillTextInactive: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    fontWeight: '600',
  },

  submitBmiBtnWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  submitBmiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    borderRadius: 14,
  },
  submitBmiBtnText: {
    fontSize: 14.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
