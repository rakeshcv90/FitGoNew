import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    Image,
    StatusBar,
    SafeAreaView,
    FlatList,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { DeviceHeigth, DeviceWidth } from '../Component/Config';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Api, Appapi } from '../Component/Config';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux'
import axios from 'axios';
import Loader from '../Component/Loader';
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch'
const SingleDay = () => {
    const [ApiData, setApiData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const { defaultTheme } = useSelector(state => state)
    const route = useRoute();
    const navigation = useNavigation()
    const data = route.params;
    const Data = (data)
    console.log(data)
    useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        try {
            const data = await axios(`${Api}/${Appapi.Days}?id=${Data.Id}&day=${Data.Day}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'Multipart/form-data',
                },
            });
            setApiData(data.data);
            console.log("tfufgyh", ApiData)
            setIsLoaded(true);
        } catch (error) {
            console.log("eroror", error)
        }
    };
    if (!isLoaded) {
        return (
            <View>
                <Loader />
            </View>
        )
    }
    else if (isLoaded == true && ApiData.length > 0) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: defaultTheme ? "#000" : "#fff" }]}>
                <HeaderWithoutSearch Header={Data.DayName} />
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View>
                        <FlatList
                            data={ApiData}
                            renderItem={elements => (
                                <TouchableOpacity>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            margin: 10,
                                            alignItems: 'center',
                                        }}>
                                        <View >
                                            <Image
                                                source={{ uri: elements.item.image }}
                                                style={styles.Image}
                                            /></View>
                                        <View>
                                            <View style={styles.container3}>

                                                <Text
                                                    style={[
                                                        styles.flatListTitle,
                                                        { color: defaultTheme == true ? '#fff' : '#000' },
                                                    ]}>
                                                    {elements.item.title}
                                                </Text>
                                                <Icons name="chevron-right" size={20} color={'#f39c1f'} />
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                    <TouchableOpacity style={styles.Startbtn}>
                        <Icons name="play" size={25} /><Text style={{ color: '#000' }}>START NOW</Text></TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
    else if (isLoaded && ApiData.length == 0) {
        return (
            <SafeAreaView style={[styles.RestDayCntnr,{backgroundColor: defaultTheme ? "#000" : "#fff"}]}>
                <View style={styles.closeButton}>
                    <TouchableOpacity onPress={() => {
                        navigation.goBack()
                    }}><Icons name="close" size={27} color={defaultTheme?"#fff":"#000"}/></TouchableOpacity>
                    <Text style={{fontSize:22,color:defaultTheme?"#fff":"#000"}}>{Data.DayName}</Text>
                    <Text></Text></View>
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center' }}>
                    <Icons name="bed" size={50} color={'#f39c1f'}/>
                   <Text style={{fontSize:20,marginVertical:5,color:defaultTheme?"#fff":"#000"}}>Rest Day</Text>
                   <Text style={{fontSize:17,color:defaultTheme?"#fff":"#000"}}>It's Part of the Program</Text>
                </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    Image: {
        width: 60,
        height: 60,
        margin: 10,
        borderRadius: 60 / 2,
        overflow: 'hidden'
    },
    container3: {
        flexDirection: 'row',
        alignItems: 'center',
        width: (DeviceWidth * 70) / 100,
        justifyContent: 'space-between',
    },
    flatListTitle: {
        fontSize: 16,
    },
    Startbtn: {
        backgroundColor: '#f39c1f',
        margin: 20,
        width: DeviceWidth * 90 / 100,
        height: DeviceHeigth * 7 / 100,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    RestDayCntnr: {
        flex: 1
    },
    closeButton:{
        flexDirection:'row',
        justifyContent:'space-between',
        margin:15
    }
});
export default SingleDay