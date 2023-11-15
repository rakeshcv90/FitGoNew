import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  StatusBar
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { DeviceWidth, DeviceHeigth } from '../../Component/Config';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Api, Appapi } from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import Loader from '../../Component/Loader';
import { useSelector } from 'react-redux';
import HeaderWithoutSearch from '../../Component/HeaderWithoutSearch';
import CustomStatusBar from '../../Component/CustomStatusBar';
const Diets = () => {
  const { defaultTheme } = useSelector((state) => state)
  const [ApiData, setApiData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEmpty, setISEmpty] = useState(false)
  const navigation = useNavigation();
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const data = await axios(`${Api}/${Appapi.Diets}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'Multipart/form-data',
        },
      });
      if (data.data.length > 0) {
        setApiData(data.data);
        setIsLoaded(true);
        setISEmpty(false)
      }
      else {
        setISEmpty(true);
        setIsLoaded(false)
      }

    } catch (error) { }
  };
  if (isLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: defaultTheme == true ? "#000" : "#fff" }}>
        {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#C8170D'} /></> : <><CustomStatusBar /></>}
        <HeaderWithoutSearch Header={"Diets"} />
        <TouchableOpacity style={styles.button} onPress={() => {
          navigation.navigate('DietCategory')
        }}>
          <Icons name="tag" size={15} color={"#fff"} />
          <Text style={styles.btnText}>Categories</Text>
        </TouchableOpacity>
        <View style={{flex:1, width: DeviceWidth, justifyContent: 'center', alignItems: 'center' }}>
          <FlatList data={ApiData} renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {
              navigation.navigate("DietDetail", { data: item })
            }}>
              <ImageBackground source={{ uri: item.image }} style={styles.imageBackground}>
                <View style={styles.text}>
                  <Text style={{ color: "#C8170D", marginLeft: 10, fontWeight: 'bold', fontSize: 16 }}>{item.category}</Text>
                  <Text style={{ color: '#fff', marginTop: 5, marginLeft: 10, fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
                  <Text style={{ color: '#fff', margin: 10, fontWeight: 'bold', fontSize: 13 }}>{item.calories} Kcal | Servings: {item.servings}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}></FlatList>
        </View>
      </View>

    )
  }
  else {
    return (
      <Loader />
    )
  };
};
const styles = StyleSheet.create({
  button: {
    width: (DeviceWidth * 96.5) / 100,
    height: (DeviceHeigth * 4.5) / 100,
    marginLeft: DeviceWidth * 2 / 100,
    marginVertical: DeviceHeigth * 2 / 100,
    marginRight: DeviceWidth * 2 / 100,
    marginBottom: DeviceHeigth * 2 / 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#C8170D",
    borderRadius: 8
  },
  catIcon: {
    height: DeviceHeigth * 4 / 100,
    width: DeviceWidth * 5 / 100,
    resizeMode: 'contain',
    marginRight: 5
  },
  btnText: {
    color: "#fff",
    fontWeight: 'bold',
    marginLeft: 10
  },
  imageBackground: {
    width: DeviceWidth * 95.5 / 100, height: DeviceHeigth * 20 / 100,
    margin: 10,
    resizeMode: 'contain',
    borderRadius: 8,
    overflow: 'hidden'
  },
  text: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: (DeviceHeigth * 20) / 100,
    justifyContent: 'flex-end',
    paddingBottom: 4,
  }
});
export default Diets