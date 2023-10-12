import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch'

const MyWorkouts = () => {
  return (
    <SafeAreaView>
     <HeaderWithoutSearch Header={"My Workouts"}/>
    </SafeAreaView>
  )
}

export default MyWorkouts