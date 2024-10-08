import {FlatList, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {Ref} from 'react';
import {ExerciseData} from './useExerciseHook';
import FitIcon from '../../../../Component/Utilities/FitIcon';
import {AppColor, Fonts} from '../../../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../../../Component/Config';
import {Image} from 'react-native';
import {handleExerciseChange} from './Helpers';

type Props = {
  allExercise: Array<ExerciseData>;
  getStoreVideoLoc: any;
  setSeconds: Function;
  setNumber: Function;
  setCurrentSet: Function;
  setProgressPercent: Function;
  setOpenSheet: Function;
};

const BottomSheetContent = ({
  allExercise,
  getStoreVideoLoc,
  setCurrentSet,
  setNumber,
  setProgressPercent,
  setSeconds,
  setOpenSheet,
}: Props) => {
  return (
    <View
      style={{
        marginBottom: DeviceHeigth * 0.07,
      }}>
      <FlatList
        data={allExercise}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => {
          const time = parseInt(item?.exercise_rest.split(' ')[0]);
          return (
            <>
              <TouchableOpacity
                style={styles.box}
                onPress={() => {
                  setNumber(index);
                  setSeconds(parseInt(item?.exercise_rest.split(' ')[0]));
                  handleExerciseChange(item?.exercise_title, getStoreVideoLoc);
                  setCurrentSet(1);
                  setProgressPercent(0);
                  setOpenSheet(false);
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: 80,
                      width: 80,
                      backgroundColor: AppColor.WHITE,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: '#D9D9D9',
                    }}>
                    <Image
                      source={{
                        uri:
                          getStoreVideoLoc[item?.exercise_title + 'Image'] !=
                          undefined
                            ? 'file://' +
                              getStoreVideoLoc[item?.exercise_title + 'Image']
                            : item.exercise_image?.includes('https')
                            ? item.exercise_image
                            : item.exercise_image_link,
                      }}
                      style={{
                        height: 70,
                        width: 60,
                        // marginLeft: DeviceWidth * 0.12,
                      }}
                      resizeMode="contain"
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginHorizontal: 10,
                    width: '75%',
                  }}>
                  <View>
                    <Text style={[styles.small, {fontSize: 14}]}>
                      {item?.exercise_title}
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.small}>
                        {'Time - ' +
                          '1 x ' +
                          (time > 60
                            ? Math.floor(time / 60) + ' min'
                            : time + ' sec')}{' '}
                        |{' '}
                      </Text>
                      <Text style={styles.small}>
                        {'Set - ' + item?.exercise_sets}
                      </Text>
                    </View>
                  </View>
                  <FitIcon
                    type="MaterialCommunityIcons"
                    name={'chevron-right'}
                    size={25}
                    color={AppColor.INPUTTEXTCOLOR}
                  />
                </View>
              </TouchableOpacity>
              {index !== allExercise.length && (
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    alignItems: 'center',
                    backgroundColor: '#33333314',
                  }}
                />
              )}
            </>
          );
        }}
      />
    </View>
  );
};

export default BottomSheetContent;

const styles = StyleSheet.create({
  small: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '500',
    color: AppColor.LITELTEXTCOLOR,
    lineHeight: 30,
  },
  box: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  closeStyle: {
    right: 8,
    marginTop: 6,
    position: 'absolute',
    zIndex: 1,
  },
});
