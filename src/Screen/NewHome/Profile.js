import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import React from 'react';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import NewHeader from '../../Component/Headers/NewHeader';
import LinearGradient from 'react-native-linear-gradient';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
const Profile = () => {
  const navigation = useNavigation();
  const Profile_Data = [
    {
      icon1: (
        <Image
          source={localImage.Profile4}
          style={styles.IconView}
          resizeMode="contain"
        />
      ),
      text1: 'Personal Details',
    },
    {
      icon1: (
        <Image
          source={localImage.Documents}
          style={styles.IconView}
          resizeMode="contain"
        />
      ),
      text1: 'My plans',
    },
    {
      icon1: (
        <Image
          source={localImage.Heart}
          style={styles.IconView}
          resizeMode="contain"
        />
      ),
      text1: 'My Favorites',
    },
    {
      icon1: (
        <Image
          source={localImage.History}
          style={styles.IconView}
          resizeMode="contain"
        />
      ),
      text1: 'Workout History',
    },
    {
      icon1: (
        <Image
          source={localImage.reminder}
          style={styles.IconView}
          resizeMode="contain"
        />
      ),
      text1: 'Reminder',
    },
    {
      icon1: (
        <Image
          source={localImage.reminder}
          style={styles.IconView}
          resizeMode="contain"
        />
      ),
      text1: 'Reminder',
    },
    {
      icon1: (
        <Image
          source={localImage.reminder}
          style={styles.IconView}
          resizeMode="contain"
        />
      ),
      text1: 'Reminder',
    },
    {
      icon1: (
        <Image
          source={localImage.reminder}
          style={styles.IconView}
          resizeMode="contain"
        />
      ),
      text1: 'Reminder',
    },
    {
      icon1: (
        <Image
          source={localImage.reminder}
          style={styles.IconView}
          resizeMode="contain"
        />
      ),
      text1: 'Reminder',
    },
    {
      icon1: (
        <Image
          source={localImage.reminder}
          style={styles.IconView}
          resizeMode="contain"
        />
      ),
      text1: 'Reminder',
    },
  ];
  const FirstView = Profile_Data.slice(0, 5);
  const SecondView = Profile_Data.slice(5);
  const ProfileView = () => {
    return (
      <View>
        <LinearGradient
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          colors={['#D5191A', '#941000']}
          style={{height: DeviceHeigth * 0.35, width: DeviceWidth}}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              margin: 15,
           
              alignItems: 'center',
            }}>
            <Icons name="chevron-left" size={30} color={AppColor.WHITE} />
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
              activeOpacity={0.5}
                style={{
                  // width: DeviceWidth * 0.15,
                  // height: DeviceHeigth * 0.03,
                  borderWidth: 1,
                  borderRadius: 20,
                  borderColor: AppColor.WHITE,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // position: 'absolute',
                  // right:10
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                    color: AppColor.WHITE,
                    paddingHorizontal:10,
                    paddingVertical:1
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
        <TouchableOpacity
          style={styles.ButtonPen}
          activeOpacity={0.6}
          >
          <Image
            source={localImage.Pen}
            style={styles.pen}
            resizeMode="cover"
            tintColor={AppColor.WHITE}
          />
        </TouchableOpacity>
      </View>
        </LinearGradient>
      </View>
    );
  };
  return (
    <View style={styles.Container}>
      {/* <StatusBar barStyle={'default'} translucent={true} backgroundColor={'transparent'}/> */}
      <ProfileView />
      <ScrollView
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.DetailView}>
          <Image
            source={localImage.BELL}
            style={styles.ProfileImg}
            resizeMode="cover"
          />
          <View style={styles.TextView}>
            <Text style={styles.NameText}>Jamie</Text>
            <Text style={styles.nameText}>abc@gmail.com</Text>
          </View>
          <TouchableOpacity
            style={[styles.Button, {backgroundColor: AppColor.RED}]}
            onPress={() => {
              navigation.navigate("NewEditProfile");
            }}>
            <LinearGradient
              start={{x: 1, y: 0}}
              end={{x: 0, y: 1}}
              colors={['#941000', '#D01818']}
              style={styles.buttonStyle}>
              <Text style={styles.EditText}>Edit</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.UserDetailsView}>
          {FirstView.map((data, index) => (
            <TouchableOpacity
              key={index}
              style={styles.SingleButton}
              navigation
              onPress={() => {
                navigation.navigate('Personal Details');
              }}>
              {data.icon1}
              <View style={styles.View1}>
                <Text style={styles.nameText}>{data.text1}</Text>
                <Icons name="chevron-right" size={22} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.UserDetailsView}>
          {SecondView.map((data, index) => (
            <TouchableOpacity key={index} style={styles.SingleButton}>
              {data.icon1}
              <View style={styles.View1}>
                <Text style={styles.nameText}>{data.text1}</Text>
                <Icons
                  name="chevron-right"
                  size={22}
                  color={AppColor.ProfileTextColor}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
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
    width: DeviceWidth * 0.05,
    height: DeviceHeigth * 0.03,
  },
  UserDetailsView: {
    backgroundColor: AppColor.WHITE,
    borderRadius: 12,
    marginHorizontal: DeviceWidth * 0.04,
    marginBottom: DeviceHeigth * 0.03,
    paddingVertical: DeviceHeigth * 0.02,
    shadowColor: 'rgba(0, 0, 0, 1)',
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
    // ...Platform.select({
    //   ios: {
    //    // shadowColor: AppColor.BLACK,
    //     shadowOffset: {width: 0, height: 10},
    //     shadowOpacity: 0.4,
    //   },
    //   android: {
    //     elevation: 0,
    //     shadowColor: AppColor.BLACK,
    //     shadowOffset: {width: 5, height: 5},
    //     shadowOpacity: 0.5,
    //   },
    // }),
  },
  userDetailsText: {
    fontFamily: '',
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
    // marginHorizontal: DeviceWidth * 0.06,
    // marginVertical: DeviceHeigth * 0.04,
    height: 100,
    width: 100,
    borderRadius: 160 / 2,
  },
  img: {
    height: 120,
    width: 120,
    borderRadius: 160 / 2,
  },
  pen: {
    width: 30,
    height: 30,
  },
  ButtonPen: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    position:'absolute',
    bottom:5,
    right:16,
    backgroundColor:AppColor.RED
    
  },
});
export default Profile;
