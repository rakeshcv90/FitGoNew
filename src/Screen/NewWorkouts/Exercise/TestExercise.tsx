import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Button,
  BackHandler,
  Animated,
  ScrollView,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor, Fonts} from '../../../Component/Color';
import ExerciseProgressBar from './ExerciseProgressBar';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntIcons from 'react-native-vector-icons/AntDesign';
import Video from 'react-native-video';
import Play from './Play';
import BottomSheetExercise from './BottomSheetExercise';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import WorkoutsDescription from '../WorkoutsDescription';
import GradientText from '../../../Component/GradientText';
import ProgreesButton from '../../../Component/ProgressButton';
import Tts from 'react-native-tts';
import {string} from 'yup';
import {showMessage} from 'react-native-flash-message';
import VersionNumber from 'react-native-version-number';
import KeepAwake from 'react-native-keep-awake';
import moment from 'moment';

import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
} from 'react-native-track-player';
import {
  MyInterstitialAd,
  NewInterstitialAd,
} from '../../../Component/BannerAdd';
import {localImage} from '../../../Component/Image';

import {setSoundOnOff} from '../../../Component/ThemeRedux/Actions';
import {navigationRef} from '../../../../App';

import CircularProgress, {
  CircularProgressWithChild,
  ProgressRef,
} from 'react-native-circular-progress-indicator';
import {setScreenAwake} from '../../../Component/ThemeRedux/Actions';
import {AddCountFunction} from '../../../Component/Utilities/AddCountFunction';
import NativeAddTest from '../../../Component/NativeAddTest';
import {ShadowStyle} from '../../../Component/Utilities/ShadowStyle';
import FitIcon from '../../../Component/Utilities/FitIcon';
import FitText from '../../../Component/Utilities/FitText';
import {StatusBar} from 'react-native';
import {ArrowLeft} from '../../../Component/Utilities/Arrows/Arrow';
import ExerciseControls from './ExerciseControls';

const TestExercise = ({navigation, route}: any) => {
  const {
    allExercise,
    currentExercise,
    data,
    day,
    exerciseNumber,
    trackerData,
    type,
    challenge,
  } = route.params;
  const [pause, setPause] = useState(false);
  const [back, setBack] = useState(false);
  const [num, setNum] = useState(0);
  const getStoreVideoLoc = useSelector((state: any) => state.getStoreVideoLoc);


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#F7F7F7',
      }}>
      <StatusBar barStyle={'dark-content'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 10,
          width: '95%',
          alignSelf: 'center',
        }}>
        <View
          style={{
            height: DeviceHeigth * 0.6,
            paddingHorizontal: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: DeviceWidth * 0.05,
            }}>
            <TouchableOpacity
              onPress={() => {
                  setBack(true);
                  setPause(!pause)
              }}
              style={{
                width: 40,
              }}>
              <ArrowLeft />
            </TouchableOpacity>
            <Text
              style={{
                color: '#1F2937',
                fontFamily: Fonts.HELVETICA_BOLD,
                fontSize: 18,
                lineHeight: 20,
                fontWeight: '600',
              }}>
              {allExercise[num]?.exercise_title}
            </Text>
            <View
              style={{
                padding: 2,
                paddingHorizontal: 10,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: '#EBEDF0',
              }}>
              <Text
                style={{
                  color: '#6B7280',
                  fontFamily: Fonts.MONTSERRAT_MEDIUM,
                  fontSize: 16,
                  lineHeight: 20,
                  fontWeight: '600',
                }}>
                {num + 1}/{allExercise?.length}
              </Text>
            </View>
          </View>
          <View
            style={[
              {
                height: DeviceHeigth * 0.5,
                marginTop: DeviceHeigth * 0.02,
                zIndex: -1,
                backgroundColor: AppColor.WHITE,
                borderRadius: 10,
                overflow: 'hidden',
              },
              ShadowStyle,
            ]}>
            <Video
              source={{
                uri: getStoreVideoLoc[allExercise[0]?.exercise_title],
              }}
              onReadyForDisplay={() => {
                setPause(true);
              }}
              onLoad={() => {
                setPause(true);
              }}
              paused={!pause}
              onPlaybackResume={() => {
                setPause(true);
              }}
              repeat={true}
              resizeMode="contain"
              style={{
                width: DeviceWidth,
                height: DeviceHeigth * 0.4,
                alignSelf: 'center',
                top: 30,
              }}
            />
          </View>
        </View>
        <ExerciseControls
          pause={pause}
          setPause={setPause}
          setNum={setNum}
          back={back}
          setBack={setBack}
          allExercise={allExercise}
          currentExercise={currentExercise}
          data={data}
          day={day}
          exerciseNumber={exerciseNumber}
          trackerData={trackerData}
          type={type}
          challenge={challenge}
          getStoreVideoLoc={getStoreVideoLoc}
        />
      </ScrollView>
      {/* <BottomSheetExercise
          isVisible={visible}
          setVisible={setVisible}
          exerciseData={allExercise}
          timerProgress={timerProgress}
          setPlayW={setPlayW}
          setPause={setPause}
          animatedProgress={animatedProgress}
          playTimerRef={playTimerRef}
          currentExercise={currentExercise}
          setSeconds={setSeconds}
          handleExerciseChange={handleExerciseChange}
          setNumber={setNumber}
        />
  
        <WorkoutsDescription
          open={open}
          setOpen={setOpen}
          data={allExercise[number]}
        /> */}
    </SafeAreaView>
  );
};

export default TestExercise;

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  head: {
    fontSize: 30,
    fontFamily: 'Poppins',
    fontWeight: '700',
    // lineHeight: 40,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Montserrat-Regular',
    fontWeight: '600',
    lineHeight: 30,
    color: '#1e1e1e',
  },
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
    // alignItems: 'center',
    height: DeviceHeigth * 0.5,
    width: DeviceWidth,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    bottom: -50,
    position: 'absolute',
    padding: 20,
    marginLeft: -20,
    // paddingTop: 50,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 5,
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
  },
  loader: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',

    marginVertical: DeviceHeigth * 0.2,
  },
  temp: {
    width: DeviceWidth * 0.9,
    flexDirection: 'row',
    justifyContent: 'center',
    height: Platform.OS == 'ios' ? 0 : DeviceHeigth * 0.05,
    alignSelf: 'center',
    marginTop: DeviceHeigth * 0.02,
  },
});
