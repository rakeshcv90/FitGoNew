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
  ToastAndroid,
  Platform
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { DeviceHeigth, DeviceWidth } from '../../Component/Config';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux'
import LevelRate from '../../Component/LevelRate';
import { Api, Appapi } from '../../Component/Config';
import axios from 'axios';
import Loader from '../../Component/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';
const WorkoutDescription = () => {
  const navigation = useNavigation();
  const [HomeCardioData, setHomeCardioData] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [IsLoaded, setIsLoaded] = useState(false)
  const route = useRoute();
  const { defaultTheme } = useSelector(state => state)
  const [userid, setUserId] = useState()
  const [FavData, setFavData] = useState([])
  const [isMounted, setIsMounted] = useState(0);
  useEffect(() => {
    const getUsersFavWorkout = async () => {
      try {
        const Storeddata = await AsyncStorage.getItem('Data');
        if (Storeddata !== null) {
          const JASONData = JSON.parse(Storeddata)
          const Id = JASONData[0].email
          setUserId(JASONData[0].email)
          const favWorkout = await axios(`${Api}/${Appapi.FavoriteWorkout}?email=${Id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          })
          if (favWorkout.data) {
            setFavData(favWorkout.data)
            // console.log("data", favWorkout.data)
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
    getData();
    getUsersFavWorkout();
  }, [isMounted]);
  const getData = () => {
    try {
      const Data = route.params;
      setHomeCardioData(Data.elements.item)
    }
    catch (error) { }
  };
  const AddToFavorites = async () => {
    try {
      let payload = new FormData()
      payload.append('email', userid)
      payload.append('workout_id', HomeCardioData.id)
      payload.append('temp', 1)
      const Fav = await axios(`${Api}/${Appapi.Favorites}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: payload
      })
      if (Fav.data) {
        showMessage({
          message:Fav.data[0].msg,
          statusBarHeight:getStatusBarHeight(),
          floating:true,
          type: 'success',
          icon: { icon: 'success', position: 'left' },
        });
        setFavData(FavData)
        setIsMounted(isMounted + 1)
      }
    } catch (error) {
      console.log("Erroror", error)
    }
  }
  // i am sending 2 so that backend can know that it has to remove workout data of the user(same 1 for diet)
  const RemoveFavorites = async () => {
    try {
      const RemovedData = await axios(`${Api}/${Appapi.RemoveFavorite}?email=${userid}&workout_id=${HomeCardioData.id}&temp=${2}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // data:payload,
      })
      if (RemovedData.data) {
        showMessage({
          message:RemovedData.data[0].msg,
          statusBarHeight:getStatusBarHeight(),
          floating:true,
          type: 'danger',
          icon: { icon: 'none', position: 'left' },
        });
        setFavData(FavData.filter((item) => item.id !== HomeCardioData.id))
        setIsMounted(isMounted + 1)
      }
    } catch (error) {
      console.log("Erroror", error)
    }
  }
  const toggleAddRemove = () => {
    if (FavData.some((item) => item.id === HomeCardioData.id)) {
      RemoveFavorites();
    }
    else {
      AddToFavorites();
    }
  }
  const ToggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }
  const [Days, setDays] = useState([
    {
      id: 1,
      days: "Day 1",
    },
    {
      id: 2,
      days: "Day 2",
    },
    {
      id: 3,
      days: "Day 3",
    },
    {
      id: 4,
      days: "Day 4",
    },
    {
      id: 5,
      days: "Day 5",
    },
    {
      id: 6,
      days: "Day 6",
    },
    {
      id: 7,
      days: "Day 7",
    },
  ]);
  if (IsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: defaultTheme == true ? "#000" : "#fff" }}>
        <StatusBar barStyle={defaultTheme?'light-content':'dark-content'} translucent={true} backgroundColor={'transparent'} />
        <ImageBackground
          source={{ uri: HomeCardioData.image}}
          style={styles.HomeImg}>
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.6)']}
            style={styles.LinearG}>
            <View style={styles.Buttn}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icons name="close" size={30} color={'white'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                toggleAddRemove();
                ToggleBookmark();
              }}>
                {(FavData.some((item)=>item.id===HomeCardioData.id )) ? (
                  <>
                    <Icons name="heart" size={30} color={'red'} />
                  </>
                ) : (
                  <>
                    <Icons name="heart-outline" size={30} color={'white'} />
                  </>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.textView}>
              <Text style={{ color: 'white', padding: 8, fontSize: 16 }}>
                {HomeCardioData.title}
              </Text>
              <Text style={{ color: '#f39c1f' }}>{HomeCardioData.duration}</Text>
              <View style={styles.rating}>
                <LevelRate level={HomeCardioData.level} />
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
        <View style={styles.levelGoalView}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'black', fontSize: 17 }}>Level</Text>
            <Text style={{ color: 'black' }}>{HomeCardioData.level}</Text>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'black', fontSize: 17 }}>Goal</Text>
            <Text style={{ color: 'black' }}>{HomeCardioData.goal}</Text>
          </View>
        </View>
        <View style={{ width: DeviceWidth, height: DeviceHeigth * 95 / 100 }}>
          <FlatList
            data={Days}
            renderItem={elements => (
              <TouchableOpacity style={styles.Days} onPress={() => {
                navigation.navigate("Singleday", { Day: elements.item.id, Id: HomeCardioData.id, DayName: elements.item.days })
              }}>
                <Text style={{ fontSize: 17, color: defaultTheme == true ? "#fff" : "#000" }}>{elements.item.days}</Text>
                <Icons name="chevron-right" size={20} color={'#f39c1f'} />
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
  HomeImg: {
    height: (DeviceHeigth * 40) / 100,
    width: DeviceWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Buttn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: (DeviceHeigth * 7) / 100,
    marginHorizontal: (DeviceWidth * 4) / 100,
  },
  LinearG: {
    height: (DeviceHeigth * 40) / 100,
    width: DeviceWidth,
    justifyContent: 'space-between',
  },
  textView: {
    marginBottom: (DeviceHeigth * 13) / 100,
    alignItems: 'center',
  },
  levelGoalView: {
    width: DeviceWidth,
    height: (DeviceHeigth * 8) / 100,
    backgroundColor: '#f39c1f',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
  },
  Days: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: (DeviceWidth * 4) / 100,
    marginVertical: (DeviceHeigth * 2) / 100,
  },
  rating: {
    flexDirection: 'row',
    padding: 4
  }
});
export default WorkoutDescription