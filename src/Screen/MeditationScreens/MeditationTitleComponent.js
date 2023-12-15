import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { AppColor } from '../../Component/Color'
import { DeviceHeigth, DeviceWidth } from '../../Component/Config'

const MeditationTitleComponent = ({Title}) => {
  return (
    <View style={styles.TextView}>
      <Text style={styles.Texts}>{Title}</Text>
    </View>
  )
}
const styles=StyleSheet.create({
 TextView:{
marginTop:DeviceHeigth*0.15,
width:DeviceWidth*90/100,
 },
 Texts:{
    color:AppColor.BLACK,
    fontFamily:"Poppins-Bold",
    fontSize:25,
    textAlign:'center'
 }
})
export default MeditationTitleComponent