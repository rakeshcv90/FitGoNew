import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  DeviceHeigth,
  DeviceWidth,
  NewApi,
  NewAppapi,
} from '../../Component/Config';
import LinearGradient from 'react-native-linear-gradient';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {localImage} from '../../Component/Image';
import Gender from './Gender';
import {showMessage} from 'react-native-flash-message';
import Level from './Level';
import {Picker} from '@react-native-picker/picker';
import Focus from './Focus';
import Toggle from '../../Component/Toggle';
import {AppColor} from '../../Component/Color';
import {
  setCompleteProfileData,
  setCustomWorkoutData,
} from '../../Component/ThemeRedux/Actions';
import axios from 'axios';
import ActivityLoader from '../../Component/ActivityLoader';

import AnimatedLottieView from 'lottie-react-native';
import Button from '../../Component/Button';
import ProgressBar from './ProgressBar';

const imgData = Array(60)
  .fill(16)
  .map((item: any, index, arr) => arr[index] + index + 1);

const weight = Array(281)
  .fill(30)
  .map((item: any, index, arr) => arr[index] + index / 2);
const height = Array(100)
  .fill(4)
  .map((item: any, index, arr) => arr[index] + index / 10);

const Index = ({navigation, route}: any) => {
 

  const dispatch = useDispatch();
  const [screen, setScreen] = useState(1);
  const [toggleW, setToggleW] = useState('kg');
  const [toggleWData, setToggleWData] = useState([]);
  const [toggleData, setToggleData] = useState([]);
  const [toggle, setToggle] = useState('ft');
  const [visible, setVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState(-1);
  const [selectedGoal, setSelectedGoal] = useState(-1);
  const [selectedLevel, setSelectedLevel] = useState(-1);
  const [selectedFocus, setSelectedFocus] = useState(-1);
  const [selectedHeight, setSelectedHeight] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [isRouteDataAvailable, setIsrouteDataAvailable] = useState(false);
  useEffect(() => {
    if (route?.params?.id == undefined) {
      setScreen(1);
    
    } else {
      setScreen(route?.params?.id);
      setIsrouteDataAvailable(true);
    }
  }, [route?.params?.id]);
  useEffect(() => {
    ProfileDataAPI();
  }, []);
  useEffect(() => {
    if (screen == 5 || screen == 4 || screen == 3) {
      setSelectedHeight(toggleData[0]);
      setSelectedWeight(toggleWData[0]);
      setSelectedAge(imgData[0]);
      setSelectedIndex(0);
    }
  }, [screen]);
  useEffect(() => {
    if (toggleW === 'lb') {
      const te: any = weight.map(item => parseFloat((item * 2.2).toFixed(2)));
      setToggleWData(te);
    } else {
      // const te: any = weight.map(item => parseFloat((item / 2.2).toFixed(2)));
      setToggleWData(weight);
    }
  }, [toggleW]);
  useEffect(() => {
    if (toggle === 'cm') {
      const te: any = height.map(item => parseFloat((item * 30.48).toFixed(2)));
      setToggleData(te);
    } else {
      // const te: any = weight.map(item => parseFloat((item / 30.48).toFixed(2)));
      setToggleData(height);
    }
  }, [toggle]);

  const ProfileDataAPI = async () => {
    try {
      const res = await axios({
        url: NewAppapi.Get_COMPLETE_PROFILE,
        method: 'get',
      });
    
      if (res.data) {
        dispatch(setCompleteProfileData(res.data));
        setTimeout(() => {
          navigation.navigate('Gender', {
            data: res.data?.goal,
            nextScreen: screen,
          });
        }, 3000)
       
      }
    } catch (error) {
      dispatch(setCompleteProfileData([]));
      setTimeout(() => {
        navigation.navigate('Gender', {data: [], nextScreen: screen});
      }, 3000)
     
      console.log(error);
    }
  };


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <AnimatedLottieView
        source={require('../../Icon/Images/NewImage/Hi.json')}
        // speed={5}
        autoPlay
        loop
        style={{width: 300, height: 200}}
      />
      <Text
        style={{
          color: 'black',
          fontSize: 20,
          fontFamily: 'Poppins',
          fontWeight: '700',
          lineHeight: 30,
          marginTop: -50,
        }}>
        Tell us about yourself!
      </Text>
      <Text
        style={{
          fontSize: 12,
          fontWeight: '400',
          fontFamily: 'Verdana',
          lineHeight: 16,
          width: DeviceWidth * 0.7,
          paddingLeft: 10,
          color: '#505050',
          textAlign: 'center',
          marginTop: 5,
        }}>
       Start your journey to a healthier, happier you with us today!
      </Text>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: (DeviceWidth * 85) / 100,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
    // backgroundColor: 'red',
  },
  buttonsUp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: (DeviceWidth * 85) / 100,
    alignItems: 'center',
    alignSelf: 'center',
    height: 50,
  },
  nextButton: {
    backgroundColor: 'red',
    height: 45,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton2: {
    // backgroundColor: 'red',
    width: 45,
    height: 45,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
