import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor} from '../../../Component/Color';
import ExerciseProgressBar from './ExerciseProgressBar';
import {DeviceHeigth, NewAppapi} from '../../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import Play from './Play';
import BottomSheetExercise from './BottomSheetExercise';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';

const Exercise = ({navigation, route}: any) => {
  const {allExercise, currentExercise, data, day} = route.params;
  const VideoRef = useRef();
  const [visible, setVisible] = useState(false);
  const [playW, setPlayW] = useState(0);
  const [number, setNumber] = useState(0);
  const [pause, setPause] = useState(true);
  const [currentData, setCurrentData] = useState(currentExercise);

  const {allWorkoutData, getUserDataDetails} = useSelector(
    (state: any) => state,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      if (pause) setPlayW(playW + 1);
    }, 1000);
  }, [playW, pause]);

  const FAB = ({icon}: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          icon == 'format-list-bulleted' && setVisible(true);
        }}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 30,
          width: 30,
          height: 30,
          backgroundColor: '#D9D9D9B2',
          marginVertical: 5,
        }}>
        {icon == 'info-outline' ? (
          <MaterialIcons
            name={icon}
            size={20}
            color={AppColor.INPUTTEXTCOLOR}
          />
        ) : (
          <Icons name={icon} size={20} color={AppColor.INPUTTEXTCOLOR} />
        )}
      </TouchableOpacity>
    );
  };

  const postCurrentDayAPI = async (index: number) => {
    const payload = new FormData();
    payload.append('user_exercise_id', allExercise[index]?.exercise_id);
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('workout_id', data?.workout_id);
    payload.append('user_day', day);

    try {
      const res = await axios({
        url: NewAppapi.CURRENT_DAY_EXERCISE,
        method: 'Post',
        data: payload,
      });
      if (res.data) {
        console.log(res.data, 'Post');
        setCurrentData(allExercise[index]);
        setPlayW(0);
      }
    } catch (error) {
      console.error(error, 'PostDaysAPIERror');
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: AppColor.WHITE, paddingHorizontal: 20}}>
      <ExerciseProgressBar
        ExerciseData={allExercise}
        INDEX={number}
        time={currentData?.exercise_rest == 1 ? 60 : 1}
        w={`${playW}%`}
      />
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          marginTop: DeviceHeigth * 0.06,
        }}>
        <Icons
          name={'chevron-left'}
          size={30}
          color={AppColor.INPUTTEXTCOLOR}
        />
      </TouchableOpacity>
      <View style={{height: DeviceHeigth * 0.5}}>
        <Video
          source={{
            uri: 'https://customer-50ey2gp6ldpfu37q.cloudflarestream.com/477addc9f11b43b3ba5a2e6f27f5200d/downloads/default.mp4',
          }}
          onReadyForDisplay={() => console.log('first')}
          onLoad={() => console.log('second')}
          onVideoLoad={() => console.log('third')}
          onVideoLoadStart={() => console.log('forth')}
          //   onBuffer={() => setPause(false)}
          //   paused={pause}
          //   onPlaybackResume={() => setPause(true)}
          style={StyleSheet.absoluteFill}
        />
        <View style={{alignSelf: 'flex-end'}}>
          <FAB icon="format-list-bulleted" />
          <FAB icon="info-outline" />
          <FAB icon="music" />
        </View>
      </View>
      <Text style={styles.head}>Get Ready</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <Text style={styles.name}>{currentData?.exercise_title}</Text>
        <Text style={[styles.name, {color: '#505050'}]}>
          <Icons
            name={'clock-outline'}
            size={20}
            color={AppColor.INPUTTEXTCOLOR}
          />
          {` ${currentData?.exercise_rest}`}
        </Text>
      </View>
      <Play
        play={pause}
        fill={`${100 - playW}%`}
        h={80}
        playy={() => setPause(!pause)}
        next={() => {
          if (number == allExercise?.length - 1) return;
          const index = allExercise?.findIndex(
            (item: any) => item?.exercise_id == currentData?.exercise_id,
          );
          postCurrentDayAPI(index + 1);
          setNumber(number + 1);
        }}
        back={() => {
          if (number == 0) return;
          const index = allExercise?.findIndex(
            (item: any) => item?.exercise_id == currentData?.exercise_id,
          );
          postCurrentDayAPI(index - 1);
          setNumber(number - 1);
        }}
      />
      <BottomSheetExercise
        isVisible={visible}
        setVisible={setVisible}
        exerciseData={allExercise}
      />
    </SafeAreaView>
  );
};

export default Exercise;

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
    lineHeight: 40,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Poppins',
    fontWeight: '600',
    lineHeight: 30,
    color: '#1e1e1e',
  },
});
