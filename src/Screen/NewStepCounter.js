import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const NewStepCounter = () => {
  return (
    <View style={style.Container}>
      <Text>NewStepCounter</Text>
    </View>
  )
}
const style=StyleSheet.create({
    Container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})
export default NewStepCounter