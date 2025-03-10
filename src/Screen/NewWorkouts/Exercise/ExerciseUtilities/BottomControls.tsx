import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColor, Fonts} from '../../../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../../../Component/Config';
import {
  setMusicOnOff,
  setSoundOnOff,
} from '../../../../Component/ThemeRedux/Actions';
import FitText from '../../../../Component/Utilities/FitText';
import {localImage} from '../../../../Component/Image';
import {useDispatch, useSelector} from 'react-redux';
import {ExerciseData} from './useExerciseHook';
import WorkoutsDescription from '../../WorkoutsDescription';
import FitToggle from '../../../../Component/Utilities/FitToggle';
import BottomSheet from 'react-native-easy-bottomsheet';
import BottomSheetContent from './BottomSheetContent';
import FitIcon from '../../../../Component/Utilities/FitIcon';
import NativeAddTest from '../../../../Component/NativeAd';
import {BlurView} from '@react-native-community/blur';
import {ShadowStyle} from '../../../../Component/Utilities/ShadowStyle';

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

const Buttons = [
  {
    id: 1,
    name: 'Voice Assistant',
    image: localImage.NSounds,
  },
  {
    id: 2,
    name: 'Music',
    image: localImage.NMusic,
  },
];

type MusicPopupProps = {
  openMusic: boolean;
  setOpenMusic: Function;
  sound: boolean;
  music: boolean;
  handleButtons: (value: boolean, name?: string) => void | any;
};
const MusicPopup = ({
  openMusic,
  setOpenMusic,
  handleButtons,
  music,
  sound,
}: MusicPopupProps) => {
  return (
    <Modal
      visible={openMusic}
      onRequestClose={() => setOpenMusic(false)}
      animationType="slide">
      <View style={{backgroundColor: `rgba(0,0,0,0)`, flex: 1}}>
        <BlurView
          style={styles.modalContainer1}
          blurType="dark"
          blurAmount={1}
          reducedTransparencyFallbackColor="white"
        />
        <View
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: AppColor.WHITE,
            bottom: 0,
            // height: DeviceHeigth * 0.6,
            padding: 10,
            position: 'absolute',
            width: DeviceWidth,
            ...ShadowStyle,
          }}>
          <View style={[styles.row, {marginVertical: 10}]}>
            <FitText type="Heading" value="Sound Setting" />
            <FitIcon
              onPress={() => setOpenMusic(false)}
              size={30}
              type="MaterialCommunityIcons"
              name="close"
              color="black"
            />
          </View>
          {Buttons.map((v, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                marginVertical: 10,
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={v.image}
                  style={{height: 35, width: 35}}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    fontSize: 16,
                    marginLeft: 10,
                    color: AppColor.BLACK,
                  }}>
                  {v.name}
                </Text>
              </View>
              <View style={{alignSelf: 'center'}}>
                <FitToggle
                  key={v.id}
                  value={v.id == 1 ? sound : music}
                  name={v.name}
                  onChange={() =>
                    v.id == 1
                      ? handleButtons(sound, 'Sound')
                      : handleButtons(music, 'Music')
                  }
                />
              </View>
            </View>
          ))}
          <NativeAddTest media={true} type="video" />
        </View>
      </View>
    </Modal>
  );
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
  const [openMusic, setOpenMusic] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  const getSoundOffOn = useSelector((state: any) => state.getSoundOffOn);
  const getMusicOffOn = useSelector((state: any) => state.getMusicOffOn);
  const getStoreVideoLoc = useSelector((state: any) => state.getStoreVideoLoc);

  useEffect(() => {
    open || openMusic ? setPause(false) : setPause(true);
  }, [open, openMusic]);

  const handleButtons = (value: boolean, name?: string) => {
    name == 'Sound'
      ? dispatch(setSoundOnOff(!value))
      : dispatch(setMusicOnOff(!value));
  };

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
                  ? isEventPage || allExercise.length <= 1
                    ? '70%'
                    : '50%'
                  : isEventPage || allExercise.length <= 1
                  ? '90%'
                  : '70%',
            }}>
            <TouchableOpacity
              onPress={() => setOpenMusic(true)}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 5,
                flexDirection: 'row',
                paddingRight: 5,
              }}>
              <Image
                source={require('../../../../Icon/Images/soundSettings.png')}
                style={{marginRight: 5, width: 15, height: 15}}
              />
              <FitText
                type="normal"
                // value={!getSoundOffOn ? ' Sound Off' : ' Sound On'}
                value="Sound Setting"
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
          {!isEventPage && allExercise.length > 1 && (
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

      <MusicPopup
        handleButtons={handleButtons}
        music={getMusicOffOn}
        openMusic={openMusic}
        setOpenMusic={setOpenMusic}
        sound={getSoundOffOn}
      />
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalContainer1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Semi-transparent background
  },
});
