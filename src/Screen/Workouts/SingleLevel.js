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
import React, { useState, useEffect, useContext } from 'react';
import Header from '../../Component/Header'
import { DeviceHeigth, DeviceWidth } from '../../Component/Config';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Loader from '../../Component/Loader';
import { useSelector } from 'react-redux'
import { Api, Appapi } from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import LevelRate from '../../Component/LevelRate';
import CustomStatusBar from '../../Component/CustomStatusBar';
const SingleLevel = () => {
  const [ApiData, setApiData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigation = useNavigation();
  const { defaultTheme } = useSelector((state) => state)
  const route = useRoute();
  const Data = route.params;
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const data = await axios(`${Api}/${Appapi.workhouts}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'Multipart/form-data',
        },
      });
      setApiData(data.data);
      setIsLoaded(true);
    } catch (error) { }
  };
  const RenderData = ApiData.filter(item => item.level === Data.level);
  if (Data.level == 'Beginner' && isLoaded == true) {
    return (
      <View style={{ flex: 1, backgroundColor: defaultTheme == true ? "#000" : "#fff" }}>
        {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#f39c1f'} /></> : <><CustomStatusBar /></>}
        <Header
          ScreenName={'Levels'}
          iconName={'magnify'}
          header={'Beginner'}
          searchShow={true}
          style={'space-between'}
          onPress={() => navigation.navigate("searchScreen")}

        />
        <View style={{ width: DeviceWidth, height: (DeviceHeigth * 90) / 100 }}>
          <FlatList
            data={RenderData}
            renderItem={elements => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("WorkoutDescription", { elements })
                }}>
                <ImageBackground
                  source={{ uri: elements.item.image }}
                  style={styles.TextDesign}>
                  <View
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      height: (DeviceHeigth * 20) / 100,
                      justifyContent: 'space-between',
                      paddingBottom: 4,
                    }}>
                    <View style={styles.rating}>
                      <LevelRate level={elements.item.level} />
                    </View>
                    <View>
                      <Text style={styles.Text}>{elements.item.title}</Text>
                      <Text
                        style={{
                          color: 'white',
                          marginBottom: 15,
                          marginLeft: 15,
                        }}>
                        {elements.item.duration}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    );
  } else if (Data.level == 'Intermediate' && isLoaded == true) {
    return (
      <View style={{ flex: 1, backgroundColor: defaultTheme == true ? "#000" : "#fff" }}>
        {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#f39c1f'} /></> : <><CustomStatusBar /></>}
        <Header
          ScreenName={'Levels'}
          iconName={'magnify'}
          header={'Intermediate'}
          searchShow={true}
          style={'space-between'}
          onPress={() => navigation.navigate("searchScreen")}

        />
        <View style={{ width: DeviceWidth, height: (DeviceHeigth * 90) / 100 }}>
          <FlatList
            data={RenderData}
            renderItem={elements => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("WorkoutDescription", { elements })
                }}>
                <ImageBackground
                  source={{ uri: elements.item.image }}
                  style={styles.TextDesign}>
                  <View
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      height: (DeviceHeigth * 20) / 100,
                      justifyContent: 'space-between',
                      paddingBottom: 4,
                    }}>
                    {/* { console.log("image",item.title,item.image)} */}
                    <View style={styles.rating}>
                      <LevelRate level={elements.item.level} />
                    </View>
                    <View>
                      <Text style={styles.Text}>{elements.item.title}</Text>
                      <Text
                        style={{
                          color: 'white',
                          marginBottom: 15,
                          marginLeft: 15,
                        }}>
                        {elements.item.duration}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    );
  } else if (Data.level == 'Advanced' && isLoaded == true) {
    return (
      <View style={{ flex: 1, backgroundColor: defaultTheme == true ? "#000" : "#fff" }}>
        {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#f39c1f'} /></> : <><CustomStatusBar /></>}
        <Header
          ScreenName={'Levels'}
          iconName={'magnify'}
          header={'Advanced'}
          searchShow={true}
          style={'space-between'}
          onPress={() => navigation.navigate("searchScreen")}

        />
        <View style={{ width: DeviceWidth, height: (DeviceHeigth * 90) / 100 }}>
          <FlatList
            data={RenderData}
            renderItem={elements => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("WorkoutDescription", { elements })
                }}>
                <ImageBackground
                  source={{ uri: elements.item.image }}
                  style={styles.TextDesign}>
                  <View
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      height: (DeviceHeigth * 20) / 100,
                      justifyContent: 'space-between',
                      paddingBottom: 4,
                    }}>
                    {/* { console.log("image",item.title,item.image)} */}
                    <View style={styles.rating}>
                      <LevelRate level={elements.item.level} />
                    </View>
                    <View>
                      <Text style={styles.Text}>{elements.item.title}</Text>
                      <Text
                        style={{
                          color: 'white',
                          marginBottom: 15,
                          marginLeft: 15,
                        }}>
                        {elements.item.duration}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    );
  } else if (Data.level == 'Elite' && isLoaded == true) {
    return (
      <View style={{ flex: 1, backgroundColor: defaultTheme == true ? "#000" : "#fff" }}>
        {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#f39c1f'} /></> : <><CustomStatusBar /></>}
        <Header ScreenName={'Levels'} iconName={'magnify'} header={'Elite'}
          searchShow={true}
          style={'space-between'}
          onPress={() => navigation.navigate("searchScreen")}
        />
        <View style={{ width: DeviceWidth, height: (DeviceHeigth * 90) / 100 }}>
          <FlatList
            data={RenderData}
            renderItem={elements => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("WorkoutDescription", { elements })
                }}>
                <ImageBackground
                  source={{ uri: elements.item.image }}
                  style={styles.TextDesign}>
                  <View
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      height: (DeviceHeigth * 20) / 100,
                      justifyContent: 'space-between',
                      paddingBottom: 4,
                    }}>
                    {/* { console.log("image",item.title,item.image)} */}
                    <View style={styles.rating}>
                      <LevelRate level={elements.item.level} />
                    </View>
                    <View>
                      <Text style={styles.Text}>{elements.item.title}</Text>
                      <Text
                        style={{
                          color: 'white',
                          marginBottom: 15,
                          marginLeft: 15,
                        }}>
                        {elements.item.duration}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    );
  } else {
    return (

      <Loader />

    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  TextDesign: {
    height: (DeviceHeigth * 20) / 100,
    borderRadius: 8,
    overflow: 'hidden',
    margin: 15,
    resizeMode: 'contain',
  },
  Text: {
    color: 'white',
    fontFamily: 'sans-serif',
    fontWeight: '600',
    marginLeft: 15,
    fontSize: 18,
    marginBottom: 5,
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
});
export default SingleLevel