import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native'
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch'
import FavDiets from '../Component/FavDiets'
const MyDiets = () => {
  return (
    <View style={{flex:1}}>
     <HeaderWithoutSearch Header={'My Diets'}/>
     <FavDiets/>
    </View>
  )
}
export default MyDiets