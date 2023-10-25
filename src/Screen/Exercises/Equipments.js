import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import Header from '../../Component/Header';
import { DeviceHeigth, DeviceWidth } from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Api, Appapi } from '../../Component/Config';
import Loader from '../../Component/Loader';
import { useSelector } from 'react-redux'
import HeaderWithoutSearch from '../../Component/HeaderWithoutSearch';
const Equipments= () => {
  const [ApiData, setApiData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigation = useNavigation();
  const {defaultTheme}=useSelector(state=>state)
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const data = await axios(`${Api}/${Appapi.Equipments}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'Multipart/form-data',
        },
      });
      setApiData(data.data);
      setIsLoaded(true);
    } catch (error) {}
  };
  if(!isLoaded){
    return(
      
            <Loader/>
       
    )
  }
  else{
return (
<View style={[styles.container,{backgroundColor:defaultTheme?"#000":"#fff"}]}>
<HeaderWithoutSearch Header={"Equipments"}/>
<View style={{height:DeviceHeigth*90/100}}>
<FlatList
        data={ApiData}
        renderItem={elements => (
          <TouchableOpacity onPress={()=>{
            navigation.navigate("ExerciseByEquipments",{item:elements.item})
          }}>
            <View
              style={{
                flexDirection: 'row',
                margin: 10,
                alignItems: 'center',
              }}>
                <View style={{height:60,width:60,borderRadius:60/2,overflow:'hidden',margin:5}}>
              <Image
                source={{uri:elements.item.image}}
                style={styles.Image}
              /></View>
              <View>
                <View style={styles.container3}>
                 
                    <Text
                      style={[
                        styles.flatListTitle,
                        {color: defaultTheme == true ? '#fff' : '#000'},
                      ]}>
                      {elements.item.title}
                    </Text>
                    
                  
                  <Icons name="chevron-right" size={20} color={'#f39c1f'} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
</View>
</View>
) }
}
const styles = StyleSheet.create({
container: {
  flex: 1,
},
Image: {
  width: 40,
  height: 40,
  margin: 10,
  tintColor:'#f39c1f',
  resizeMode:'contain',
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
export default Equipments