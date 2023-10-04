import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../../Component/Header';
import { DeviceWidth, DeviceHeigth } from '../../Component/Config';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Api, Appapi } from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import LevelRate from '../../Component/LevelRate';
import Loader from '../../Component/Loader';
import { useSelector } from 'react-redux';
import HeaderWithoutSearch from '../../Component/HeaderWithoutSearch';
import LinearGradient from 'react-native-linear-gradient';
const DietDetail = () => {
    const navigation = useNavigation();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoaded, seIsLoaded] = useState(false);
  const route = useRoute();
  const Data = route.params;
  console.log(Data.data);
  const regex = /(<([^>]+)>)/gi;
  const Summary = Data.data.description.replace(regex, '\n');
  const Ingredients = Data.data.ingredients.replace(regex, '\n');
  const Instructions = Data.data.instructions.replace(regex, '\n');
  const FlatListData = [{Summary, Ingredients, Instructions}];
  const {defaultTheme} = useSelector(state => state);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: defaultTheme ? '#000' : '#fff'},
      ]}>
      
      <ImageBackground source={{uri: Data.data.image}} style={styles.HomeImg}>
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.6)']}
          style={styles.LinearG}>
          <View style={styles.Buttn}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Diets');
              }}>
              <Icons name="close" size={30} color={'white'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsBookmarked(!isBookmarked)}>
              {isBookmarked ? (
                <>
                  <Icons name="heart-outline" size={30} color={'white'} />
                </>
              ) : (
                <>
                  <Icons name="heart" size={30} color={'red'} />
                </>
              )}
            </TouchableOpacity>
          </View>
          <View style={[styles.textView]}>
            <Text style={{color: '#f39c1f', fontWeight: '600'}}>
              {Data.data.category}
            </Text>
            <Text style={{color: 'white', paddingVertical: 8, fontSize: 20}}>
              {Data.data.title}
            </Text>
            <Text style={{color: '#fff'}}>
              Servings: {Data.data.servings} | Prep Time: {Data.data.time}
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
      <View style={styles.levelGoalView}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: 'black', fontSize: 17}}>
            {Data.data.calories}
          </Text>
          <Text style={{color: 'black', fontWeight: '400'}}>calories</Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: 'black', fontSize: 17}}>
            {Data.data.protein}
          </Text>
          <Text style={{color: 'black', fontWeight: '400'}}>Protein</Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: 'black', fontSize: 17}}>{Data.data.fat}</Text>
          <Text style={{color: 'black', fontWeight: '400'}}>Fat</Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: 'black', fontSize: 17}}>{Data.data.carbs}</Text>
          <Text style={{color: 'black', fontWeight: '400'}}>Carbs</Text>
        </View>
      </View>
      <FlatList
        data={FlatListData}
        renderItem={elements => (
            <>
          <View style={styles.FlatListItem}>
            <Text style={[styles.Title,{color: defaultTheme?"#fff":"000"}]}>Summary</Text>
            <Text style={{color: defaultTheme?"#fff":"000"}}>{elements.item.Summary}</Text>
          </View>
           <View style={styles.FlatListItem}>
           <Text style={[styles.Title,{color: defaultTheme?"#fff":"000"}]}>Ingredients</Text>
           <Text style={{color: defaultTheme?"#fff":"000"}}>{elements.item.Ingredients}</Text>
         </View>
         <View style={styles.FlatListItem}>
           <Text style={[styles.Title,{color: defaultTheme?"#fff":"000"}]}>Instructions</Text>
           <Text style={{color: defaultTheme?"#fff":"000"}}>{elements.item.Instructions}</Text>
         </View>
         </>
        )}
      />
      <View />
    </SafeAreaView>
  );
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
      // justifyContent:'space-evenly'
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
    Title:{
      fontSize:20,
      color:"red"
    },
    FlatListItem:{
      margin:20,
      borderRadius:8,
      borderWidth:1,
      borderColor:"#adadad",
      padding:10
    }
  });
export default DietDetail