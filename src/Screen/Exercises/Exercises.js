import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  FlatList,
  StatusBar,
  Dimensions
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import Header from '../../Component/Header';
import { DeviceHeigth, DeviceWidth } from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Api, Appapi } from '../../Component/Config';
import Loader from '../../Component/Loader';
import { useSelector } from 'react-redux'
import HeaderWithoutSearch from '../../Component/HeaderWithoutSearch';
import CustomStatusBar from '../../Component/CustomStatusBar';
const Exercises = () => {
  const numColomns = 2;
  const [ApiData, setApiData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigation = useNavigation();
  const [isEmpty, setIsEmpty] = useState(false)
  const { defaultTheme } = useSelector((state) => state)
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const data = await axios(`${Api}/${Appapi.BodyParts}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'Multipart/form-data',
        },
      });
      if (data.data.length > 0) {
        setApiData(data.data);
        setIsLoaded(true);
        setIsEmpty(false)
      }
      else {
        setIsEmpty(true)
        setIsLoaded(true)
      }
    } catch (error) { }
  };
  if (isLoaded && !isEmpty) {
    return (
      <View style={{ flex: 1, backgroundColor: defaultTheme == true ? "#000" : "#fff" }}>
        {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#C8170D'} /></> : <><CustomStatusBar /></>}
        <HeaderWithoutSearch Header={"Exercises"} />
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={() => {
            navigation.navigate("Equipments")
          }}>
            <Icons name={'dumbbell'} size={20} color={"#fff"} />
            <Text style={styles.buttonText}> Exercises By Equipment</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: (DeviceWidth * 99) / 100,
            // height: (DeviceHeigth * 88) / 100,
            // marginBottom:DeviceHeigth*0.12,
            flex:1
          }}>
          <FlatList
            data={ApiData}
            numColumns={numColomns}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ExerciseByBodyPart", { title: item.title })
                }}>
                <ImageBackground
                  source={{ uri: item.image }}
                  style={{
                    height: (DeviceHeigth * 20) / 100,
                    width: (DeviceWidth * 96) / 100 / numColomns,
                    borderRadius: 8,
                    overflow: 'hidden',
                    marginLeft: (DeviceWidth * 1) / 100,
                    marginRight: (DeviceWidth * 1) / 100,
                    marginVertical: (DeviceHeigth * 0.5) / 100,
                    paddingBottom: 1,
                  }}>
                  <View
                    style={{
                      justifyContent: 'flex-end',
                      borderWidth: 1,
                      height: (DeviceHeigth * 20) / 100,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                    }}>
                    <Text style={styles.Text}>{item.title}</Text>
                    <View
                      style={{
                        width: 25,
                        height: 3,
                        backgroundColor: '#C8170D',
                        marginLeft: 15,
                        marginBottom: 15,
                      }}
                    />
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    )
  }
  else if (isLoaded && isEmpty) {
    return (
      <View style={{ height: (DeviceHeigth * 90) / 100, backgroundColor: defaultTheme ? "#000" : "#fff", justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#C8170D', fontSize: 20, fontWeight: 'bold' }}>No Data Available</Text></View>
    )
  }
  else {
    return (
      <Loader />
    )
  }
}
const styles = StyleSheet.create({
  container: {
    width: (DeviceWidth * 96) / 100,
    height: (DeviceHeigth * 6) / 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    // borderWidth:1
  },
  button: {
    height: (DeviceHeigth * 4.5) / 100,
    width: (DeviceWidth * 96) / 100,
    marginVertical: 5,
    backgroundColor: '#C8170D',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,


  },
  buttonText: {
    color: "#fff",
    fontWeight: '500',
  },
  ExerciseIcon: {
    width: 25,
    height: 25,
    transform: [{ rotateZ: '45deg' }],
  },
  Text: {
    color: '#fff',
    fontFamily: 'serif',
    fontSize: 20,
    paddingLeft: 15,
    paddingBottom: 3,
  },
});
export default Exercises