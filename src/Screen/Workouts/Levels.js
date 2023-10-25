import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import Header from '../../Component/Header'
import { DeviceHeigth, DeviceWidth } from '../../Component/Config';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Loader from '../../Component/Loader';
import { useSelector } from 'react-redux'
import { Api, Appapi } from '../../Component/Config';
const Levels = () => {
  const [ApiData, setApiData] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const { defaultTheme } = useSelector(state => state)
  const navigation = useNavigation()
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const data = await axios(`${Api}/${Appapi.levels}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'Multipart/form-data',
        },
      });
      setApiData(data.data);
      setIsLoaded(true);
    } catch (error) { }
  };
  if (isLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: defaultTheme == true ? "#000" : "#fff" }}>
        <Header
          header={'Levels'}
          iconName={'magnify'}
        />
        <View
          style={{
            width: DeviceWidth,
            height: (DeviceHeigth * 90) / 100,
          }}>
          <FlatList
            data={ApiData}
            renderItem={elements => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("SingleLevel", { level: elements.item.title });
                }}>
                <ImageBackground
                  source={{ uri: elements.item.image }}
                  style={styles.FlatListImg}>
                  <View
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      height: (DeviceHeigth * 20) / 100,
                      width: DeviceWidth,
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}>
                    {/* <LinearGradient colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)']}> */}
                    <View style={styles.orangeLine} />
                  </View>
                  <View style={styles.TextView}>
                    <Text style={styles.text}>{elements.item.title}</Text>
                  </View>
                  {/* </LinearGradient>  */}
                </ImageBackground>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
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
    flex: 1,
  },
  FlatListImg: {
    height: (DeviceHeigth * 20) / 100,
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    resizeMode: 'contain',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '400',
  },
  TextView: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 1,
    width: (DeviceWidth * 96) / 100,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orangeLine: {
    width: 55,
    height: 3,
    backgroundColor: '#f39c1f',
  },
});
export default Levels