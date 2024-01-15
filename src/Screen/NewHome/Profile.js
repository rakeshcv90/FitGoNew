import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import LinearGradient from 'react-native-linear-gradient';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {Switch} from 'react-native-switch';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setLogout} from '../../Component/ThemeRedux/Actions';
import {CommonActions} from '@react-navigation/native';
const Profile = () => {
  const dispatch = useDispatch();
  const {getUserDataDetails} = useSelector(state => state);

  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const Profile_Data = [
    {
      id: 1,
      icon1: (
        <Image
          source={localImage.Profile4}
          style={[styles.IconView, {height: 24, width: 23}]}
          resizeMode="contain"
        />
      ),
      text1: 'Personal Details',
    },
    {
      id: 2,
      icon1: (
        <Image
          source={localImage.Documents}
          style={[styles.IconView, {height: 23, width: 23}]}
          resizeMode="contain"
        />
      ),
      text1: 'My plans',
    },
    {
      id: 3,
      icon1: (
        <Image
          source={localImage.Heart}
          style={[styles.IconView, {height: 17, width: 21}]}
          resizeMode="contain"
        />
      ),
      text1: 'My Favorites',
    },
    {
      id: 4,
      icon1: (
        <Image
          source={localImage.Backupimg}
          style={[styles.IconView, {height: 18, width: 22}]}
          resizeMode="contain"
        />
      ),
      text1: 'Backup',
    },
    {
      id: 5,
      icon1: (
        <Image
          source={localImage.reminder}
          style={[styles.IconView, {height: 27, width: 22}]}
          resizeMode="contain"
        />
      ),
      text1: 'Workout Reminder',
    },
    {
      id: 6,
      icon1: (
        <Image
          source={localImage.Soundimg}
          style={[styles.IconView, {height: 15, width: 22}]}
          resizeMode="contain"
        />
      ),
      text1: 'Sound Options',
    },
    {
      id: 7,
      icon1: (
        <Image
          source={localImage.Message}
          style={[styles.IconView, {height: 20, width: 22}]}
          resizeMode="contain"
          tintColor={AppColor.RED}
        />
      ),
      text1: 'Contact Us',
    },
    {
      id: 8,
      icon1: (
        <Image
          source={localImage.Shield}
          style={[styles.IconView, {height: 24, width: 22}]}
          resizeMode="cover"
        />
      ),
      text1: 'Privacy Policy',
    },
    {
      id: 9,
      icon1: (
        <Image
          source={localImage.RateStar}
          style={[styles.IconView, {height: 35, width: 22}]}
          resizeMode="contain"
        />
      ),
      text1: 'Rate Us',
    },
    {
      id: 10,
      icon1: (
        <Image
          source={localImage.DeleteAcc}
          style={[styles.IconView, {height: 29, width: 22}]}
          resizeMode="contain"
        />
      ),
      text1: 'Delete Account',
    },
  ];
  const FirstView = Profile_Data.slice(0, 6);
  const SecondView = Profile_Data.slice(6);

  const ProfileView = () => {
    const handleLogout = async () => {
      // Clear AsyncStorage
      try {
        await AsyncStorage.clear();
      } catch (error) {
        console.error('Error clearing AsyncStorage:', error);
      }

      navigateToLogin(navigation);

      dispatch(setLogout());
    };
    const navigateToLogin = navigation => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'LogSignUp'}],
        }),
      );
    };
    return (
      <View>
        <LinearGradient
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          colors={['#D5191A', '#941000']}
          style={{height: DeviceHeigth * 0.4, width: DeviceWidth}}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              margin: 15,
              alignItems: 'center',
            }}>
            <TouchableOpacity
            onPress={()=>{
            navigation.goBack()
            }}
              style={{
                width: DeviceWidth * 0.23,
                paddingVertical: 1,
              }}>
              <Icons name="chevron-left" size={30} color={AppColor.WHITE} />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 20,
                color: AppColor.WHITE,
              }}>
              {'Profile'}
            </Text>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  handleLogout();
                  navigation.navigate('SplaceScreen');
                }}
                activeOpacity={0.5}
                style={{
                  width: DeviceWidth * 0.2,
                  borderWidth: 1,
                  borderRadius: 20,
                  borderColor: AppColor.WHITE,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                    color: AppColor.WHITE,
                    paddingVertical: 1.3,
                  }}>
                  {'Sign out'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.profileView}>
            <Image
              source={localImage.avt}
              style={styles.img}
              resizeMode="cover"></Image>
            <TouchableOpacity style={styles.ButtonPen} activeOpacity={0.6}>
              <Image
                source={localImage.Pen}
                style={styles.pen}
                resizeMode="cover"
                tintColor={AppColor.WHITE}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: DeviceHeigth * 0.05,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                color: AppColor.WHITE,
                fontSize: 20,
                paddingLeft: 15,
              }}>
              {getUserDataDetails.name}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                color: AppColor.WHITE,
                fontSize: 12,
                paddingLeft: 15,
              }}>
              {getUserDataDetails.email}
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  };
  const profileViewHeight = DeviceHeigth * 0.4;
  return (
    <SafeAreaView style={styles.Container}>
      <ProfileView />
      <View
        style={[
          styles.UserDetailsView,
          {
            top: -profileViewHeight * 0.1,
          },
        ]}>
        {FirstView.map((value, index) => (
          <TouchableOpacity
            activeOpacity={value.id == 4 || value.id == 5 ? 1 : 0.5}
            key={index}
            style={styles.SingleButton}
            navigation
            onPress={() => {
              if(value.text1=='Personal Details'){
                navigation.navigate('NewPersonalDetails');
              }else{
                showMessage({
                  message: 'Work In Progress',
                  type: 'info',
                  animationDuration: 500,
        
                  floating: true,
                  icon: {icon: 'auto', position: 'left'},
                });
              }
           
            
            }}>
            {value.icon1}
            <View style={styles.View1}>
              <Text style={styles.nameText}>{value.text1}</Text>
              {value.id == 4 || value.id == 5 ? (
                <Switch
                  value={isEnabled}
                  onValueChange={() => toggleSwitch()}
                  disabled={false}
                  circleSize={19}
                  barHeight={21}
                  circleBorderWidth={0.1}
                  backgroundActive={AppColor.RED1}
                  backgroundInactive={AppColor.GRAY2}
                  circleActiveColor={AppColor.RED}
                  circleInActiveColor={AppColor.WHITE}
                  changeValueImmediately={true}
                  outerCircleStyle={{color: AppColor.RED}}
                  renderActiveText={false}
                  renderInActiveText={false}
                  switchLeftPx={2}
                  switchRightPx={2}
                  switchWidthMultiplier={2.2}
                  switchBorderRadius={30}
                />
              ) : value.id == 6 ? (
                <View style={{width: 20, height: 20}}></View>
              ) : (
                <Icons
                  name="chevron-right"
                  size={22}
                  color={AppColor.DARKGRAY}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.UserDetailsView, {marginBottom: 10}]}>
          {SecondView.map((value, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.SingleButton, {}]}
              navigation
              onPress={() => {
                // navigation.navigate('Personal Details');
              }}>
              {value.icon1}
              <View style={styles.View1}>
                <Text style={styles.nameText}>{value.text1}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: AppColor.BACKGROUNG,
  },
  ProfileImg: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
  },
  DetailView: {
    marginVertical: DeviceHeigth * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: DeviceWidth * 0.02,
  },
  Button: {
    width: DeviceWidth * 0.21,
    height: DeviceHeigth * 0.033,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextView: {
    marginLeft: -20,
  },
  buttonStyle: {
    width: DeviceWidth * 0.21,
    height: DeviceHeigth * 0.03,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  EditText: {
    color: AppColor.WHITE,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
  },
  NameText: {
    fontFamily: 'Poppins-SemiBold',
    color: AppColor.INPUTTEXTCOLOR,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
  },
  nameText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
    color: AppColor.ProfileTextColor,
  },
  IconView: {
    // width: 22,
    // height: 22,
  },
  UserDetailsView: {
    backgroundColor: AppColor.WHITE,
    borderRadius: 12,
    marginHorizontal: DeviceWidth * 0.04,
    marginBottom: -DeviceHeigth * 0.01,
    paddingVertical: DeviceHeigth * 0.02,
    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowColor: AppColor.DARKGRAY,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
        shadowColor: AppColor.DARKGRAY,
      },
    }),
  },
  userDetailsText: {
    // fontFamily: '',
  },
  SingleButton: {
    // justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  View1: {
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    margin: 8,
  },
  profileView: {
    height: 100,
    width: 100,
    borderRadius: 160 / 2,
    alignSelf: 'center',
  },
  img: {
    height: 120,
    width: 120,
    borderRadius: 160 / 2,
  },
  pen: {
    width: 35,
    height: 35,
  },
  ButtonPen: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    position: 'absolute',
    bottom: -22,
    right: -8,
    backgroundColor: AppColor.RED,
  },
});
export default Profile;
