import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  StyleSheet,
  StatusBar
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DeviceHeigth, DeviceWidth } from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { Api, Appapi } from '../../Component/Config';
import Loader from '../../Component/Loader';
import { useSelector } from 'react-redux';
import HeaderWithoutSearch from '../../Component/HeaderWithoutSearch';
import moment from 'moment';
import CustomStatusBar from '../../Component/CustomStatusBar';
const BlogTags = () => {
  const route = useRoute();
  const Data = route.params;
  const navigation = useNavigation()
  const [FilterData, setFilterData] = useState([]);
  const { defaultTheme } = useSelector((state) => state);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEmpty,setisEmpty]=useState(false)
  console.log('Tags', Data.data);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const data = await axios(`${Api}/${Appapi.FeaturedPost}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'Multipart/form-data',
        },
      });
     if(data.data.length>0){
      setFilterData(data.data);
      setIsLoaded(true);
      setisEmpty(false)
     }
     else{
      setisEmpty(true);
      setIsLoaded(true)
     }
    } catch (error) {
      console.log("ERRROOR",error)
     }
  };
  const TagData = FilterData.filter(item => item.tag == Data.data.title);
  if (isLoaded &&!isEmpty)  {
    return (
      <View style={[styles.container, { backgroundColor: defaultTheme ? "#000" : "#fff" }]}>
        {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#f39c1f'} /></> : <><CustomStatusBar /></>}
        <HeaderWithoutSearch Header={Data.data.title} />
        <View style={{flex:1}}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            data={TagData}
            renderItem={elements => (
              <TouchableOpacity onPress={() => {
                navigation.navigate("BlogDetail", { data: elements.item })
              }}>
                <ImageBackground
                  source={{ uri: elements.item.image }}
                  style={styles.Image}>
                  <View style={[styles.gradientView, {}]}>
                    <View style={styles.rating}>
                      <Text style={{ color: "#fff" ,width:'auto'}}>{elements.item.tag}</Text>
                    </View>
                    <View>
                      <Text style={styles.text}>{elements.item.title}</Text>
                      <Text
                        style={{
                          color: '#f39c1f',
                          fontWeight: '500',
                          marginTop: 7,
                        }}>
                        {moment(elements.item.date).fromNow()}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    )
  }else if(isLoaded && isEmpty){
    return(
      <View style={{ height: (DeviceHeigth * 90) / 100, backgroundColor: defaultTheme ? "#000" : "#fff", justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#f39c1f', fontSize: 20, fontWeight: 'bold' }}>No Data Available</Text></View>
    )
  }
   else {
    return (
     <Loader/>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rating: {
    width: 100,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
    justifyContent: 'center',
  },
  gradientView: {
    height: (DeviceHeigth * 25) / 100,
    width: (DeviceWidth * 96) / 100,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
    padding: 16,
  },
  text: {
    color: 'white',
    fontWeight: '500',
  },
  Image: {
    height: (DeviceHeigth * 25) / 100,
    width: (DeviceWidth * 96) / 100,
    borderRadius: 8,
    overflow: 'hidden',
    marginLeft: (DeviceWidth * 2) / 100,
    marginRight: (DeviceWidth * 2) / 100,
    marginVertical: (DeviceHeigth * 1) / 100,
  },

});
export default BlogTags