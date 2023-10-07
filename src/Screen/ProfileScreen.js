import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    SafeAreaView
} from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch';
import { localImage } from '../Component/Image';
import { DeviceHeigth, DeviceWidth } from '../Component/Config'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux'
const ProfileScreen = () => {
    const [mydata, setMyData] = useState();
    const navigation = useNavigation();
    const {defaultTheme}=useSelector((state)=>state)
    const [data, setData] = useState([
      {
        id: 1,
        icon: <Icon name="dumbbell" size={20} color="#ec9706" />,
        itemData: 'My Workouts',
      },
      {
        id: 2,
        icon: <Icon name="silverware-fork-knife" size={20} color="#ec9706" />,
        itemData: 'My Diets',
      },
      {
        id: 3,
        icon: <Icon name="heart-outline" size={20} color="#ec9706" />,
        itemData: 'Favorites',
      },
      {
        id: 4,
        icon: <Icon name="bookmark-outline" size={20} color="#ec9706" />,
        itemData: 'About Us',
      },
      {
        id: 5,
        icon: <Icon name="file-document-outline" size={20} color="#ec9706" />,
        itemData: 'Privacy & Terms',
      },
      {
        id: 6,
        icon: <Icon name="logout" size={20} color="#ec9706" />,
        itemData: 'Sign Out',
      },
      {
        id: 7,
        icon: <Icon name="account-cancel-outline" size={20} color="#ec9706" />,
        itemData: 'Delete My Account',
      },
    ]);
    useEffect(() => {
      getMydata();
    }, []);
    const getMydata = async () => {
      setMyData(JSON.parse(await AsyncStorage.getItem('Data')));
      console.log(mydata[0].name)
    };
    const removeData = async () => {
      try {
        await AsyncStorage.removeItem('Data');
        navigation.navigate('Login');
      } catch (error) {}
    };
    const ScreenChange = item => {
      switch (item.item.id) {
        case 1:
          navigation.navigate('MyWorkouts');
          break;
        case 2:
          navigation.navigate('myDiet');
          break;
        case 3:
          navigation.navigate('Favorites');
          break;
        case 4:
          navigation.navigate("AboutUs");
          break;
        case 5:
          navigation.navigate('Privacy');
          break;
        case 6:
          removeData();
      }
    };
    return (
        <SafeAreaView style={{flex: 1,backgroundColor:defaultTheme==true?"#000":"#fff"}}>
      <HeaderWithoutSearch Header={"Profile"}/>
        <View style={styles.container1}>
          <Image source={localImage.maleIcon} style={styles.Icon} />
          {!!mydata && (
            <>
              <Text style={[styles.textStyle,{color:defaultTheme==true?"#fff":"#000"}]}>{mydata[0].name}</Text>
              <Text style={{color:defaultTheme==true?"#fff":"#000"}}>{mydata[0].email}</Text>
            </>
          )}
        </View>
        <View
          style={{justifyContent: 'center', height: (DeviceHeigth * 50) / 100}}>
          <FlatList
            data={data}
            renderItem={element => (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  margin: 25,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
                onPress={() => {
                  ScreenChange(element);
                }}>
                <View style={{marginRight: 20, marginLeft: 20}}>
                  {element.item.icon}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: (DeviceWidth * 75) / 100,
                  }}>
                  <Text style={{color: defaultTheme==true?"#fff":"#000", fontSize: 15}}>
                    {element.item.itemData}
                  </Text>
                  <Image source={localImage.nextButton} style={styles.nextIcon} />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container1: {
      width: DeviceWidth,
      marginTop: (DeviceHeigth * 5) / 100,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: (DeviceHeigth * 5) / 100,
    },
    Icon: {
      width: 120,
      height: 120,
      resizeMode: 'contain',
      borderRadius: 130 / 2,
      overflow: 'hidden',
    },
    textStyle: {
      fontSize: 15,
      fontWeight: '700',
      marginVertical: (DeviceHeigth * 2) / 100,
    },
    nextIcon: {
      tintColor: '#ec9706',
      resizeMode: 'contain',
      height: (DeviceHeigth * 1.5) / 100,
      alignSelf: 'flex-end',
      flexDirection: 'row',
    },
  });
export default ProfileScreen