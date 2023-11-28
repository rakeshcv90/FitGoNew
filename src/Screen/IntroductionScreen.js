import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {localImage} from '../Component/Image';
import {DeviceWidth, DeviceHeigth} from '../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
const IntroductionScreen = () => {
  const [currentPage, setCurrentPage] = useState(0);
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
  const goToNextPage = () => {
    if (currentPage < IntroductionData.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  const currentData = IntroductionData[currentPage];
  return (
    <View style={styles.Container}>
      <ImageBackground source={ IntroductionData[currentPage].img} style={styles.ImgBackground}>
        <View style={styles.LinearG}>
          <View style={styles.TextView}>
            <Text style={[styles.Texts, {fontSize: 25}]}>
              {currentData.text1}
            </Text>
            <Text style={[styles.Texts, {fontSize: 33}]}>
              {currentData.text2}
            </Text>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity>
              <Text style={styles.Texts}>Skip</Text>
            </TouchableOpacity>

            <View>
              <Text>Something</Text>
            </View>
            <View>
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                colors={['#941000', '#D5191A']}
                style={styles.nextButton}>
                <TouchableOpacity
                  onPress={() => goToNextPage()}
                  style={styles.nextButton}>
                  <Icons name="chevron-right" size={25} color={'#fff'} />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
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
  },
  TextView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: (DeviceHeigth * 20) / 100,

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
  },
  nextButton: {
    backgroundColor: 'red',
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default IntroductionScreen;
