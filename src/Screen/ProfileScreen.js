import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ToastAndroid,
  StatusBar,
  Alert,
  ImageBackground,
  Modal
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch';
import {localImage} from '../Component/Image';
import {DeviceHeigth, DeviceWidth, Api, Appapi} from '../Component/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import CustomStatusBar from '../Component/CustomStatusBar';
import axios from 'axios';
import {defaultFallbackFonts} from 'react-native-render-html';
import Icons from 'react-native-vector-icons/AntDesign';
const ProfileScreen = () => {
  const [mydata, setMyData] = useState();
  const navigation = useNavigation();
  const {defaultTheme} = useSelector(state => state);
  const [UpdateScreenVisibility,setUpadteScreenVisibilty]=useState(false)
  const [data, setData] = useState([
    {
      id: 1,
      icon: (
        <Image
          source={localImage.dw1}
          style={{width: 25, height: 20}}
          tintColor={defaultTheme ? '#fff' : '#535763'}
          resizeMode="contain"
        />
      ),
      itemData: 'My Workouts',
    },
    {
      id: 2,
      icon: (
        <Image
          source={localImage.dw3}
          style={{width: 25, height: 20}}
          tintColor={defaultTheme ? '#fff' : '#535763'}
          resizeMode="contain"
        />
      ),
      itemData: 'My Diets',
    },
    {
      id: 3,
      icon: (
        <Icon
          name="heart-outline"
          size={22}
          color={defaultTheme ? '#fff' : '#535763'}
        />
      ),
      itemData: 'Favorites',
    },
    {
      id: 4,
      icon: (
        <Icon
          name="bookmark-outline"
          size={22}
          color={defaultTheme ? '#fff' : '#535763'}
        />
      ),
      itemData: 'About Us',
    },
    {
      id: 5,
      icon: (
        <Icon
          name="file-document-outline"
          size={22}
          color={defaultTheme ? '#fff' : '#535763'}
        />
      ),
      itemData: 'Privacy & Terms',
    },
    {
      id: 6,
      icon: (
        <Icon
          name="logout"
          size={22}
          color={defaultTheme ? '#fff' : '#535763'}
        />
      ),
      itemData: 'Sign Out',
    },
    {
      id: 7,
      icon: (
        <Icon
          name="account-cancel-outline"
          size={22}
          color={defaultTheme ? '#fff' : '#535763'}
        />
      ),
      itemData: 'Delete My Account',
    },
  ]);
  useEffect(() => {
    getMydata();
    console.log('data', mydata);
  }, []);
  const getMydata = async () => {
    setMyData(JSON.parse(await AsyncStorage.getItem('Data')));
  };
  const removeData = async () => {
    try {
      await AsyncStorage.removeItem('Data');
      navigation.navigate('Login');
    } catch (error) {
      console.log(Error1);
    }
  };
  const DeleteAccount = async () => {
    try {
      const Storeddata = await AsyncStorage.getItem('Data');
      if (Storeddata !== null) {
        const JASONData = JSON.parse(Storeddata);
        const Id = JASONData[0].email;
        const Msg = await axios(`${Api}/${Appapi.DeleteAccount}?email=${Id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (Msg.data) {
          try {
            await AsyncStorage.removeItem('Data');
            navigation.navigate('Login');
            showMessage({
              message: Msg.data[0].user,
              type: 'success',
              icon: {icon: 'auto', position: 'left'},
            });
          } catch (error) {}
        }
      } else {
        console.log('data not found');
      }
    } catch (error) {
      console.log('ERROR', error);
    }
  };
  const ScreenChange = item => {
    switch (item.item.id) {
      case 1:
        navigation.navigate('MyWorkouts');
        break;
      case 2:
        navigation.navigate('MyDiets');
        break;
      case 3:
        navigation.navigate('FavoritesRouter');
        break;
      case 4:
        navigation.navigate('AboutUs');
        break;
      case 5:
        navigation.navigate('Privacy');
        break;
      case 6:
        removeData();
        break;
      case 7:
        Alert.alert('Are you sure you want to delete your Account ?', '', [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Yes',
            onPress: () => {
              DeleteAccount();
            },
          },
        ]);
    }
  };
  const UpdateProfile=()=>{
    return(
      <View
      style={{
        flex: 1,
        backgroundColor: defaultTheme ? '#000' : '#fff',
        position: 'absolute',
      }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => {
          setUpadteScreenVisibilty(false);
        }}>
        <View
          style={[
            styles.modalContainer,
            {backgroundColor: 'transparent', flex: 1},
          ]}>
          <View style={[styles.modalContent ,{backgroundColor:defaultTheme?"#000":"#fff"}]}>
          <View
                  style={[
                    styles.closeButton,
                    ,
                    {
                      width: (DeviceWidth * 85) / 100,
                      marginTop: 8,
                      backgroundColor: defaultTheme ? '#000' : 'fff',
                    },
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      setUpadteScreenVisibilty(false);
                    }}>
                    <Icons
                      name="close"
                      size={27}
                      color={defaultTheme ? '#fff' : '#000'}
                    />
                  </TouchableOpacity>
                </View>
           <Text>Edit Screen</Text>
          </View>
        </View>
      </Modal>
    </View>
    )
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: defaultTheme == true ? '#000' : '#fff',
      }}>
      {Platform.OS == 'android' ? (
        <>
          <StatusBar
            barStyle={defaultTheme ? 'light-content' : 'dark-content'}
            backgroundColor={'#C8170D'}
          />
        </>
      ) : (
        <>
          <CustomStatusBar />
        </>
      )}
      <HeaderWithoutSearch Header={'Profile'} />
      <View style={styles.container1}>
        <ImageBackground source={localImage.avt} style={styles.Icon}>
          <View
            style={{
              // borderWidth: 1,
              width: 125,
              height: 125,
              borderRadius: 120 / 2,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',

              borderColor: '#000',
            }}>
            <TouchableOpacity onPress={()=>{setUpadteScreenVisibilty(true)}}>
              <Icons name="edit" size={25} color={'rgba(0,0,0,1)'} />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {!!mydata && (
          <>
            <Text
              style={[
                styles.textStyle,
                {color: defaultTheme == true ? '#fff' : '#000'},
              ]}>
              {mydata[0].name}
            </Text>
            <Text style={{color: defaultTheme == true ? '#fff' : '#000'}}>
              {mydata[0].email}
            </Text>
          </>
        )}
      </View>
      <View
        style={{justifyContent: 'center',flex:1}}>
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
                <Text
                  style={{
                    color: defaultTheme == true ? '#fff' : '#000',
                    fontSize: 15,
                  }}>
                  {element.item.itemData}
                </Text>
                <Image
                  source={localImage.nextButton}
                  style={[styles.nextIcon]}
                  tintColor={defaultTheme ? '#fff' : '#535763'}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      {UpdateScreenVisibility?<UpdateProfile/>:null}
    </View>
  );
};
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
    borderRadius: 130 / 2,
    // overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 15,
    fontWeight: '700',
    marginVertical: (DeviceHeigth * 2) / 100,
  },
  nextIcon: {
    tintColor: '#C8170D',
    resizeMode: 'contain',
    height: (DeviceHeigth * 1.5) / 100,
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  modalContent: {
    height: DeviceHeigth / 3.5,
    width: '90%',
    backgroundColor: 'white',
 
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',
    bottom: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  modalContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //marginHorizontal: 15,
  },
  closeButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
export default ProfileScreen;
