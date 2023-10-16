import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch'
import FavWorkouts from '../Component/FavWorkouts'
const MyWorkouts = () => {
  return (
    <SafeAreaView>
     <HeaderWithoutSearch Header={"My Workouts"}/>
     <FavWorkouts/>
    </SafeAreaView>
  )
}

export default MyWorkouts