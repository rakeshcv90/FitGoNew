import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MeditationTitleComponent from './MeditationTitleComponent';
import Bulb from '../../Screen/Yourself/Bulb';
import {AppColor} from '../../Component/Color';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Progressbar from '../../Screen/Yourself/ProgressBar';
import {setMindset_Data} from '../../Component/ThemeRedux/Actions';
import {useDispatch, useSelector} from 'react-redux';
const AlcohalConsent = ({navigation, route}) => {
  const{mindSetData}=useSelector(state=>state)
  console.log("mindsetData",mindSetData)
  const Dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // for unselecting the item when user hit the back button from next screen
      setSelectedB(0);
    });

    return unsubscribe;
  }, [navigation]);

  const {nextScreen} = route.params;
  const [screen, setScreen] = useState(nextScreen);
  const TextData = [
    {
      id: 1,
      img: localImage.Alocol_yes,
      txt: 'Yes',
    },
    {
      id: 2,
      img: localImage.Alocol_no,
      txt: 'No',
    },
    {
      id: 3,
      img: localImage.Alocol_Dnt,
      txt: 'Prefer not to say',
    },
  ];
  useEffect(() => {
    startAnimation();
  }, []);
  const translateXValues = useRef(
    TextData.map(() => new Animated.Value(-DeviceWidth)),
  ).current;

  const startAnimation = () => {
    Animated.stagger(
      300,
      translateXValues.map(
        (
          item, // stagger is used map over an array with a delay eg. 500
        ) =>
          Animated.timing(item, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
      ),
    ).start();
  };
  const [selectedB, setSelectedB] = useState(0);
  const SelectedButton = button => {
    setSelectedB(button);
    setTimeout(() => {
      button==1?navigation.navigate('Alcohalinfo', {nextScreen: screen + 1}):navigation.navigate("LoadData") //need to update according functionality
    }, 250);
  };
  return (
    <View style={styles.Container}>
      <Progressbar screen={screen} Type />
      <Bulb
        header="Do not drink on an empty stomach"
        screen={'Do you drink Alcohol ?'}
      />
      <View style={{marginTop: DeviceHeigth * 0.08}}>
        {TextData.map((value, index) => (
          <Animated.View
            key={index}
            style={[{}, {transform: [{translateX: translateXValues[index]}]}]}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={[
                styles.button,
                {
                  borderWidth: selectedB == value.id ? 3 : 0,
                  borderColor: selectedB == value.id ? AppColor.RED : null,
                },
              ]}
              onPress={() => {
                Dispatch(
                  setMindset_Data([
                    ...mindSetData,
                    {Alcohol_Consent: value?.txt},
                  ]),
                );
                SelectedButton(value?.id);
              }}>
              <Image
                source={value.img}
                style={[styles.img]}
                resizeMode="contain"
                tintColor={
                  selectedB == value.id ? AppColor.RED : AppColor.DARKGRAY
                }
              />
              <Text
                style={[
                  styles.txts,
                  {
                    color:
                      selectedB == value.id ? AppColor.RED : AppColor.DARKGRAY,
                  },
                ]}>
                {value.txt}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: '#F7F8F8',
            width: 45,
            height: 45,
            borderRadius: 15,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icons name="chevron-left" size={25} color={'#000'} />
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => {
            // toNextScreen()
          }}>
          <LinearGradient
            start={{x: 0, y: 1}}
            end={{x: 1, y: 0}}
            colors={['#941000', '#D5191A']}
            style={[styles.nextButton]}>
            <Icons name="chevron-right" size={25} color={'#fff'} />
          </LinearGradient>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: AppColor.WHITE,
  },
  img: {
    width: DeviceWidth * 0.07,
    height: DeviceHeigth * 0.03,
  },
  button: {
    width: DeviceWidth * 0.9,
    height: DeviceHeigth * 0.08,
    marginVertical: DeviceHeigth * 0.015,
    borderRadius: 20,
    backgroundColor: AppColor.WHITE,
    paddingLeft: DeviceWidth * 0.06,
    // justifyContent:'center',
    alignItems: 'center',
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  txts: {
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginLeft: DeviceWidth * 0.06,
    fontSize: 15,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DeviceWidth * 0.9,
    alignItems: 'center',
    alignSelf: 'center',
    bottom: DeviceHeigth * 0.02,
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
export default AlcohalConsent;
