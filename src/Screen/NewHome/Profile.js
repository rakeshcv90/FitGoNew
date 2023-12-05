import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
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
  return (
    <ScrollView style={styles.Container}>
      <NewHeader backButton header={'Profile'} />
      <View style={styles.DetailView}>
        <Image
          source={localImage.Inrtoduction1}
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
            navigation.navigate('Edit_Profile');
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
          <TouchableOpacity key={index} style={styles.SingleButton} onPress={()=>{navigation.navigate(data.text1,{title:data.text1})}}>
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
          <TouchableOpacity key={index} style={styles.SingleButton} >
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
    ...Platform.select({
      ios: {
        shadowColor: AppColor.BLACK,
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.4,
      },
      android: {
        elevation: 0,
        shadowColor: AppColor.BLACK,
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.5,
      },
    }),
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
});
export default Profile;
