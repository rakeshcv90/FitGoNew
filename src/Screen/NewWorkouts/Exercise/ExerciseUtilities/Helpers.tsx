import {
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Tts from 'react-native-tts';
import {AppColor} from '../../../../Component/Color';
// import NativeAddTest from '../../../../Component/NativeAd';
import {DeviceWidth} from '../../../../Component/Config';
import ProgreesButton from '../../../../Component/ProgressButton';
import {ActivityIndicator} from 'react-native';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import { getCurrentLanguage, translate } from '../../../Translation/TranslationService';

const songs = [
  // require('../../../../Icon/Images/Exercise_Timer.wav'),
  // require('../../../../Icon/Images/ExerciseNew.mp3'),
];
// const songs = [
//     {
//       id: 1,

//       url: require('../../../../Icon/Images/Exercise_Timer.wav'),
//     },
//     {
//       id: 2,

//       url: require('../../../../Icon/Images/Exercise_Start.mp3'),
//     },
//   ];
function resolveImportedAssetOrPath(pathOrAsset: any) {
  return pathOrAsset === undefined
    ? undefined
    : typeof pathOrAsset === 'string'
    ? pathOrAsset
    : resolveImportedAsset(pathOrAsset);
}
function resolveImportedAsset(id: number) {
  return id ? resolveAssetSource(id)?.uri ?? undefined : undefined;
}
  const lang = getCurrentLanguage()
const initTts = async () => {
  const ttsStatus: any = await Tts.getInitStatus();
  if (!ttsStatus.isInitialized) {
    if (lang == 'en') {
          await Tts.setDefaultLanguage('en-IN');
        } else {
          await Tts.setDefaultLanguage('pt-BR');
        }
    await Tts.setDucking(true);
    await Tts.setIgnoreSilentSwitch(true);
    await Tts.addEventListener('tts-finish', event => {
      Tts.stop();
    });
  }
};

const handleExerciseChange = (exerciseName: string, getStoreVideoLoc: any) => {
  if (getStoreVideoLoc.hasOwnProperty(exerciseName)) {
    // setCurrentVideo(getStoreVideoLoc[exerciseName]);
  } else {
    // setCurrentVideo('');
    console.error(`Exercise "${exerciseName}" video not found.`);
  }
};

const PauseModal = ({
  back,
  quitLoader,
  setBack,
  number,
  exerciseLength,
  quitFunction,
  resumeButton,
}: any) => {
  return (
    <Modal
      visible={back}
      onRequestClose={() => setBack(false)}
      animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: AppColor.WHITE,
          justifyContent: 'center',
          alignItems: 'center',
          // marginTop: DeviceHeigth * 0.05
        }}>
        {/* <NativeAddTest media={true} type="video" /> */}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: DeviceWidth * 0.1,
            // marginTop: DeviceHeigth * 0.05
            // paddingLeft: DeviceWidth / 2,
          }}>
          <Text
            style={{
              fontWeight: '600',
              fontSize: 32,
              color: '#f0013b',
            }}>
            {translate('keepGoing')}
          </Text>
          <Text
            style={{
              fontWeight: '600',
              fontSize: 32,
              color: '#f0013b',
            }}>
            {translate('dontGiveUp')}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '500',
            fontFamily: 'Poppins',
            lineHeight: 30,
            marginTop: 5,
            color: AppColor.BLACK,
          }}>
          {translate('youHaveFinished')}
          <Text style={{color: '#f0013b'}}>
            {((number / exerciseLength) * 100).toFixed(0) + '%'}
          </Text>
          {'\n'}
          {translate('only')}
          <Text style={{color: '#f0013b'}}>
            {exerciseLength - number}
          </Text>
          {translate('exercisesLeft')}
        </Text>
        <View style={{marginTop: 12}}>
          <ProgreesButton
            text={translate('resume')}
            h={55}
            bR={30}
            flex={-1}
            mV={20}
            onPress={resumeButton}
            bW={1}
          />

          <TouchableOpacity
            style={{alignSelf: 'center', marginTop: 5}}
            onPress={quitFunction}>
            {quitLoader ? (
              <ActivityIndicator
                animating={quitLoader}
                color={AppColor.NEW_DARK_RED}
              />
            ) : (
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'Poppins',
                  lineHeight: 30,
                  color: AppColor.BLACK,
                  fontWeight: '700',
                }}>
                {translate('quit')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export {
  initTts,
  handleExerciseChange,
  PauseModal,
  songs,
  resolveImportedAssetOrPath,
};
