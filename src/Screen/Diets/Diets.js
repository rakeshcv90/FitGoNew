import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { DeviceWidth, DeviceHeigth } from '../../Component/Config';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Api, Appapi } from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import Loader from '../../Component/Loader';
import { useSelector } from 'react-redux';
import HeaderWithoutSearch from '../../Component/HeaderWithoutSearch';
const Diets = () => {
    const {defaultTheme}=useSelector((state)=>state)
    const [ApiData, setApiData] = useState([]);
      const [isLoaded, setIsLoaded] = useState(false);
      const navigation = useNavigation();
      useEffect(() => {
        getData();
      }, []);
      const getData = async () => {
        try {
          const data = await axios(`${Api}/${Appapi.Diets}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'Multipart/form-data',
            },
          });
          setApiData(data.data);
          // console.log(data.data.data);
          setIsLoaded(true);
        } catch (error) {}
      };
      if(!isLoaded){
        return(
          <View>
            <Loader/>
          </View>
        )
      }
      else{
    return (
      <SafeAreaView style={{flex:1,backgroundColor:defaultTheme==true?"#000":"#fff"}}>
      <HeaderWithoutSearch Header={"Diets"}/>
        <TouchableOpacity style={styles.button} onPress={()=>{
          navigation.navigate('DietCategory')
        }}>
        <Icons name="tag" size={15} color={"black"}/>
          <Text style={styles.btnText}>Categories</Text>
        </TouchableOpacity>
        <View style={{height:DeviceHeigth*80/100,width:DeviceWidth,justifyContent:'center',alignItems:'center'}}>
        <FlatList data={ApiData} renderItem={({item})=>(
          <TouchableOpacity onPress={()=>{
            navigation.navigate("DietDetail",{data:item})
          }}>
          <ImageBackground source={{uri:item.image}} style={styles.imageBackground}>
            <View style={styles.text}>
            <Text style={{color:"#f39c1f",marginLeft:10,fontWeight:'bold',fontSize:16}}>{item.category}</Text>
            <Text style={{color:'#fff',marginTop:5,marginLeft:10,fontWeight:'bold',fontSize:16}}>{item.title}</Text>
            <Text style={{color:'#fff',margin:10,fontWeight:'bold',fontSize:13}}>{item.calories} Kcal | Servings: {item.servings}</Text>
            </View>
          </ImageBackground>
          </TouchableOpacity>
    )}></FlatList>
    </View>
      </SafeAreaView>
    )};
  };
  const styles = StyleSheet.create({
    button: {
      width: (DeviceWidth * 96.5) / 100,
      height: (DeviceHeigth * 4.5) / 100,
      marginLeft: DeviceWidth*2/100,
      marginVertical:DeviceHeigth*2/100,
      marginRight:DeviceWidth*2/100,
      marginBottom:DeviceHeigth*2/100,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:"#f39c1f",
      borderRadius:8
    },
    catIcon:{
      height:DeviceHeigth*4/100,
      width:DeviceWidth*5/100,
      resizeMode:'contain',
      marginRight:5
    },
    btnText:{
      color:'black',
      fontWeight:'bold',
      marginLeft:10
    },
    imageBackground:{
      width:DeviceWidth*95.5/100,height:DeviceHeigth*20/100,
      margin:10,
      resizeMode:'contain',
      borderRadius:8,
      overflow:'hidden'
    },
    text:{
      backgroundColor: 'rgba(0,0,0,0.5)',
      height: (DeviceHeigth * 20) / 100,
      justifyContent: 'flex-end',
      paddingBottom: 4,
    }
  });
export default Diets