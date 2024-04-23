import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const NewDashBoard = () => {
  return (
    <View style={styles.Container}>
      <Text>NewDashBoard</Text>
    </View>
  )
}
const styles=StyleSheet.create({
    Container:{
        flex:1
    }
})
export default NewDashBoard