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
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import LevelRate from '../Component/LevelRate';
import {Api, Appapi} from '../Component/Config';
import axios from 'axios';
import Loader from '../Component/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { localImage } from './Image';
const FavDiets = () => {
 
  const [Favdiet, setFavDiets] = useState([]);
  // const {defaultTheme} = useSelector(state => state);
  const defaultTheme = useSelector(state => state.defaultTheme);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigation = useNavigation();
  const [update, setUpdate] = useState(0);
  const [isEmpty, setEmpty] = useState(false);
  const getUsersFavDiets = async () => {
    try {
      const Storeddata = await AsyncStorage.getItem('Data');
      if (Storeddata !== null) {
        const JASONData = JSON.parse(Storeddata);
        const Id = JASONData[0].email;
        const favDiet = await axios(
          `${Api}/${Appapi.FavoriteDiets}?email=${Id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      
        if (favDiet.data) {
          setFavDiets(favDiet.data);
          setUpdate(update + 1);
          setIsLoaded(true);
          setEmpty(false);
        } else {
          setEmpty(true);
          setIsLoaded(true);
        }
      }
    } catch (error) {
      console.log('ERROR', error);
    }
  };
  useEffect(() => {
    getUsersFavDiets();
  }, [update]);
  return (
    <View style={{flex: 1, backgroundColor: defaultTheme ? '#000' : '#fff'}}>
      {isLoaded ? (
        <>
          {isEmpty ? (
            <>
              <View
                style={{
                  height: (DeviceHeigth * 90) / 100,
                  backgroundColor: defaultTheme ? '#000' : '#fff',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Text
                  style={{
                    color: defaultTheme ? '#FFF' : '#000',
                    fontSize: 20,
                    fontWeight: '500',
                    marginVertical:15
                  }}>
                  Nothing is added , Add Diets
                </Text>
                 <View>
                  <TouchableOpacity onPress={()=>{navigation.navigate("Diets")}}>
                   <Image source={localImage.addIcon} style={styles.add}/>
                  </TouchableOpacity>
                 </View>
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                 flex:1,
                  backgroundColor: defaultTheme ? '#000' : '#fff',
                }}>
                <FlatList
                  data={Favdiet}
                  renderItem={({item}) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('DietDetail', {data: item});
                        }}>
                        {item.title != null ? (
                          <View
                            style={{
                              flexDirection: 'row',
                              margin: 10,
                              alignItems: 'center',
                            }}>
                            <Image
                              source={{uri: item.image}}
                              style={styles.Image}
                            />
                            <View>
                              <View style={styles.container3}>
                                <View>
                                  <Text
                                    style={[
                                      styles.flatListTitle,
                                      {
                                        color:
                                          defaultTheme == true
                                            ? '#fff'
                                            : '#000',
                                      },
                                    ]}>
                                    {item.title}
                                  </Text>
                                </View>
                                <Icons
                                  name="chevron-right"
                                  size={20}
                                  color={'grey'}
                                />
                              </View>
                            </View>
                          </View>
                        ) : null}
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </>
          )}
        </>
      ) : (
        <>
          <Loader />
        </>
      )}
    </View>
  );
};
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
  add:{
    width:DeviceWidth*15/100,
    height:DeviceHeigth*5/100,
    resizeMode:'contain',
    tintColor:'#C8170D'
  }
});
export default FavDiets;
