import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    Image,
    Linking
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { DeviceWidth, DeviceHeigth } from '../../Component/Config';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Api, Appapi } from '../../Component/Config';
import Loader from '../../Component/Loader';
import { useSelector } from 'react-redux';
import HeaderWithoutSearch from '../../Component/HeaderWithoutSearch';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Divider } from 'react-native-paper';
const LatestProducts = () => {
    const [getLatestprdct, setLatestprdct] = useState([])
    const [isLoaded, setIsLoaded] = useState(false);
    const { defaultTheme } = useSelector(state => state)
    useEffect(() => {
        getLatestProducts()
    }, []);
    const getLatestProducts = async () => {
        try {
            const data = await axios(`${Api}/${Appapi.Products}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'Multipart/form-data',
                },
            });
            setLatestprdct(data.data);
            // console.log(data.data.data);
            setIsLoaded(true);
        } catch (error) { }
    }
    if (isLoaded) {
        return (
            <SafeAreaView style={{flex:1,backgroundColor:defaultTheme?"#000":"#fff"}}>
                <HeaderWithoutSearch Header={"Latest Products"}/>
                <View style={{ height: DeviceHeigth * 35 / 100 ,margin:10 }}>
                    <FlatList
                        data={getLatestprdct}
                        renderItem={elements => (
                            <TouchableOpacity style={{ height: (DeviceHeigth * 10) / 100 }}
                                onPress={() => {
                                    Linking.openURL(elements.item.link)
                                }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginLeft: 15
                                    }}>
                                    <Image
                                        source={{ uri: elements.item.image }}
                                        style={{ height: 60, width: 60, borderRadius: 60 / 2 }}
                                    />
                                    <View
                                        style={{
                                            justifyContent: 'space-between',
                                            marginLeft: 10,
                                            flexDirection: 'row',
                                            width: (DeviceWidth * 76) / 100,
                                            alignItems: 'center',
                                        }}>
                                        <View>
                                            <Text style={{ color: defaultTheme == true ? "#fff" : "#000", fontWeight: '500' }}>{elements.item.title}</Text>
                                            {/* <Text style={{ color: '#f39c1f', fontWeight: '500' }}>
                                                {elements.item.price}
                                            </Text> */}
                                        </View>
                                        <Icon name="chevron-right" size={20} color={defaultTheme == true ? "#fff" : "#000"} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
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
export default LatestProducts