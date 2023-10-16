import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native'
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch'
import FavDiets from '../Component/FavDiets'
const MyDiets = () => {
  return (
    <SafeAreaView>
     <HeaderWithoutSearch Header={'My Diets'}/>
     <FavDiets/>
    </SafeAreaView>
  )
}
export default MyDiets