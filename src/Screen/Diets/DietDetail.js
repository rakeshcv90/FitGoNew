import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ToastAndroid,
  Platform
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { DeviceWidth, DeviceHeigth, Api, Appapi } from '../../Component/Config';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import HTMLRender from "react-native-render-html";
import Loader from '../../Component/Loader';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import CustomStatusBar from '../../Component/CustomStatusBar';
import { getStatusBarHeight } from 'react-native-status-bar-height';
const DietDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const Data = route.params;
  const [isLoaded, setIsLoaded] = useState(false)
  const [FavData, setFavData] = useState([])
  const [isMounted, setIsMounted] = useState(0);
  const [userid, setUserId] = useState()
  const Summary = Data.data.description
  const Ingredients = Data.data.ingredients
  const Instructions = Data.data.instructions
  const FlatListData = [{ Summary, Ingredients, Instructions }];
  const { defaultTheme } = useSelector(state => state);
  useEffect(() => {
    const getUsersFavWorkout = async () => {
      try {
        const Storeddata = await AsyncStorage.getItem('Data');
        if (Storeddata !== null) {
          const JASONData = JSON.parse(Storeddata)
          const Id = JASONData[0].email
          setUserId(Id)
          const favDiet = await axios(`${Api}/${Appapi.FavoriteDiets}?email=${Id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          })
          setIsLoaded(true)
          if (favDiet.data) {
            setFavData(favDiet.data)
            console.log('fsvdata', favDiet.data)
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
  }, [isMounted]);
  const AddToFavorites = async () => {
    try {
      let payload = new FormData()
      payload.append('email', userid)
      payload.append('diet_id', Data.data.id)
      payload.append('temp', 0)
      const Fav = await axios(`${Api}/${Appapi.Favorites}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: payload
      })
      if (Fav.data) {
       
        showMessage({
          message: Fav.data[0].msg,
          statusBarHeight:Platform.OS=='ios'?0:getStatusBarHeight(),
          floating:Platform.OS=='ios'?true:false,
          type: 'success',
          icon: { icon: 'none', position: 'left' },
        });
        setFavData(FavData)

        setIsMounted(isMounted + 1)
      }
    } catch (error) {
      console.log("Erroror", error)
    }
  }
  const RemoveFavorites = async () => {
    try {
      const RemovedData = await axios(`${Api}/${Appapi.RemoveFavorite}?email=${userid}&diet_id=${Data.data.id}&temp=${1}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // data:payload,
      })
      if (RemovedData.data) {
        // ToastAndroid.showWithGravity(RemovedData.data[0].msg, ToastAndroid.SHORT, ToastAndroid.CENTER)
        showMessage({
          message: RemovedData.data[0].msg,
          statusBarHeight:Platform.OS=='ios'?0:getStatusBarHeight(),
          floating:Platform.OS=='ios'?true:false,
          type: 'danger',
          icon: { icon: 'none', position: 'left' },
        });
        setFavData(FavData.filter((item) => item.id !== Data.data.id))
        setIsMounted(isMounted + 1)
      }
    } catch (error) {
      console.log("Erroror", error)
    }
  }
  const toggleAddRemove = () => {
    if (FavData.some((item) => item.id === Data.data.id)) {
      RemoveFavorites();
    }
    else {
      AddToFavorites();
    }
  }
  if (isLoaded) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: defaultTheme ? '#000' : '#fff' },
        ]}>
       <StatusBar translucent={true} barStyle={defaultTheme?"light-content":'dark-content'} backgroundColor={'transparent'}/>
        <ImageBackground source={{ uri: Data.data.image }} style={styles.HomeImg}>
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.6)']}
            style={styles.LinearG}>
            <View style={styles.Buttn}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icons name="close" size={30} color={'white'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleAddRemove()}>
                {FavData.some((item) => item.id === Data.data.id) ? (
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
            <View style={[styles.textView]}>
              <Text style={{ color: '#f39c1f', fontWeight: '600' }}>
                {Data.data.category}
              </Text>
              <Text style={{ color: 'white', paddingVertical: 8, fontSize: 20 }}>
                {Data.data.title}
              </Text>
              <Text style={{ color: '#fff' }}>
                Servings: {Data.data.servings} | Prep Time: {Data.data.time}
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
        <View style={styles.levelGoalView}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'black', fontSize: 17 }}>
              {Data.data.calories}
            </Text>
            <Text style={{ color: 'black', fontWeight: '400' }}>calories</Text>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'black', fontSize: 17 }}>
              {Data.data.protein}
            </Text>
            <Text style={{ color: 'black', fontWeight: '400' }}>Protein</Text>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'black', fontSize: 17 }}>{Data.data.fat}</Text>
            <Text style={{ color: 'black', fontWeight: '400' }}>Fat</Text>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'black', fontSize: 17 }}>{Data.data.carbs}</Text>
            <Text style={{ color: 'black', fontWeight: '400' }}>Carbs</Text>
          </View>
        </View>
        <FlatList
          data={FlatListData}
          renderItem={elements => (
            <>
              <View style={styles.FlatListItem}>
                <Text style={[styles.Title, { color: defaultTheme ? "#fff" : "#000" }]}>Summary</Text>
                <HTMLRender source={{ html: elements.item.Summary }} contentWidth={DeviceWidth} tagsStyles={{
                  p: {
                    color: defaultTheme ? "#fff" : "#000"
                  },
                  strong: {
                    color: '#f39c1f',
                    fontSize: 20,
                  }
                  , li: {
                    color: defaultTheme ? "#fff" : "#000"
                  },
                  ul: {
                    color: defaultTheme ? "#fff" : "#000"
                  },
                  ol: {
                    color: defaultTheme ? "#fff" : "#000"
                  }
                }} />
              </View>
              <View style={styles.FlatListItem}>
                <Text style={[styles.Title, { color: defaultTheme ? "#fff" : "#000" }]}>Ingredients</Text>
                <HTMLRender source={{ html: elements.item.Ingredients }} contentWidth={DeviceWidth}
                  tagsStyles={{
                    p: {
                      color: defaultTheme ? "#fff" : "#000"
                    },
                    strong: {
                      color: '#f39c1f',
                      fontSize: 20,
                    }
                    , li: {
                      color: defaultTheme ? "#fff" : "#000"
                    },
                    ul: {
                      color: defaultTheme ? "#fff" : "#000"
                    },
                    ol: {
                      color: defaultTheme ? "#fff" : "#000"
                    }
                  }} />
              </View>
              <View style={styles.FlatListItem}>
                <Text style={[styles.Title, { color: defaultTheme ? "#fff" : "#000" }]}>Instructions</Text>
                <HTMLRender source={{ html: elements.item.Instructions }} contentWidth={DeviceWidth}
                  tagsStyles={{
                    p: {
                      color: defaultTheme ? "#fff" : "#000"
                    },
                    strong: {
                      color: '#f39c1f',
                      fontSize: 20,
                    }
                    , li: {
                      color: defaultTheme ? "#fff" : "#000"
                    },
                    ul: {
                      color: defaultTheme ? "#fff" : "#000"
                    },
                    ol: {
                      color: defaultTheme ? "#fff" : "#000"
                    }
                  }} />
              </View>
            </>
          )}
        />
        <View />
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
    marginBottom: (DeviceHeigth * 3) / 100,
    alignItems: 'flex-start',
    marginHorizontal: 15,
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
  Title: {
    fontSize: 20,
    color: "red"
  },
  FlatListItem: {
    margin: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#adadad",
    padding: 10
  }
});
export default DietDetail