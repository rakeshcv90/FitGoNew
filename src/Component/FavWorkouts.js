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
import { showMessage } from 'react-native-flash-message';
const FavWorkouts = () => {
  const [FavWorkout, setFavWorkout] = useState([]);
  const { defaultTheme } = useSelector((state) => state);
  const [isLoaded, setIsLoaded] = useState(false);
  const [update, setUpdate] = useState(0)
  const [isEmpty, setEmpty] = useState(false)
  const navigation = useNavigation()
  useEffect(() => {
    getUsersFavWorkout();
  }, [update]);
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
        if (favWorkout.data.length > 0) {
          setFavWorkout(favWorkout.data)
          setUpdate(update + 1)
          setIsLoaded(true)
          setEmpty(false)
          // console.log(favWorkout.data)
        }
        else {
          console.log("data not found")
          setEmpty(true)
          setIsLoaded(true)
        }
      }

    } catch (error) {
      console.log("ERROR", error)
      showMessage({
        message: error,
        animationDuration: 750,
        statusBarHeight: Platform.OS == 'ios' ? 0 : getStatusBarHeight(),
        floating: Platform.OS == 'ios' ? false : true,
        type: 'success',
        icon: { icon: 'none', position: 'left' },
      });
    }
  }
  return (
    <View style={{ flex: 1, backgroundColor: defaultTheme ? '#000' : '#fff' }}>
      {isLoaded ? (
        <>
          {isEmpty == false ? <>
            <View style={{ height: (DeviceHeigth * 90) / 100, backgroundColor: defaultTheme ? "#000" : "#fff" }}>
              <FlatList
                data={FavWorkout}
                renderItem={elements => (
                  <TouchableOpacity onPress={() => {
                    navigation.navigate("WorkoutDescription", { elements })
                  }}>
                    {elements.item.title != null ? <View
                      style={{
                        flexDirection: 'row',
                        margin: 10,
                        alignItems: 'center',
                      }}>
                      <Image
                        source={{ uri: elements.item.image }}
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
                    </View> : null}

                  </TouchableOpacity>
                )}
              />
            </View></> : <><View style={{ height: (DeviceHeigth * 90) / 100, backgroundColor: defaultTheme ? "#000" : "#fff", justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#f39c1f', fontSize: 20, fontWeight: 'bold' }}>No Workouts Added</Text></View></>}
        </>
      ) : (
        <>
          <Loader />
        </>
      )}
    </View>
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