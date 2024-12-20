import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC, useState} from 'react';
import {DeviceWidth} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import FitIcon from '../../Component/Utilities/FitIcon';
import {localImage} from '../../Component/Image';

const adjustArray = [
  {
    image: localImage.Workout,
    text: 'With Equipment',
  },
  {
    image: require('../../Icon/Images/NewHome/WithoutEquipment.png'),
    text: 'Without Equipment',
  },
];

type Props = {
  bottomSheetRef: React.Ref<any>;
  getEquipmentExercise: number;
  filterExercises: (value: number) => void
};

const BottomSheetContent: FC<Props> = ({
  bottomSheetRef,
  getEquipmentExercise,
  filterExercises,
}) => {
  const [adjustSelected, setAdjustSelelcted] = useState(getEquipmentExercise);
  const isFilterChanged = adjustSelected !== getEquipmentExercise; // extra condition for adjust change detection
  return (
    <View style={styles.listContainer}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: DeviceWidth * 0.9,
          alignSelf: 'center',
          alignItems: 'center',
          // top: -10,
        }}>
        <View />
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            lineHeight: 24,
            fontFamily: Fonts.MONTSERRAT_BOLD,
            color: '#1E1E1E',
            marginLeft: DeviceWidth * 0.06,
          }}>
          Adjust
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            AnalyticsConsole('CL_BS_FW');
            // handleFilterVisibilty();
            bottomSheetRef.current?.closeSheet();
          }}>
          <FitIcon
            type="MaterialCommunityIcons"
            name={'close'}
            size={24}
            color={AppColor.BLACK}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: DeviceWidth,
          height: 1,
          backgroundColor: '#1E1E1E',
          opacity: 0.2,
          marginVertical: 16,
          alignSelf: 'center',
        }}
      />
      <View style={{width: DeviceWidth * 0.9, alignSelf: 'center'}}>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,
          }}
          onPress={() => setAdjustSelelcted(prev => (prev == 0 ? 1 : 0))}>
          {adjustArray.map((item, index) => (
            <View
              style={{
                width: DeviceWidth / 2.3,
                backgroundColor: '#F9F9F9',
                borderRadius: 10,
                borderWidth: 1.5,
                borderColor: adjustSelected == index ? AppColor.RED : '#F9F9F9',
              }}>
              <FitIcon
                type="MaterialCommunityIcons"
                style={{position: 'absolute', right: 12, top: 5}}
                name={
                  adjustSelected == index
                    ? 'check-circle'
                    : 'checkbox-blank-circle-outline'
                }
                size={25}
                color={
                  adjustSelected == index
                    ? AppColor.RED
                    : AppColor.SecondaryTextColor
                }
              />
              <Image
                source={item.image}
                style={{
                  width: 35,
                  height: 35,
                  alignSelf: 'center',
                  marginTop: 12,
                }}
                tintColor={
                  adjustSelected == index
                    ? AppColor.RED
                    : AppColor.SecondaryTextColor
                }
              />
              <Text
                style={{
                  textAlign: 'center',
                  color: AppColor.BLACK,
                  fontFamily: Fonts.HELVETICA_BOLD,
                  marginBottom: 12,
                  marginTop: 4,
                }}>
                {item.text}
              </Text>
            </View>
          ))}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 150,
            height: 50,
            backgroundColor: AppColor.RED,
            borderRadius: 6,
            alignSelf: 'flex-end',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: !isFilterChanged ? 0.6 : 1,
          }}
          disabled={!isFilterChanged ? true : false}
          onPress={() => {
            filterExercises(adjustSelected);
          }}>
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: '500',
              lineHeight: 20,

              textAlign: 'center',
              fontFamily: Fonts.MONTSERRAT_MEDIUM,
            }}>
            Show Result
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomSheetContent;

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
  },
});
