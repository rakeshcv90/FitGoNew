import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColor} from '../Component/Color';
import ProgressBar from './Yourself/ProgressBar';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import FocuseAreaFmale from '../Component/FocuseAreaFmale';
import {useDispatch, useSelector} from 'react-redux';
import FocuseAreaMale from '../Component/FocuseAreaMale';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {setLaterButtonData} from '../Component/ThemeRedux/Actions';
import Bulb from './Yourself/Bulb';

const FocusArea = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {nextScreen} = route.params;
  const {getLaterButtonData} = useSelector(state => state);
  const [screen, setScreen] = useState(nextScreen);
  const [imageView, setImageVIew] = useState([]);

  useEffect(() => {
    setScreen(nextScreen);
  }, []);
  const toNextScreen = () => {
    const currentData = {
      focuseArea: imageView,
    };
    dispatch(setLaterButtonData([...getLaterButtonData, currentData]));
    navigation.navigate('WorkoutArea', {nextScreen: screen + 1});
    {
      console.log('Focuse Area Screen Data', [
        ...getLaterButtonData,
        currentData,
      ]);
    }
  };

  return (
    <View style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',

          marginTop: DeviceHeigth * 0.02,
        }}>
        <ProgressBar screen={nextScreen} />
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',

          // marginTop: -DeviceHeigth * 0.015,
        }}>
        <Bulb
          screen={'Select your Focus area'}
          header={
            'Knowing your age can help us for you based on different metabolic rates.'
          }
        />
      </View>
      <View>
        {getLaterButtonData[0].gender == 'Male' ? (
          <FocuseAreaMale imageView={imageView} setImageVIew={setImageVIew} />
        ) : (
          <FocuseAreaFmale imageView={imageView} setImageVIew={setImageVIew} />
        )}
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={{
            backgroundColor: '#F7F8F8',
            width: 45,
            height: 45,
            borderRadius: 15,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <Icons name="chevron-left" size={25} color={'#000'} />
        </TouchableOpacity>

        {imageView.length !== 0 && (
          <TouchableOpacity
            onPress={() => {
              toNextScreen();
            }}>
            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              colors={['#941000', '#D5191A']}
              style={[styles.nextButton]}>
              <Icons name="chevron-right" size={25} color={'#fff'} />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  textStyle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: (DeviceWidth * 85) / 100,
    alignItems: 'center',
    alignSelf: 'center',
    alignSelf: 'center',
    bottom: DeviceHeigth * 0.02,
    position: 'absolute',
    // top:
    //   Platform.OS == 'android'
    //     ? DeviceHeigth * 0.69
    //     : DeviceHeigth == '1024'
    //     ? DeviceHeigth * 0.7
    //     : DeviceHeigth * 0.66,
  },
  nextButton: {
    backgroundColor: 'red',
    width: 45,
    height: 45,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default FocusArea;
