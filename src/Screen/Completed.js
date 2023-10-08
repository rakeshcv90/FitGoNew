import { View, Text } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch';

const Completed = () => {
    const route=useRoute();
    const Data=route.params;
    console.log(Data)
  return (
    <View>
      <HeaderWithoutSearch/>
    </View>
  )
}

export default Completed