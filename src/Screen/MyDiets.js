import { View, Text ,StatusBar} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native'
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch'
import FavDiets from '../Component/FavDiets'
import CustomStatusBar from '../Component/CustomStatusBar'
const MyDiets = () => {
  return (
    <View style={{ flex: 1 }}>
      {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#f39c1f'} /></> : <><CustomStatusBar /></>}
      <HeaderWithoutSearch Header={'My Diets'} />
      <FavDiets />
    </View>
  )
}
export default MyDiets