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
import { DeviceHeigth, DeviceWidth } from '../../Component/Config';
import { Api, Appapi } from '../../Component/Config';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Loader from '../../Component/Loader';
import { useSelector } from 'react-redux'
import Header from '../../Component/Header'
import LevelRate from '../../Component/LevelRate';
import CustomStatusBar from '../../Component/CustomStatusBar';
const SingleGoal = () => {
  const [ApiData, setApiData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { defaultTheme } = useSelector((state) => state)
  const route = useRoute()
  const navigation = useNavigation()
  const Data = route.params;
  console.log(Data.title)
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
  const SingleGoalData = ApiData.filter(item => item.goal == Data.title);
  if (isLoaded) {


    return (
      <View style={{ flex: 1, backgroundColor: defaultTheme ? "#000" : "#fff" }}>
        {Platform.OS=='android'?<><StatusBar barStyle={defaultTheme?'light-content':'dark-content'} backgroundColor={'#C8170D'}/></>:<><CustomStatusBar/></>}
        <Header header={Data.title}
          iconName={"magnify"} />
        <View style={{ flex:1}}>
          <FlatList
            data={SingleGoalData}
            renderItem={elements => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("WorkoutDescription", { elements });
                }}>
                <ImageBackground
                  source={{ uri: elements.item.image }}
                  style={styles.backGimage}>
                  <View style={styles.textView}>
                    <View style={styles.rating}>
                      <LevelRate level={elements.item.level} />
                    </View>
                    <View>
                      <Text
                        style={[
                          styles.text,
                          { fontSize: 15, fontWeight: '500' },
                        ]}>
                        {elements.item.title}
                      </Text>
                      <Text style={styles.text}>{elements.item.duration}</Text>
                    </View>
                  </View>
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
  backGimage: {
    width: (DeviceWidth * 95) / 100,
    height: (DeviceHeigth * 20) / 100,
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  textView: {
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.2)',
    height: (DeviceHeigth * 20) / 100,
  },
  text: {
    color: 'white',
    margin: 3,
  },
  rating: {
    width: 75,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    justifyContent: 'center',
  },
});
export default SingleGoal