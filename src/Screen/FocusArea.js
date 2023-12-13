import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {AppColor} from '../Component/Color';
import ProgressBar from './Yourself/ProgressBar';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import FocuseAreaFmale from '../Component/FocuseAreaFmale';
import {useSelector} from 'react-redux';
import FocuseAreaMale from '../Component/FocuseAreaMale';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const FocusArea = ({route, navigation}) => {
  const {nextScreen} = route.params;
  const {getLaterButtonData} = useSelector(state => state);
  console.log('Item Data Is', getLaterButtonData[0].gender);
  return (
    <SafeAreaView>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',

          marginTop: DeviceHeigth * 0.05,
        }}>
        <ProgressBar screen={nextScreen} />
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: DeviceHeigth * 0.0,
        }}>
        <Text style={styles.textStyle}>Select your Focus area</Text>
      </View>
      <View>
        {getLaterButtonData[0].gender == 'M' ? (
          <FocuseAreaMale />
        ) : (
          <FocuseAreaFmale />
        )}
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
        // onPress={() => navigation.goBack()}
        >
          <Icons name="chevron-left" size={25} color={'#000'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('FocusArea', {nextScreen: screen + 1});
          }}>
          <LinearGradient
            start={{x: 0, y: 1}}
            end={{x: 1, y: 0}}
            colors={['#941000', '#D5191A']}
            style={[styles.nextButton]}>
            <Icons name="chevron-right" size={25} color={'#fff'} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    top:
      Platform.OS == 'android'
        ? DeviceHeigth * 0.69
        : DeviceHeigth == '1024'
        ? DeviceHeigth * 0.7
        : DeviceHeigth * 0.66,
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
