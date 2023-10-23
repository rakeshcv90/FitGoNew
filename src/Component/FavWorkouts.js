import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  FlatList,
  ToastAndroid
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { DeviceHeigth, DeviceWidth } from '../Component/Config';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux'
import LevelRate from '../Component/LevelRate';
import { Api, Appapi } from '../Component/Config';
import axios from 'axios';
import Loader from '../Component/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
const FavWorkouts = () => {
  const [FavWorkout, setFavWorkout] = useState([]);
  const { defaultTheme } = useSelector((state) => state);
  const [isLoaded, setIsLoaded] = useState(false);
  const [update,setUpdate]=useState(false)
  const navigation = useNavigation()
  useEffect(() => {
    const getUsersFavWorkout = async () => {
      try {
        const Storeddata = await AsyncStorage.getItem('Data');
        if (Storeddata !== null) {
          const JASONData = JSON.parse(Storeddata)
          const Id = JASONData[0].email
          const favWorkout = await axios(`${Api}/${Appapi.FavoriteWorkout}?email=${Id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          })
          if (favWorkout.data) {
            setFavWorkout(favWorkout.data)
            setUpdate(update+1)
            setIsLoaded(true)
          }
        }
        else {
          console.log("data not found")
        }
      } catch (error) {
        console.log("ERROR", error)
      }
    }
    getUsersFavWorkout();
  }, [update]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: defaultTheme ? '#000' : '#fff' }}>
      {isLoaded ? (
        <>
          <View style={{ height: (DeviceHeigth * 90) / 100, backgroundColor: defaultTheme ? "#000" : "#fff" }}>
            <FlatList
              data={FavWorkout}
              renderItem={elements => (
                <TouchableOpacity onPress={() => {
                  navigation.navigate("WorkoutDescription",{elements})
                }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      margin: 10,
                      alignItems: 'center',
                    }}> 
                    <Image
                      source={{uri:elements.item.image}}
                      style={styles.Image}
                    />
                    <View>
                      <View style={styles.container3}>
                        <View>
                          <Text
                            style={[
                              styles.flatListTitle,
                              { color: defaultTheme == true ? '#fff' : '#000' },
                            ]}>{elements.item.title}
                           </Text>
                          </View>
                        <Icons name="chevron-right" size={20} color={'grey'} />
                      </View>
                     
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </>
      ) : (
        <>
     
            <Loader />
       
        </>
      )}
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
  },
  Image: {
    width: 60,
    height: 60,
    margin: 10,
    borderRadius: 60 / 2,
  },
  container3: {
    flexDirection: 'row',
    alignItems: 'center',
    width: (DeviceWidth * 70) / 100,
    justifyContent: 'space-between',
  },
});
export default FavWorkouts