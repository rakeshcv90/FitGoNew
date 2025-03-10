import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  BackHandler,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor, Fonts} from '../../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../../Component/Config';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import {ShadowStyle} from '../../../Component/Utilities/ShadowStyle';
import {StatusBar} from 'react-native';
import {ArrowLeft} from '../../../Component/Utilities/Arrows/Arrow';
import ExerciseControls from './ExerciseUtilities/ExerciseControls';
import {BannerAdd} from '../../../Component/BannerAdd';
import {bannerAdId} from '../../../Component/AdsId';
import Wrapper from '../../WorkoutCompleteScreen/Wrapper';
import NativeAddTest from '../../../Component/NativeAd';
import ActivityLoader from '../../../Component/ActivityLoader';

const NewExercise = ({navigation, route}: any) => {
  const {
    allExercise,
    currentExercise,
    data,
    day,
    exerciseNumber,
    trackerData,
    type,
    challenge,
    isEventPage,
    offerType,
  } = route.params;
  const [pause, setPause] = useState(false);
  const [back, setBack] = useState(false);
  const [isRest, setIsRest] = useState(false);
  const getStoreVideoLoc = useSelector((state: any) => state.getStoreVideoLoc);
  const [number, setNumber] = useState(0);

  const backAction = () => {
    setBack(true);
    return true; // Prevent the default back action
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Cleanup on unmount
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F7F7F7',
      }}>
      <Wrapper
        styles={{
          backgroundColor: '#F7F7F7',
        }}>
        <StatusBar barStyle={'dark-content'} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 10,
            width: '100%',
            alignSelf: 'center',
            marginBottom: 10,
          }}>
          <View
            style={{
              // height: DeviceHeigth * 0.55,
              paddingHorizontal: 20,
              marginBottom: 15,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: DeviceWidth * 0.025,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setBack(true);
                  setPause(false);
                }}
                style={{
                  width: 40,
                }}>
                <ArrowLeft fillColor={AppColor.BLACK} />
              </TouchableOpacity>
              <Text
                style={{
                  color: '#1F2937',
                  fontFamily: Fonts.HELVETICA_BOLD,
                  fontSize: 18,
                  lineHeight: 20,
                  fontWeight: '600',
                }}>
                {/* {allExercise[number]?.exercise_title} */}
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
                  {number + 1}/{allExercise?.length}
                </Text>
              </View>
            </View>
            <View
              style={[
                {
                  height: DeviceHeigth * 0.45,
                  marginTop: DeviceHeigth * 0.01,
                  zIndex: -1,
                  backgroundColor: AppColor.WHITE,
                  borderRadius: 10,
                  overflow: 'hidden',
                },
                ShadowStyle,
              ]}>
              {isRest ? (
                <NativeAddTest media={true} type="video" />
              ) : pause ? (
                <Video
                  source={{
                    uri: getStoreVideoLoc[allExercise[number]?.exercise_title],
                  }}
                  onReadyForDisplay={() => {
                    setPause(true);
                  }}
                  onLoad={() => {
                    setPause(true);
                  }}
                  paused={!pause}
                  repeat={true}
                  resizeMode="contain"
                  style={{
                    width: DeviceWidth,
                    height: DeviceHeigth * 0.4,
                    alignSelf: 'center',
                    top: 30,
                  }}
                />
              ) : (
                <ActivityLoader visible={!pause} />
              )}
            </View>
          </View>
          <ExerciseControls
            pause={pause}
            setPause={setPause}
            number={number}
            setNumber={setNumber}
            getStoreVideoLoc={getStoreVideoLoc}
            back={back}
            setBack={setBack}
            setIsRest={setIsRest}
            allExercise={allExercise}
            currentExercise={currentExercise}
            data={data}
            day={day}
            exerciseNumber={exerciseNumber}
            trackerData={trackerData}
            type={type}
            challenge={challenge}
            isEventPage={isEventPage}
            offerType={offerType}
          />
        </ScrollView>
      </Wrapper>
      <BannerAdd bannerAdId={bannerAdId} />
    </View>
  );
};

export default NewExercise;
