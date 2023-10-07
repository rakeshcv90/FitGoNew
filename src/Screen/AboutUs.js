import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, FlatList, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import HTMLRender from "react-native-render-html";
import { DeviceWidth, DeviceHeigth } from '../Component/Config';
import { Api, Appapi } from '../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Loader from '../Component/Loader';
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch';
const AboutUs = () => {
    const { width } = useWindowDimensions();
    const [isLoaded, setIsLoaded] = useState(false);
    const { defaultTheme } = useSelector(state => state)
    const [About, setAbout] = useState([])
    const navigation = useNavigation();
    useEffect(() => {
        getData();
    }, []);
    const mixedStyle = {
        body: {
           whiteSpace: "bold",
           color: "black",
        },
        // p: {
        //   color: "#000",
        // whiteSpace: "normal",
          
        // },
     };
    const getData = async () => {
        try {
            const data = await axios(`${Api}/${Appapi.Strings}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'Multipart/form-data',
                },
            });
            console.log("Aboiutsygsyuw", About)
            setAbout(data.data)
            setIsLoaded(true);
        }

        catch (error) {
            console.log("eroror", error)
        }
    };
    if (isLoaded) {
        return (
            <SafeAreaView style={styles.container}>
             <HeaderWithoutSearch Header={"About Us"}/>
                <View style={{marginHorizontal:20}}>
                    <FlatList data={About} renderItem={elements => {
                        return(
                        <View>
                            <HTMLRender source={{ html: elements.item.st_aboutus }} tagsStyles={mixedStyle} contentWidth={width}/>
                            {/* <Text style={{ color: "red" }}>{elements.item.st_aboutus}</Text> */}
                        </View>)
                    }} />
                </View>
            </SafeAreaView>
        )
    }
    else {
        return (
            <View>
                <Loader />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    closeButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 30,
        alignItems: 'center'
    
    }
})
export default AboutUs