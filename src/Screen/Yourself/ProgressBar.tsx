import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
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
        alignSelf: 'center',
        alignItems: 'center',
        width: DeviceWidth * 0.9,
        marginBottom: DeviceHeigth * 0.07,
        marginTop: DeviceHeigth * 0.02,
      }}>
      <View style={{alignSelf: 'flex-end'}}>
        <Text
          style={{
            color: '#83898C',
            fontFamily: Fonts.MONTSERRAT_MEDIUM,
          }}>
          <Text
            style={{
              color: AppColor.RED,
              fontFamily: Fonts.MONTSERRAT_MEDIUM,
            }}>{`Step  ${screen} `}</Text>
          {`of ${getProgressBarCounter}`}
        </Text>
      </View>
      <View
        style={{
          width: DeviceWidth * 0.9,
          backgroundColor: '#E2E6F9',
          height: 5,
          borderRadius: 5,
          marginTop: 5,
        }}>
        <LinearGradient
          colors={[AppColor.RED1, AppColor.RED]}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          style={{
            width:
              screen == 0
                ? '16.2%'
                : `${
                    getProgressBarCounter == 6
                      ? 16.7 * screen
                      : getProgressBarCounter == 7
                      ? 14.25 * screen
                      : 12.5 * screen
                  }%`,
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
