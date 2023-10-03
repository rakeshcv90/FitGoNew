import { View, Text, SafeAreaView, StyleSheet, Switch } from 'react-native'
import React, {useState } from 'react'
import { setTheme } from '../Component/ThemeRedux/Actions'
import { useSelector,useDispatch } from 'react-redux'
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch'
const Settings = () => {
    const Dispatch=useDispatch()
    const {defaultTheme}=useSelector((state)=>state)
const [isEnabled, setIsEnabled] = useState(defaultTheme);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    // console.log("Tefdfdfgfd",defaultTheme)

const changeTHEME=()=>{
    if(!defaultTheme){
        Dispatch(setTheme(true))
    }else{
        Dispatch(setTheme(false)) 
    }
}
  return (
   <SafeAreaView style={[styels.container,{backgroundColor:defaultTheme==true?"#000":"#fff"}]}>
    <HeaderWithoutSearch Header={"Settings"}/>
    <View style={{borderBottomWidth:1,margin:15,borderBottomColor:'#adadad',padding:5,backgroundColor:defaultTheme==true?"#000":"#fff"}}>
    <Text style={{fontSize:18,color:defaultTheme==true?"#fff":"#000"}}>Theme</Text>
    </View>
    <View style={styels.container1}>
        <Text style={{color:defaultTheme==true?"#fff":"#000"}}>Dark Mode</Text>
        <Switch   trackColor={{false: '#767577', true: "#f39c1f"}}
        thumbColor={isEnabled ? "#f39c1f" : '#fff'}
        onValueChange={()=>{toggleSwitch();
        changeTHEME();}}
        value={isEnabled}
    />
    </View>
   </SafeAreaView>
  )
}
const styels=StyleSheet.create({
    container:{
        flex:1
    },
    container1:{
        flexDirection:"row",
        justifyContent:'space-between',
        margin:10
    }
})
export default Settings