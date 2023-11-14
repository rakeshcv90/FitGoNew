import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Api, Appapi } from '../../Component/Config';
import Loader from '../../Component/Loader';
import { DeviceHeigth, DeviceWidth } from '../../Component/Config';
import { useSelector } from 'react-redux';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderWithoutSearch from '../../Component/HeaderWithoutSearch';
import CustomStatusBar from '../../Component/CustomStatusBar';
const ExerciseByEquipments = () => {
  const route = useRoute()
  const [getExerciseByEquipment, setExerciseByEquipment] = useState([])
  const [title, setTitle] = useState()
  const navigation = useNavigation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false)
  const { defaultTheme } = useSelector(state => state)
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    const Data = route.params;
    setTitle(Data.item.title)
    try {
      const data = await axios(`${Api}/${Appapi.Exercise}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'Multipart/form-data',
        },
      });
      if (data.data.length > 0) {
        setExerciseByEquipment(data.data.filter((item) => item.equipment == Data.item.title))
        setIsEmpty(false)
        setIsLoaded(true);
      }
      else {
        setIsEmpty(true)
        setIsLoaded(true)
      }
    } catch (error) { }
  };
  if (isLoaded && !isEmpty) {
    return (
      <View style={[styles.container, { backgroundColor: defaultTheme ? "#000" : "#fff" }]}>
        {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#941000'} /></> : <><CustomStatusBar /></>}
        <HeaderWithoutSearch Header={title} />
        <View style={{flex:1}}>
          {getExerciseByEquipment.length > 0 ? (<>
            <FlatList
              data={getExerciseByEquipment}
              renderItem={elements => (
                <TouchableOpacity onPress={() => {
                  navigation.navigate("ExerciseDetails", { elements })
                }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      margin: 10,
                      alignItems: 'center',
                    }}>
                    <View style={{ margin: 5 }}>
                      <Image
                        source={{ uri: elements.item.image }}
                        style={styles.Image}
                      /></View>
                    <View>
                      <View style={styles.container3}>

                        <Text
                          style={[
                            styles.flatListTitle,
                            { color: defaultTheme == true ? '#fff' : '#000' },
                          ]}>
                          {elements.item.title}
                        </Text>
                        <Icons name="chevron-right" size={20} color={'#941000'} />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            /></>) : (<>
              <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: defaultTheme ? "#000" : "#fff", }}>
                <Text style={{ color: defaultTheme ? "#fff" : "#000" }}> No Data Available</Text>
              </View>
            </>)}
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
  Image: {
    width: 70,
    height: 70,
    margin: 8,
    resizeMode: 'contain',
    borderRadius: 70 / 2
  },
  container3: {
    flexDirection: 'row',
    alignItems: 'center',
    width: (DeviceWidth * 70) / 100,
    justifyContent: 'space-between',
  },
  flatListTitle: {
    fontSize: 16,
  },
});
export default ExerciseByEquipments