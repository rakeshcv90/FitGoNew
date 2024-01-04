import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor} from '../../../Component/Color';
import {localImage} from '../../../Component/Image';
import GradientText from '../../../Component/GradientText';
import {DeviceHeigth, DeviceWidth} from '../../../Component/Config';
import GradientButton from '../../../Component/GradientButton';

const SaveDayExercise = ({navigation, route}: any) => {
  const {data} = route?.params;
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: AppColor.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={localImage.Congrats}
        style={{flex: 0.6, marginTop: DeviceHeigth * 0.1}}
        resizeMode="contain"
      />
      <GradientText
        text="Congratulations!"
        fontSize={32}
        width={DeviceWidth * 0.7}
      />
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Poppins',
            lineHeight: 30,
            color: AppColor.BLACK,
            fontWeight: '600',
            width: DeviceWidth* 0.9,
            textAlign: 'center'
          }}>
          You completed your {data?.workout_title} Exercise
        </Text>
      <View
        style={{
          marginHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: DeviceHeigth * 0.1,
        }}>
        <View style={styles.container}>
          <Image
            source={localImage.Step1}
            style={{flex: 1}}
            resizeMode="contain"
          />
          <GradientText text={'2'} width={30} fontSize={28} x={'5'} />
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins',
              lineHeight: 30,
              color: '#505050',
              fontWeight: '500',
            }}>
            Min
          </Text>
        </View>
        <View style={styles.container}>
          <Image
            source={localImage.Clock}
            style={{flex: 1}}
            resizeMode="contain"
          />
          <GradientText text={'2'} width={30} fontSize={28} x={'5'} />
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins',
              lineHeight: 30,
              color: '#505050',
              fontWeight: '500',
            }}>
            Min
          </Text>
        </View>
        <View style={styles.container}>
          <Image
            source={localImage.Action}
            style={{flex: 1}}
            resizeMode="contain"
          />
          <GradientText text={'2'} width={30} fontSize={28} x={'5'} />
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins',
              lineHeight: 30,
              color: '#505050',
              fontWeight: '500',
            }}>
            Min
          </Text>
        </View>
      </View>
      <GradientButton
      onPress={() => navigation.navigate('BottomTab')}
        text="Save and Continue"
        bR={10}
        h={70}
        flex={0.2}
        alignSelf
      />
    </SafeAreaView>
  );
};

export default SaveDayExercise;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: DeviceWidth * 0.3,
    height: DeviceHeigth * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFC',
    borderRadius: 15,
    borderTopLeftRadius: 15,
    padding: 20,
    marginHorizontal: 5,
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
});
