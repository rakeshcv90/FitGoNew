import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import {localImage} from '../Component/Image';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import CustomStatusBar from '../Component/CustomStatusBar';
const HomeScreenDrawer = () => {
  const navigation = useNavigation();
  const {defaultTheme} = useSelector(state => state);
  const [data, setData] = useState([
    {
      id: 1,
      ImageSource: localImage.dw1,
      title: 'Workouts',
    },
    {
      id: 2,
      ImageSource: localImage.dw2,
      title: 'Exercises',
    },
    {
      id: 3,
      ImageSource: localImage.dw3,
      title: 'Diets',
    },
    {
      id: 4,
      ImageSource: localImage.dw4,
      title: 'Store',
    },
    {
      id: 5,
      ImageSource: localImage.dw5,
      title: 'Blog',
    },
  ]);
  const screenChange = item => {
    if (item.item.id == 1) {
      navigation.navigate('Workouts');
    } else if (item.item.id == 2) {
      navigation.navigate('Exercises');
    } else if (item.item.id == 3) {
      navigation.navigate('Diets');
    } else if (item.item.id == 4) {
      navigation.navigate('Store');
    } else if (item.item.id == 5) {
      navigation.navigate('Blog');
    }
  };
  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: defaultTheme == true ? '#000' : '#fff',
        }}>
        <StatusBar
          barStyle={defaultTheme ? 'light-content' : 'dark-content'}
          backgroundColor={'#C8170D'}
        />

        <ImageBackground source={localImage.homeImg} style={styles.homeImg}>
          <View
            style={{
              width: DeviceWidth,
              height: (DeviceHeigth * 35) / 100,
              backgroundColor: 'rgba(0,0,0,0.3)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* <Image source={localImage.logo1} style={styles.homeLogo} /> */}
          </View>
        </ImageBackground>
        <View
          style={{
            justifyContent: 'center',
            height: DeviceHeigth,
            backgroundColor: defaultTheme ? '#000000' : '#ffffff',
          }}>
          <FlatList
            data={data}
            renderItem={elements => (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 5,
                  marginVertical: 20,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
                onPress={() => {
                  screenChange(elements);
                }}>
                <Image
                  style={{
                    marginRight: 20,
                    marginLeft: 20,
                    height: 28,
                    width:34,
                  }}
                  source={elements.item.ImageSource}
                  resizeMode='contain'
                  tintColor={defaultTheme?"#fff":'#535763' }
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: (DeviceWidth * 70) / 100,
                  }}>
                  <Text
                    style={{
                      color: defaultTheme?"#fff":'#535763' ,
                      fontSize: 18,
                      fontWeight:"600"
                    }}>
                    {elements.item.title}
                  </Text>
                  <Icons
                    name="chevron-right"
                    size={25}
                    color={defaultTheme?"#fff":'#535763' }
                  />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  homeImg: {
    width: DeviceWidth,
    height: (DeviceHeigth * 35) / 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeLogo: {
    width: (DeviceWidth * 45) / 100,
    height: (DeviceHeigth * 20) / 100,
    resizeMode: 'contain',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: (DeviceHeigth * 2) / 100,
  },
  viewMargin: {
    paddingRight: (DeviceWidth * 3) / 100,
    paddingLeft: (DeviceWidth * 5) / 100,
  },
  nextIcon: {
    // tintColor: 'gray',
    resizeMode: 'contain',
    height: (DeviceHeigth * 1.5) / 100,
  },
});
export default HomeScreenDrawer;
