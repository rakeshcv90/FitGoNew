import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColor, Fonts} from '../../../../Component/Color';
import {DeviceHeigth} from '../../../../Component/Config';
import {setSoundOnOff} from '../../../../Component/ThemeRedux/Actions';
import FitText from '../../../../Component/Utilities/FitText';
import {localImage} from '../../../../Component/Image';
import {useDispatch, useSelector} from 'react-redux';
import {ExerciseData} from './useExerciseHook';
import WorkoutsDescription from '../../WorkoutsDescription';
import FitToggle from '../../../../Component/Utilities/FitToggle';
import BottomSheet from 'react-native-easy-bottomsheet';
import BottomSheetContent from './BottomSheetContent';

type BottomControlsProps = {
  restStart: boolean;
  number: number;
  allExercise: Array<ExerciseData>;
  setRestStart: Function;
  setSeconds: Function;
  setNumber: Function;
  setCurrentSet: Function;
  setProgressPercent: Function;
  isEventPage?: boolean | false;
  setPause: Function;
};

const BottomControls = ({
  number,
  allExercise,
  restStart,
  setRestStart,
  setCurrentSet,
  setNumber,
  setProgressPercent,
  setSeconds,
  isEventPage,
  setPause,
}: BottomControlsProps) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  const getSoundOffOn = useSelector((state: any) => state.getSoundOffOn);
  const getStoreVideoLoc = useSelector((state: any) => state.getStoreVideoLoc);

  useEffect(() => {
    open ? setPause(false) : setPause(true);
  }, [open]);

  return (
    <View>
      {restStart ? (
        <Text
          style={{
            fontSize: 20,
            fontWeight: '600',
            fontFamily: Fonts.HELVETICA_BOLD,
            lineHeight: 25,
            color: '#1F2937',
            textAlign: 'center',
          }}>
          Get Ready
        </Text>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width:
                DeviceHeigth >= 1024
                  ? isEventPage
                    ? '70%'
                    : '50%'
                  : isEventPage
                  ? '90%'
                  : '70%',
            }}>
            <TouchableOpacity
              onPress={() => {
                dispatch(setSoundOnOff(!getSoundOffOn));
              }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 5,
                flexDirection: 'row',
                paddingRight: 5,
              }}>
              <FitToggle value={getSoundOffOn} />
              <FitText
                type="normal"
                value={!getSoundOffOn ? ' Sound Off' : ' Sound On'}
                color="#6B7280"
                fontFamily={Fonts.HELVETICA_REGULAR}
                lineHeight={30}
              />
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: '#6B7280',
                width: 1,
                height: 20,
                opacity: 0.5,
                marginRight: 5,
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setOpen(true);
              }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 5,
                flexDirection: 'row',
              }}>
              <Image
                source={require('../../../../Icon/Images/InAppRewards/Exercise_Info1.png')}
                style={{width: 15, height: 15}}
                resizeMode="contain"
              />
              <FitText
                type="normal"
                value=" Exercise Info"
                color="#6B7280"
                fontFamily={Fonts.HELVETICA_REGULAR}
                lineHeight={30}
              />
            </TouchableOpacity>
          </View>
          {!isEventPage && (
            <TouchableOpacity
              onPress={() => {
                setRestStart(false);
                setOpenSheet(true);
              }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                width: 30,
                height: 30,
                marginVertical: 5,
              }}>
              <Image
                source={localImage.Exercise_List}
                style={{width: 15, height: 15}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      )}

      <BottomSheet
        bottomSheetTitle={'Next Exercises'}
        bottomSheetIconColor="#000000"
        bottomSheetStyle={{
          backgroundColor: 'white',
          maxHeight: '65%',
          minHeight: '25%',
          // marginBottom: Platform.OS == 'ios' ? 0 : 0,
        }}
        bottomSheetTitleStyle={{
          color: '#1E1E1E',
          fontWeight: '500',
          fontFamily: 'Poppins',
          fontSize: 20,
          lineHeight: 30,
          top: -7,
        }}
        onBackdropPress={true}
        onRequestClose={() => setOpenSheet(false)}
        bottomSheetVisible={openSheet}>
        <BottomSheetContent
          allExercise={allExercise}
          getStoreVideoLoc={getStoreVideoLoc}
          setCurrentSet={setCurrentSet}
          setNumber={setNumber}
          setProgressPercent={setProgressPercent}
          setSeconds={setSeconds}
          setOpenSheet={setOpenSheet}
        />
      </BottomSheet>

      <WorkoutsDescription
        open={open}
        setOpen={setOpen}
        data={allExercise[number]}
      />
    </View>
  );
};

export default BottomControls;

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
