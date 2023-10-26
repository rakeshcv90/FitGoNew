import { View, Text, SafeAreaView,StatusBar } from 'react-native'
import React from 'react'
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch'
import FavWorkouts from '../Component/FavWorkouts'
import CustomStatusBar from '../Component/CustomStatusBar'
const MyWorkouts = () => {
  return (
    <View style={{ flex: 1 }}>
      {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#f39c1f'} /></> : <><CustomStatusBar /></>}
      <HeaderWithoutSearch Header={"My Workouts"} />
      <FavWorkouts />
    </View>
  )
}

export default MyWorkouts