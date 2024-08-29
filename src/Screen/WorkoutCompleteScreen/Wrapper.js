import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import { AppColor } from '../../Component/Color'

const Wrapper = ({children,styles}) => {
  return (
    <SafeAreaView style={[style.container,{...styles}]}>
      {children}
    </SafeAreaView>
  )
}
const style=StyleSheet.create({
    container:{
        flex:1,
       backgroundColor:AppColor.GRAY
    }
})
export default Wrapper