import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import MeditationTitleComponent from './MeditationTitleComponent'
import Bulb from '../../Screen/Yourself/Bulb'
import { AppColor } from '../../Component/Color'
const MeditationConsent = () => {
  return (
    <View style={styles.Container}>
        <MeditationTitleComponent Title={"Would you like to Meditate also ?"}/>
        <Bulb Title="Meditation helps in keep your body and mind calm, peaceful and relax."/>
    </View>
  )
}
const styles=StyleSheet.create({
    Container:{
        flex:1,
        alignItems:'center',
        backgroundColor:AppColor.BACKGROUNG
    }
})
export default MeditationConsent