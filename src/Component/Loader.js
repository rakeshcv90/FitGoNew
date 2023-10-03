import { View, Text } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native-paper';
const Loader = () => {
    return(
        <>
        <View style={{marginVertical:25}}>
        <ActivityIndicator color={"orange"} size={25} />
        </View>
        </>
        );
}
export default Loader