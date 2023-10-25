import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, FlatList, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import HTMLRender from "react-native-render-html";
import { DeviceWidth, DeviceHeigth } from '../Component/Config';
import { Api, Appapi } from '../Component/Config';
import { localImage } from '../Component/Image';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Loader from '../Component/Loader';
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch';
import { Image } from 'react-native';
const AboutUs = () => {
    const { width } = useWindowDimensions();
    const [isLoaded, setIsLoaded] = useState(false);
    const { defaultTheme } = useSelector(state => state)
    const [About, setAbout] = useState([])
    const navigation = useNavigation();
    useEffect(() => {
        getData();
    }, []);
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
            <View style={[styles.container, { backgroundColor: defaultTheme ? "#000" : "#fff" }]}>
                <HeaderWithoutSearch Header={"About Us"} />
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={localImage.logo} style={{ width: DeviceWidth * 40 / 100, resizeMode: 'contain', height: DeviceHeigth * 20 / 100 }} />
                </View>
                <View style={{ marginHorizontal: 20, height: DeviceHeigth * 90 / 100 }}>
                    <FlatList data={About} renderItem={elements => {
                        return (
                            <View>
                                <HTMLRender source={{ html: elements.item.st_aboutus }} tagsStyles={customStyle = {
                                    p: {
                                        color: defaultTheme ? "#fff" : "#000"
                                    },
                                    strong: {
                                        color: '#f39c1f',
                                        fontSize: 20,
                                    }
                                }} contentWidth={width} />
                            </View>)
                    }} />
                </View>
            </View>
        )
    }
    else {
        return (

            <Loader />

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