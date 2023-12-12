import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import React from 'react';
import NewHeader from '../Component/Headers/NewHeader';
import ActivityLoader from '../Component/ActivityLoader';
import {localImage} from '../Component/Image';
import {AppColor} from '../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import { StatusBar } from 'react-native';

const AppNotification = ({navigation}) => {
  const IntroductionData = [
    {
      id: 1,
      text1: 'Hey, it’s time for lunch',
      text2: 'About 1 minutes ago',
      img: localImage.Inrtoduction1,
    },
    {
      id: 2,
      text1: 'Don’t miss your lowerbody workout',
      text2: 'About 1 minutes ago',
      img: localImage.Inrtoduction2,
    },
    {
      id: 3,
      text1: 'Don’t miss your lowerbody workout',
      text2: 'About 1 minutes ago',
      img: localImage.Inrtoduction3,
    },
    {
      id: 4,
      text1: 'Hey, it’s time for lunch',
      text2: 'About 1 minutes ago',
      img: localImage.Inrtoduction3,
    },
  ];
  return (
    <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <NewHeader header={'Notification'} backButton />
      {/* {isLoaded ? <ActivityLoader /> : ''} */}

      <View>
        <FlatList
          data={IntroductionData}
          renderItem={({item, index}) => {
            return (
              <View>
              <TouchableOpacity
                onPress={() => {}}
                style={{marginTop:DeviceHeigth*0.03}}
                activeOpacity={0.7}>
                <View style={styles.LinearG}>
                  <Image
                    source={localImage.avt}
                    style={styles.profileImage}
                    resizeMode="contain"
                  />
                  <View >
                    <Text style={styles.text2} >{item.text1}</Text>
                    <Text style={styles.text3}>{item.text2}</Text>
                  </View>
                </View>

              </TouchableOpacity>
              <View style={{ marginTop: 20,height:1,backgroundColor:AppColor.GRAY1}}></View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
  },
  LinearG: {
    flexDirection: 'row',
    marginLeft: 15,
  },
  text3: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '400',
    color: AppColor.DARKGRAY,
    lineHeight: 21,
    marginLeft: 15,
  
  },
 
  text2: {
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: AppColor.BLACK,
    lineHeight: 30,
    marginLeft: 15,
  },
});
export default AppNotification;
