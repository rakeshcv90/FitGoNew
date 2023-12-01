import {
  View,
  Text,
  SafeAreaView,
  Image,
  ImageBackground,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {AppColor} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {localImage} from '../../Component/Image';
import Calories from '../../Component/Calories';

const Home = () => {
  const [selectedButton, setSelectedButton] = useState('1');
  const [loader, setLoaded] = useState(false);
  const handleButtonColor = ButtonNumber => {
    setSelectedButton(ButtonNumber);
    //setLoaded(false);
  };

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
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <ScrollView
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <ImageBackground
          source={localImage.CARD}
          style={styles.card}
          resizeMode="contain">
          <View style={styles.cardheader}>
            <Image
              source={localImage.avt}
              style={styles.profileImage}
              resizeMode="contain"
            />
            <View style={styles.textcontainer}>
              <Text style={styles.nameText}>Hello, Good Morning</Text>
              <Text style={styles.subText}>Jamie !</Text>
            </View>
            <Image
              source={localImage.BELL}
              style={styles.bellImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.circle} />
        </ImageBackground>
        <View style={styles.dailyContainer}>
          <Text style={styles.dailyText}>Daily progress</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginLeft: 0,
              marginRight: 0,
            }}>
            <Calories type={'Calories'} />
            <Calories type={'Steps'} />
          </View>
        </View>
        <View style={styles.dailyContainer}>
          <Text style={styles.dailyText}>My workout</Text>
          <FlatList
            data={IntroductionData}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {}}
                  style={{marginTop: 10}}
                  activeOpacity={0.7}>
                  <ImageBackground
                    source={localImage.Inrtoduction3}
                    style={[
                      styles.card,
                      {
                        borderRadius: 20,
                        overflow: 'hidden',
                        margin: 5,
                        resizeMode: 'contain',
                        width: DeviceWidth * 0.91,
                      },
                    ]}>
                    <View style={styles.LinearG}>
                      <View style={styles.TitleText}>
                        <Text style={styles.Text}>{item.text1}</Text>
                        <Text
                          style={[
                            styles.Text,
                            {fontSize: 14, fontWeight: 'bold'},
                          ]}>
                          {' '}
                          {item.text2}
                        </Text>
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <View style={[styles.dailyContainer, {marginTop: 20}]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.dailyText}>Workout Categories</Text>
            <Text style={styles.seeAll} onPress={() => {}}>
              See all
            </Text>
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={[
                styles.Buttons,
                selectedButton == '1' ? {backgroundColor: AppColor.RED} : null,
              ]}
              onPress={() => {
                handleButtonColor('1');
              }}>
              <Text
                style={[
                  ,
                  selectedButton == '1'
                    ? {color: AppColor.WHITE}
                    : {color: AppColor.INPUTTEXTCOLOR},
                  {fontFamily: 'Montserrat'},
                ]}>
                Beginner
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.Buttons,
                selectedButton == '2' ? {backgroundColor: AppColor.RED} : null,
              ]}
              onPress={() => {
                handleButtonColor('2');
              }}>
              <Text
                style={[
                  ,
                  selectedButton == '2'
                    ? {color: AppColor.WHITE}
                    : {color: AppColor.INPUTTEXTCOLOR},
                  {fontFamily: 'Montserrat'},
                ]}>
                Intermediate
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.Buttons,
                selectedButton == '3' ? {backgroundColor: AppColor.RED} : null,
              ]}
              onPress={() => {
                handleButtonColor('3');
              }}>
              <Text
                style={[
                  ,
                  selectedButton == '3'
                    ? {color: AppColor.WHITE}
                    : {color: AppColor.INPUTTEXTCOLOR},
                  {fontFamily: 'Montserrat'},
                ]}>
                Advance
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={IntroductionData}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {}}
                  style={{marginTop: 10, paddingBottom: DeviceHeigth * 0.03}}
                  activeOpacity={0.7}>
                  <ImageBackground
                    source={localImage.Inrtoduction3}
                    style={[
                      styles.card,
                      {
                        borderRadius: 20,
                        overflow: 'hidden',
                        margin: 5,
                        resizeMode: 'contain',
                        width: DeviceWidth * 0.91,
                      },
                    ]}>
                    <View style={styles.LinearG}>
                      <View style={styles.TitleText}>
                        <Text style={styles.Text}>{item.text1}</Text>
                        <Text
                          style={[
                            styles.Text,
                            {fontSize: 14, fontWeight: 'bold'},
                          ]}>
                          {' '}
                          {item.text2}
                        </Text>
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    height: DeviceHeigth * 0.2,
    alignSelf: 'center',
    marginTop: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,

    left: -40,
    top: DeviceHeigth * 0.01,
  },
  cardheader: {
    top: DeviceHeigth * 0.02,
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 50,
  },
  textcontainer: {
    left: -30,
    top: DeviceHeigth * 0.01,
  },
  nameText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    fontWeight: '500',
    color: AppColor.INPUTLABLECOLOR,
    lineHeight: 18,
  },
  subText: {
    fontSize: 20,
    fontFamily: 'Verdana',
    fontWeight: '400',
    color: AppColor.LITELTEXTCOLOR,
    lineHeight: 24,
  },
  bellImage: {
    width: 30,
    height: 30,
    right: -DeviceWidth * 0.1,
    top: -DeviceHeigth * 0.05,
  },
  circle: {
    width: 7,
    height: 7,
    backgroundColor: '#B0C929',
    borderRadius: 5.5 / 2,
    position: 'absolute',
    right: DeviceWidth * 0.04,
    top: DeviceHeigth * 0.03,
  },
  dailyContainer: {
    top: DeviceHeigth * 0.02,
    marginHorizontal: DeviceWidth * 0.04,
  },
  dailyText: {
    fontSize: 15,
    fontFamily: 'Verdana',
    fontWeight: '700',
    color: AppColor.LITELTEXTCOLOR,
    lineHeight: 24,
  },
  Text: {
    color: 'white',
    fontFamily: 'Poppins',
    fontWeight: '600',
    marginLeft: 15,
    fontSize: 18,
    marginBottom: 5,
    width: (DeviceWidth * 70) / 100,
  },
  TextDesign: {
    borderRadius: 8,
    overflow: 'hidden',
    margin: 15,
    resizeMode: 'contain',
  },
  LinearG: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    height: (DeviceHeigth * 20) / 100,
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  FlatListView: {
    marginBottom: (DeviceHeigth * 2) / 100,
    flex: 1,
  },
  TitleText: {
    flexDirection: 'column',
  },
  seeAll: {
    fontSize: 15,
    fontFamily: 'Poppins',
    fontWeight: '400',
    color: '#191919',
    lineHeight: 18,
    textDecorationLine: 'underline',
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: DeviceHeigth * 0.02,
    marginHorizontal: DeviceWidth * 0.05,
  },
  Buttons: {
    width: DeviceWidth / 3.8,
    height: (DeviceHeigth * 4.5) / 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
});
export default Home;
