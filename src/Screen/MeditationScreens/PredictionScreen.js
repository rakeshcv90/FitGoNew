import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native';
import { AppColor } from '../../Component/Color';
import { DeviceHeigth, DeviceWidth } from '../../Component/Config';
import { StatusBar } from 'react-native';
import Bulb from '../Yourself/Bulb';
import LinearGradient from 'react-native-linear-gradient';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

const PredictionScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.Container}>
    <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
    <View
        style={{
          width: DeviceWidth * 0.5,
          height: DeviceHeigth * 0.2,

          alignSelf: 'center',
          //backgroundColor: 'red',
        }}>
        
      </View>

  
      <Text style={styles.text2}>10,00,000+</Text>
      <Text style={styles.text2}>Training Plan</Text>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',

          marginTop: DeviceHeigth * 0.02,
        }}>
        <Bulb
          screen={'Do you have Injury in any body part?'}
          header={
            'We will filter unsuitable workouts for you, Also you can select 1 or 2 Injuries only'
          }
        />
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
             style={{ backgroundColor: '#F7F8F8',
            width: 45,
            height: 45,
            borderRadius: 15,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',}}
        onPress={() => navigation.goBack()}
        >
          <Icons name="chevron-left" size={25} color={'#000'} />
        </TouchableOpacity>

      
        <TouchableOpacity
          onPress={() => {
            // toNextScreen()
            navigation.navigate('MeditationConsent', );
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
    
  )
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 30,
    fontFamily: 'Poppins',
    color: AppColor.BLACK,
  },
  text1: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 30,
    fontFamily: 'Poppins',
    color: '#424242',

  },
  text2: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 35,
    fontFamily: 'Poppins',
    color: 'rgb(197, 23, 20)',
  
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: (DeviceWidth * 85) / 100,
    alignItems: 'center',
    alignSelf: 'center',
    bottom:DeviceHeigth*0.05,
    position: 'absolute',
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
export default PredictionScreen