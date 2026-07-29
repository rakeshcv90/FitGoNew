import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { AppColor, Fonts } from '../../../../Component/Color';
import { DeviceHeigth, DeviceWidth } from '../../../../Component/Config';
import {
  setMusicOnOff,
  setSoundOnOff,
} from '../../../../Component/ThemeRedux/Actions';
import FitText from '../../../../Component/Utilities/FitText';
import { localImage } from '../../../../Component/Image';
import { useDispatch, useSelector } from 'react-redux';
import { ExerciseData } from './useExerciseHook';
import WorkoutsDescription from '../../WorkoutsDescription';
import FitToggle from '../../../../Component/Utilities/FitToggle';
import BottomSheet from 'react-native-easy-bottomsheet';
import BottomSheetContent from './BottomSheetContent';
import FitIcon from '../../../../Component/Utilities/FitIcon';
// import NativeAddTest from '../../../../Component/NativeAd';
import { BlurView } from '@react-native-community/blur';
import { ShadowStyle } from '../../../../Component/Utilities/ShadowStyle';
import { translate } from '../../../Translation/TranslationService';

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
    name: translate('voiceAssistant'),
    image: localImage.NSounds,
  },
  {
    id: 2,
    name: translate('music'),
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
      <View style={{ backgroundColor: `rgba(0,0,0,0)`, flex: 1 }}>
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
          <View style={[styles.row, { marginVertical: 10 }]}>
            <FitText type="Heading" value={translate('soundSetting')} />
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={v.image}
                  style={{ height: 35, width: 35 }}
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
              <View style={{ alignSelf: 'center' }}>
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
          {/* <NativeAddTest media={true} type="video" /> */}
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
            fontSize: 18,
            fontWeight: '700',
            fontFamily: Fonts.MONTSERRAT_BOLD,
            color: '#E11D48',
            textAlign: 'center',
            marginTop: 4,
            marginBottom: 8,
          }}>
          {translate('getReady')}
        </Text>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingHorizontal: 20,
            marginTop: 12,
            marginBottom: 4,
            gap: 32,
          }}>
          {/* Sound Button - Stacked */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setOpenMusic(true)}
            style={{
              alignItems: 'center',
              gap: 4,
            }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#FFFFFF',
                borderWidth: 1.5,
                borderColor: '#F3F4F6',
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.04,
                shadowRadius: 4,
              }}>
              <FitIcon
                name="volume-high"
                type="MaterialCommunityIcons"
                size={20}
                color="#E11D48"
              />
            </View>
            <Text
              style={{
                color: '#374151',
                fontSize: 11,
                fontWeight: '700',
                fontFamily: Fonts.MONTSERRAT_BOLD,
              }}>
              Sound
            </Text>
            <Text
              style={{
                color: '#10B981',
                fontSize: 10,
                fontWeight: '600',
                fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
              }}>
              On
            </Text>
          </TouchableOpacity>

          {/* Exercise Info Button - Stacked */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setOpen(true);
            }}
            style={{
              alignItems: 'center',
              gap: 4,
            }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#FFFFFF',
                borderWidth: 1.5,
                borderColor: '#F3F4F6',
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.04,
                shadowRadius: 4,
              }}>
              <FitIcon
                name="information-outline"
                type="MaterialCommunityIcons"
                size={20}
                color="#E11D48"
              />
            </View>
            <Text
              style={{
                color: '#374151',
                fontSize: 11,
                fontWeight: '700',
                fontFamily: Fonts.MONTSERRAT_BOLD,
              }}>
              Exercise Info
            </Text>
            <Text
              style={{
                color: '#6B7280',
                fontSize: 10,
                fontWeight: '600',
                fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
              }}>
              Details
            </Text>
          </TouchableOpacity>

          {/* Exercise List (if applicable) */}
          {!isEventPage && allExercise.length > 1 && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setRestStart(false);
                setOpenSheet(true);
              }}
              style={{
                alignItems: 'center',
                gap: 4,
              }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1.5,
                  borderColor: '#F3F4F6',
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: 2,
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.04,
                  shadowRadius: 4,
                }}>
                <FitIcon
                  name="format-list-bulleted"
                  type="MaterialCommunityIcons"
                  size={20}
                  color="#E11D48"
                />
              </View>
              <Text
                style={{
                  color: '#374151',
                  fontSize: 11,
                  fontWeight: '700',
                  fontFamily: Fonts.MONTSERRAT_BOLD,
                }}>
                List
              </Text>
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
        bottomSheetTitle={translate('nextExercises')}
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

      {open && allExercise[number] && (
        <WorkoutsDescription
          open={open}
          setOpen={setOpen}
          data={allExercise[number]}
          id={allExercise[number]?.exercise_id}
        />
      )}
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
