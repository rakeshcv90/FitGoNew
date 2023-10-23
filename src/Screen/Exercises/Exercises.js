import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  FlatList,
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
const Exercises = () => {
  const numColomns = 2;
  const [ApiData, setApiData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigation = useNavigation();
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
      setApiData(data.data);
      // console.log(data.data.data);
      setIsLoaded(true);
    } catch (error) { }
  };
  if (isLoaded) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: defaultTheme == true ? "#000" : "#fff" }}>
        <HeaderWithoutSearch Header={"Exercises"} />
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={() => {
            navigation.navigate("Equipments")
          }}>
            <Icons name={'dumbbell'} size={20} color={'black'} />
            <Text style={styles.buttonText}> Exercises By Equipment</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: (DeviceWidth * 99) / 100,
            height: (DeviceHeigth * 80) / 100,
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
                        backgroundColor: '#f39c1f',
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
      </SafeAreaView>
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
    backgroundColor: '#f39c1f',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,


  },
  buttonText: {
    color: 'black',
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