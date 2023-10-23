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
const FavDiets = () => {
  const [Favdiet, setFavDiets] = useState([]);
  const { defaultTheme } = useSelector((state) => state);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigation = useNavigation()
  const[update,setUpdate]=useState(0)
  useEffect(() => {
    const getUsersFavDiets = async () => {
      try {
        const Storeddata = await AsyncStorage.getItem('Data');
        if (Storeddata !== null) {
          const JASONData = JSON.parse(Storeddata)
          const Id = JASONData[0].email
          const favDiet = await axios(`${Api}/${Appapi.FavoriteDiets}?email=${Id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          })
          if (favDiet) {
            setFavDiets(favDiet.data)
            console.log("diet", favDiet.data[0])
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
    getUsersFavDiets();
  }, [update]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: defaultTheme ?'#000':'#fff' }}>
    {isLoaded ? (
      <>
        <View style={{ height: (DeviceHeigth * 90) / 100, backgroundColor: defaultTheme ? "#000" : "#fff" }}>
          <FlatList
            data={Favdiet}
            renderItem={({item}) => {
              return(
                <TouchableOpacity onPress={() => {
                  navigation.navigate("DietDetail",{data:item})
                }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      margin: 10,
                      alignItems: 'center',
                    }}> 
                    <Image
                      source={{uri:item.image}}
                      style={styles.Image}
                    />
                    <View>
                      <View style={styles.container3}>
                        <View>
                          <Text
                            style={[
                              styles.flatListTitle,
                              { color: defaultTheme == true ? '#fff' : '#000' },
                            ]}>{item.title}
                           </Text>
                          </View>
                        <Icons name="chevron-right" size={20} color={'grey'} />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}}
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
export default FavDiets