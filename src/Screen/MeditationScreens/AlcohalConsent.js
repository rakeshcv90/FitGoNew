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
const AlcohalConsent = ({navigation}) => {
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
        }
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
           navigation.navigate("Alcohalinfo")
        }, 250);
      };
  return (
    <View style={styles.Container}>
      <MeditationTitleComponent
        Title={"Do you drink Alcohol ?"}
      />
      <Bulb header={"Do not drink on an empty stomach"}/>
      <View style={{marginTop: DeviceHeigth *0.08}}>
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
      <TouchableOpacity
      onPress={()=>{
        navigation.goBack()
      }}
        style={{
          justifyContent: 'flex-end',
          flex: 1,
          marginBottom: DeviceHeigth*0.05,
          alignItems: 'flex-start',
          //  borderWidth: 1,
          width: DeviceWidth * 0.9,
        }}>
        <Icons name="chevron-left" size={25} color={AppColor.BLACK}/>
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
    Container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: AppColor.BACKGROUNG,
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
  });
export default AlcohalConsent