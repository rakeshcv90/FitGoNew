import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {localImage} from '../Component/Image';
import {DeviceWidth, DeviceHeigth} from '../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {AppColor} from '../Component/Color';
import {navigationRef} from '../../App';
import {setShowIntro} from '../Component/ThemeRedux/Actions';
import {useDispatch} from 'react-redux';

const IntroductionScreen = () => {
  const translateY = useRef(new Animated.Value(-200)).current;
  const [currentPage, setCurrentPage] = useState(0);
  const [hide, setHide] = useState(false);
  const dispatch = useDispatch();
  const IntroductionData = [
    {
      id: 1,
      text1: 'Meet your coach,',
      text2: 'start your juorney',
      img: localImage.Inrtoduction1,
    },
    {
      id: 2,
      text1: 'Create a workout plan,',
      text2: 'to stay fit',
      img: localImage.Inrtoduction2,
    },
    {
      id: 3,
      text1: 'Action is the ',
      text2: 'key to all success',
      img: localImage.Inrtoduction3,
    },
  ];
  useEffect(() => {
    goToNextPage(-1);
    setTimeout(() => {
      setHide(true);
    }, 1000);
  }, []);
  const goToNextPage = index => {
    setCurrentPage(index + 1);
    translateY.setValue(300);
    Animated.timing(translateY, {
      useNativeDriver: true,
      toValue: -(DeviceHeigth * 15) / 100,
      delay: 1000,
      duration: 1500,
    }).start();
  };

  return (
    <View style={styles.Container}>
      <ImageBackground
        source={IntroductionData[currentPage].img}
        style={styles.ImgBackground}>
        <View style={styles.LinearG}>
          <Animated.View
            style={[styles.TextView, {transform: [{translateY: translateY}]}]}>
            <Text style={[styles.Texts, {fontSize: 25}]}>
              {IntroductionData[currentPage].text1}
            </Text>
            <Text style={[styles.Texts, {fontSize: 33, marginBottom: 50}]}>
              {IntroductionData[currentPage].text2}
            </Text>

            {currentPage == 2 && (
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                colors={['#941000', '#D5191A']}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  height: 50,
                  borderRadius: 50,
                  width: DeviceWidth * 0.4,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setShowIntro(true));
                    navigationRef.navigate('LogSignUp');
                  }}>
                  <Text
                    style={[
                      styles.Texts,
                      {fontSize: 20},
                    ]}>{`Start Now   >`}</Text>
                </TouchableOpacity>
              </LinearGradient>
            )}
          </Animated.View>
          {hide && (
            <View style={styles.buttons}>
              {currentPage != 2 ? (
                <TouchableOpacity
                  onPress={() => navigationRef.navigate('LogSignUp')}>
                  <Text style={[styles.Texts, {fontSize: 20}]}>Skip</Text>
                </TouchableOpacity>
              ):
                <TouchableOpacity
                  onPress={() => null}>
                  <Text style={[styles.Texts, {fontSize: 20}]}>    </Text>
                </TouchableOpacity>}
              <View
                style={{
                  width: DeviceWidth * 0.22,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                {IntroductionData.map(item => (
                  <View
                    style={{
                      height: 3,
                      width: item.id == currentPage + 1 ? 40 : 20,
                      backgroundColor:
                        item.id == currentPage + 1
                          ? AppColor.RED
                          : AppColor.SOCIALBUTTON,
                    }}
                  />
                ))}
              </View>
              {currentPage != 2 ? (
                <TouchableOpacity onPress={() => goToNextPage(currentPage)}>
                  <LinearGradient
                    start={{x: 0, y: 1}}
                    end={{x: 1, y: 0}}
                    colors={['#941000', '#D5191A']}
                    style={[styles.nextButton]}>
                    <Icons name="chevron-right" size={25} color={'#fff'} />
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 50 / 2,
                    overflow: 'hidden',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
              )}
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  ImgBackground: {
    width: DeviceWidth,
    height: DeviceHeigth,
    resizeMode: 'stretch',
  },
  LinearG: {
    height: DeviceHeigth,
    width: DeviceWidth,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    bottom:Platform.OS=='ios'?-DeviceHeigth*0.00:DeviceHeigth*0.02
  },
  TextView: {
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: (DeviceHeigth * 20) / 100,
  },
  Texts: {
    color: '#fff',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: (DeviceWidth * 85) / 100,
    marginBottom: (DeviceHeigth * 5) / 100,
    alignItems: 'center',
    alignSelf: 'center',
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
export default IntroductionScreen;
