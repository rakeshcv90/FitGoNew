import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColor} from '../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import Signup from './Signup';
import CustomSwitch from '../Component/CustomSwitch';
import Login from './Login';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {NavigationContainer} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
const Tab = createMaterialTopTabNavigator();
const LogSignUp = () => {
  const [showLogin, setShowLogin] = useState(1);
  const onSelectSwitch = index => {
    setShowLogin(index);
  };

  function MyTabBar({state, descriptors, navigation}) {
    return (
      <View style={[styles.tabbar_part]}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({name: route.name, merge: true});
            }
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={{
                flex: 1,
                justifyContent: 'center',
              }}>
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                colors={
                  isFocused ? ['#941000', '#D01818'] : ['#D9D9D9', '#D9D9D9']
                }
                style={{
                  borderRadius: isFocused ? 30 : 30,
                  justifyContent: 'center',
                  //width: DeviceHeigth * 0.13,
                  height: DeviceHeigth * 0.043,
                }}>
                <Text
                  style={{
                    fontWeight: isFocused ? '600' : '400',
                    fontSize: 15,
                    textAlign: 'center',
                    fontFamily: 'Poppins',
                    color: isFocused ? 'white' : 'black',
                  }}>
                  {label}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <View style={styles.TextContainer}>
        <Text style={styles.LoginText2}>{'Hey there,'}</Text>
        <Text style={styles.LoginText}>Welcome</Text>
      </View>
      <Tab.Navigator
        screenOptions={{
          activeTintColor: 'red',
          inactiveTintColor: 'gray',
          labelStyle: {
            fontSize: 16,
            fontWeight: 'bold',
          },
        }}
        tabBar={props => <MyTabBar {...props} />}>
        <Tab.Screen
          name={'Log In'}
          component={Login}
          //initialParams={{index: ind}}
        />
        <Tab.Screen name={'Sign Up'} component={Signup} />
      </Tab.Navigator>
      {/* <View
            style={{
              marginTop: DeviceHeigth * 0.02,
            }}>
            <CustomSwitch
              selectionMode={1}
              roundCorner={true}
              option1={'Log In'}
              option2={'Sign Up'}
              onSelectSwitch={onSelectSwitch}
            />
          </View>
          {showLogin==1?<Login/>:   <Signup/>} */}
    </SafeAreaView>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  TextContainer: {
    marginTop: DeviceHeigth * 0.06,
    marginHorizontal: DeviceHeigth * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
  },
  LoginText: {
    fontSize: 20,
    fontFamily: 'Verdana',
    color: AppColor.LITELTEXTCOLOR,
    fontWeight: '600',
    marginTop: 10,
  },
  LoginText2: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',

    color: '#3A4750',
    lineHeight: 20,
    letterSpacing: 0,
  },
  tabContainer: {
    flexDirection: 'row',
    height: 80,
    //elevation: 8,
    // backgroundColor: AppColor.WHITE,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellImage: {
    width: 50,
    height: 50,
  },
  tabbar_part: {
    flexDirection: 'row',
    marginTop: 20,
    width: DeviceHeigth * 0.27,
    height: DeviceHeigth * 0.045,
    alignSelf: 'center',
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: AppColor.GRAY2,
  },
});
export default LogSignUp;
