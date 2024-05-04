import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
const ProgressBar = ({screen}: any) => {
  const getProgressBarCounter = useSelector(
    state => state.getProgressBarCounter,
  );
  return (
    <SafeAreaView
      style={{
        alignSelf: 'flex-start',
        alignItems: 'center',
        width: DeviceWidth * 0.9,
        marginBottom: DeviceHeigth * 0.07,
        marginTop: DeviceHeigth * 0.02,
        // borderWidth: 1,
        justifyContent: 'center',
      }}>
      <View style={{flexDirection: 'row-reverse', alignSelf: 'flex-end'}}>
        <Text
          style={{
            color: '#83898C',
            fontFamily: 'Poppins',
            fontWeight: '400',
          }}>
          <Text style={{color: AppColor.RED}}>{`Step  ${screen} `}</Text>
          {`of ${getProgressBarCounter}`}
        </Text>
      </View>
      <View
        style={{
          width: DeviceWidth * 0.9,
          backgroundColor: '#E2E6F9',
          height: 5,
          borderRadius: 5,
          marginLeft: 40,
          marginTop: 5,
        }}>
        <LinearGradient
          colors={[AppColor.RED1, AppColor.RED]}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          style={{
            width:
              screen == 0
                ? '12.5%'
                : `${getProgressBarCounter == 9 ? 11.12 * screen: 10 * screen}%`,
            height: 5,
            borderRadius: 5,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({});
