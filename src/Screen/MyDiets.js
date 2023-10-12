import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native'
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch'

const MyDiets = () => {
  return (
    <SafeAreaView>
     <HeaderWithoutSearch Header={'My Diets'}/>
    </SafeAreaView>
  )
}

export default MyDiets