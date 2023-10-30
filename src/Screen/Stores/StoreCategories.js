import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Linking,
  StatusBar
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { DeviceWidth, DeviceHeigth } from '../../Component/Config';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Api, Appapi } from '../../Component/Config';
import Loader from '../../Component/Loader';
import { useSelector } from 'react-redux';
import HeaderWithoutSearch from '../../Component/HeaderWithoutSearch';
import CustomStatusBar from '../../Component/CustomStatusBar';
const StoreCategories = () => {
  const route = useRoute();
  const Data = route.params;
  const [FilterData, setFilterData] = useState([]);
  const { defaultTheme } = useSelector((state) => state)
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false)
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const data = await axios(`${Api}/${Appapi.Products}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'Multipart/form-data',
        },
      });
      if (data.data.length > 0) {
        setFilterData(data.data);
        setIsLoaded(true);
        setIsEmpty(false)
      } else {
        setIsLoaded(true);
        setIsLoaded(true)
      }

    } catch (error) { }
  };
  const TagData = FilterData.filter(item => item.type == Data.data.title);
  if (isLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: defaultTheme ? '#000' : '#fff' }]}>
        {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#f39c1f'} /></> : <><CustomStatusBar /></>}
        <HeaderWithoutSearch Header={Data.data.title} />
        <View style={{ height: DeviceHeigth * 90 / 100 }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            data={TagData}
            renderItem={elements => (
              <TouchableOpacity onPress={() => {
                Linking.openURL(elements.item.link)
              }}>
                <ImageBackground
                  source={{ uri: elements.item.image }}
                  style={styles.Image}>
                  <View style={[styles.gradientView, {}]}>
                    <View>
                      <Text style={styles.text}>{elements.item.title}</Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    )
  } else if (isLoaded && isEmpty) {
    return (
      <View style={{ height: (DeviceHeigth * 90) / 100, backgroundColor: defaultTheme ? "#000" : "#fff", justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#f39c1f', fontSize: 20, fontWeight: 'bold' }}>No Data Available</Text></View>
    )
  }
  else {
    return (
      <Loader />
    )
  };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rating: {
    width: 75,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
    justifyContent: 'center',
  },
  gradientView: {
    height: (DeviceHeigth * 25) / 100,
    width: (DeviceWidth * 96) / 100,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  text: {
    color: 'white',
    fontWeight: '500',
  },
  Image: {
    height: (DeviceHeigth * 25) / 100,
    width: (DeviceWidth * 96) / 100,
    borderRadius: 8,
    overflow: 'hidden',
    marginLeft: (DeviceWidth * 2) / 100,
    marginRight: (DeviceWidth * 2) / 100,
    marginVertical: (DeviceHeigth * 1) / 100,
  },

});

export default StoreCategories