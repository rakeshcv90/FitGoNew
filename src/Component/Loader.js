import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native-paper';
const Loader = () => {
    return(
        <SafeAreaView style={{marginVertical:60,justifyContent:'center',alignItems:'center',flex:1}}>
        <ActivityIndicator color={"orange"} size={50} style={{justifyContent:'center',alignItems:'center',flex:1,height:80}}/>
        </SafeAreaView>
        );
}
export default Loader