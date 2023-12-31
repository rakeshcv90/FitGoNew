import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../../Component/Header';
import {DeviceWidth, DeviceHeigth} from '../../Component/Config';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {Api, Appapi} from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import LevelRate from '../../Component/LevelRate';
import Loader from '../../Component/Loader';
import {useSelector} from 'react-redux';
import CustomStatusBar from '../../Component/CustomStatusBar';
const Workouts = () => {
  const [WorkoutData, setWorkoutData] = useState([]);
  const navigation = useNavigation();
  const [IsLoaded, setIsLoaded] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const {defaultTheme} = useSelector(state => state);
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
      if (data.data.length > 0) {
        setWorkoutData(data.data);
        setIsLoaded(true);
        setIsEmpty(false);
      } else {
        setIsEmpty(true);
        setIsLoaded(true);
      }
    } catch (error) {
      console.log('error loading', error);
    }
  };
  if (IsLoaded && !isEmpty) {
    return (
      <View style={{backgroundColor: defaultTheme ? '#000' : '#fff', flex: 1}}>
        {Platform.OS == 'android' ? (
          <>
            <StatusBar
              barStyle={defaultTheme ? 'light-content' : 'dark-content'}

              backgroundColor={'#C8170D'}
            />
          </>
        ) : (
          <>
            <CustomStatusBar />
          </>
        )}
        <Header header={'Workouts'} iconName={'magnify'} />
        <View
          style={{
            flexDirection: 'row',
            height: (DeviceHeigth * 5) / 100,
            width: DeviceWidth,
            alignItems: 'stretch',
            marginVertical: 10,
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={styles.Buttons}
            onPress={() => {
              navigation.navigate('Goals');
            }}>
            <Icons
              name="lightning-bolt"
              size={20}
              mode="contained"
              color={"#fff"}
            />
            <Text style={{color: "#fff", marginHorizontal: 6}}> Goals</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Buttons}
            onPress={() => {
              navigation.navigate('Levels');
            }}>
            <Icons
              name="equalizer"
              size={20}
              mode="contained"
              color={"#fff"}
            />
            <Text style={{color: "#fff", marginHorizontal: 2}}> Levels</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{

            // width: DeviceWidth,
            //height: (DeviceHeigth * 88) / 100,
            // marginBottom:DeviceHeigth*0.12,
            flex:1,

            backgroundColor: defaultTheme ? '#000' : '#fff',
          }}>
          <FlatList
            data={WorkoutData}
            renderItem={elements => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('WorkoutDescription', {elements});
                }}>
                <ImageBackground
                  source={{uri: elements.item.image}}
                  style={styles.TextDesign}>
                  <View
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      height: (DeviceHeigth * 20) / 100,
                      justifyContent: 'space-between',
                      paddingBottom: 4,
                    }}>
                    <View style={styles.rating}>
                      {
                        <>
                          <LevelRate level={elements.item.level} />
                        </>
                      }
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
  } else if (IsLoaded && isEmpty) {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: defaultTheme ? '#000' : '#fff',
        }}>
        <Text style={{color: defaultTheme ? '#fff' : '#000'}}>
          {' '}
          No Data Available
        </Text>
      </View>
    );
  } else {
    return <Loader />;
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Buttons: {
    width: (DeviceWidth * 43) / 100,
    height: (DeviceHeigth * 5) / 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C8170D',

    borderRadius: 8,
    marginHorizontal: 7,
    flex: 1,
  },
  Text: {
    color: 'white',
    fontFamily: 'sans-serif',
    fontWeight: '600',
    marginLeft: 15,
    fontSize: 18,
    marginBottom: 5,
  },
  TextDesign: {
    height: (DeviceHeigth * 20) / 100,
    borderRadius: 8,
    overflow: 'hidden',
    margin: 15,
    resizeMode: 'contain',
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
export default Workouts;
