import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import React, {
  useState, useEffect, useContext,
} from 'react';
import Header from '../../Component/Header'
import { DeviceHeigth, DeviceWidth } from '../../Component/Config';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Loader from '../../Component/Loader';
import { useSelector } from 'react-redux'
import { Api, Appapi } from '../../Component/Config';
import CustomStatusBar from '../../Component/CustomStatusBar';
const Goals = ({ navigation }) => {
  const [ApiData, setApiData] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false)
  const { defaultTheme } = useSelector(state => state)
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const data = await axios(`${Api}/${Appapi.goals}`, {
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
        setIsLoaded(true)
        setIsEmpty(true)
      }

    } catch (error) { }
  };
  if (isLoaded && !isEmpty) {
    return (
      <View style={{ flex: 1, backgroundColor: defaultTheme == true ? "#000" : "#fff" }}>
        {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#941000'} /></> : <><CustomStatusBar /></>}
        <Header
          header={'Goals'}
          iconName={'magnify'}
        />
        <View
          style={{
            flex:1
          }}>
          <FlatList
            data={ApiData}
            renderItem={elements => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('SingleGoal', { title: elements.item.title });
                }}>
                <ImageBackground
                  source={{ uri: elements.item.image }}
                  style={styles.FlatListImg}
                >
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
  else if (isEmpty && isLoaded) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: defaultTheme ? "#000" : "#fff", }}>
        <Text style={{ color: defaultTheme ? "#fff" : "#000" }}> No Data Available</Text></View>
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
    backgroundColor: '#941000',
  },
});
export default Goals