import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch'
import FavWorkouts from '../Component/FavWorkouts'
const MyWorkouts = () => {
  return (
    <View style={{flex:1}}>
     <HeaderWithoutSearch Header={"My Workouts"}/>
     <FavWorkouts/>
    </View>
  )
}

export default MyWorkouts